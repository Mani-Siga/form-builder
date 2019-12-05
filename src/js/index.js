import 'spectre.css'
import '../css/index.css'

import {
    Form,
    FormSection
} from './form.js';

import Condition from './conditions';

import {
    ComponentTemplates,
    Component
} from './components.js';

import * as Utils from './utils.js';
import Templates from './templates.js'
import * as EventRegistrations from './eventRegistrations.js'

import Sortable from 'sortablejs';

(function(window) {
    window.FormBuilder = class FormBuilder {
        constructor() {
            this.form = new Form();
        }

        render(mainContainer, formData) {
            if (formData) {
                this.form.id = formData.id;

                formData.sections.forEach(formSection => {
                    let section = new FormSection();
                    section.id = formSection.id;
                    this.form.sections.push(section);

                    formSection.components.forEach(formComponent => {
                        let component = new Component();
                        component.id = formComponent.id;
                        component.title = formComponent.title;
                        component.type = formComponent.type;
                        component.required = formComponent.required;
                        component.options = formComponent.options;
                        component.name = formComponent.name;
                        component.templateId = formComponent.templateId;
                        component.conditions = formComponent.conditions;
                        component.currentValues = formComponent.currentValues;

                        section.components.push(component);
                    });
                });
            }

            document.getElementById(mainContainer.id)
                .innerHTML = Utils.render(Templates.MainTemplate.data, {
                    vm: {
                        form: this.form,
                        componentTemplates: ComponentTemplates
                    }
                });

            this.buildForm();
            this.setupDragDrop();
            EventRegistrations.registerLogFormDataEvent.apply(this);
            EventRegistrations.registerOpenFormPreviewEvent.apply(this);
            EventRegistrations.registerCloseFormPreviewEvent.apply(this);
        }

        buildForm() {
            let formElement = Utils.querySelector(this.form, '.cf-form');

            formElement.innerHTML = Utils.render(Templates.FormTemplate.data, {
                vm: this.form
            });

            this.refreshDragDrop();
            EventRegistrations.registerConfigurationOpenedEvent.apply(this);
            EventRegistrations.registerFormInputChangedEvent.apply(this);

            // Show form
            let configDialogElement = Utils.querySelector(this.form, '.cf-config');
            formElement.classList.remove('cf-hidden');
            configDialogElement.classList.add('cf-hidden');
        }

        isInPreviewMode() {
            return !Utils.querySelector(this.form, '.cf-close-preview')
                .classList.contains('cf-hidden');
        }

        preview() {
            event.preventDefault();

            this.buildForm();

            Utils.querySelector(this.form, '.cf-component-templates')
                .classList.add('cf-hidden');
            Utils.querySelector(this.form, '.cf-open-preview')
                .classList.add('cf-hidden');
            Utils.querySelector(this.form, '.cf-close-preview')
                .classList.remove('cf-hidden');
            Utils.evaluateConditions(this.form);
        }

        closePreview() {
            event.preventDefault();

            Utils.querySelector(this.form, '.cf-close-preview')
                .classList.add('cf-hidden');
            Utils.querySelectorAll(this.form, '.cf-component-templates, .cf-open-preview')
                .forEach(element => element.classList.remove('cf-hidden'));

            this.buildForm();
        }

        reorder() {
            let existingForm = this.form;
            let reorderedForm = new Form();

            Utils.querySelectorAll(existingForm, '.cf-section')
                .forEach(sectionElement => {
                    let existingSection = Utils.getSection(existingForm, sectionElement.id);

                    if (existingSection) {

                        let newSection = new FormSection();
                        reorderedForm.sections.push(newSection);

                        sectionElement.querySelectorAll('.cf-component')
                            .forEach(componentElement => {
                                let existingComponent = Utils.getComponent(existingForm, componentElement.id);

                                if (existingComponent) {
                                    newSection.components.push(existingComponent);
                                }
                            });
                    }
                });

            existingForm.sections = reorderedForm.sections.filter(section => section.components.length > 0);
            this.buildForm();
        }

        setupDragDrop() {
            let self = this;

            Sortable.create(Utils.querySelector(self.form, '.cf-component-templates'), {
                group: {
                    put: true,
                    pull: 'clone',
                },
                dragClass: 'cf-drag',
                sort: false,
                swapThreshold: 0.1,
                onAdd(event) {
                    event.item.remove();
                    self.reorder();
                }
            });

            Sortable.create(Utils.querySelector(self.form, '.cf-form'), {
                group: {
                    put: true,
                    pull: false
                },
                dragClass: 'cf-drag',
                sort: true,
                onAdd(event) {
                    self.createComponent(event);
                },
                onSort(event) {
                    self.reorder();
                }
            });
        }

        refreshDragDrop() {
            let self = this;

            Utils.querySelectorAll(self.form, '.cf-section')
                .forEach(section => {
                    Sortable.create(section, {
                        group: {
                            put: true,
                            pull: true
                        },
                        sort: true,
                        dragClass: 'cf-drag',
                        onAdd(event) {
                            self.createComponent(event);
                        },
                        onSort(event) {
                            self.reorder();
                        }
                    });
                });

        }

        createComponent(event) {
            if (event.from.classList.contains('cf-component-templates')) {
                let templateName = event.item.getAttribute('data-cf-component-template-name');
                let template = ComponentTemplates.find(t => t.name === templateName);

                let section = null;
                let sectionElement = event.target.closest('.cf-section');

                if (!sectionElement) {
                    section = new FormSection();
                    this.form.sections.push(section);
                } else {
                    section = Utils.getSection(this.form, sectionElement.id);
                }

                template.copyTo(section);
                this.buildForm();
            } else if (event.from.classList.contains('cf-section')) {
                if (event.to.classList.contains('cf-form')) {
                    let section = new FormSection();
                    this.form.sections.push(section);

                    let component = Utils.getComponent(this.form, event.item.id);
                    section.components.push(component);

                    let sourceSection = Utils.getSection(this.form, event.from.id)
                    sourceSection.components = sourceSection.components.filter(c => c.id !== component.id);
                    this.buildForm();
                } else {
                    this.reorder();
                }
            }
        }

        showConfig() {
            let formElement = Utils.querySelector(this.form, '.cf-form');
            let configElement = Utils.querySelector(this.form, '.cf-config');
            formElement.classList.add('cf-hidden');
            configElement.classList.remove('cf-hidden');
        }

        addNewOption(event) {
            event.preventDefault();

            let component = this.getInMemoryConfiguration();
            component.options.push({
                key: 'enter-unique-key-name',
                value: 'enter-value'
            });

            this.editConfiguration(JSON.stringify(component));
        }

        addNewCondition(event) {
            event.preventDefault();

            let component = this.getInMemoryConfiguration();
            component.conditions.push(new Condition());
            this.editConfiguration(JSON.stringify(component));
        }

        deleteOption(event) {
            event.preventDefault();
            let component = this.getInMemoryConfiguration();
            let optionKey = event.target.getAttribute('data-component-option-key');
            component.options = component.options.filter(option => option.key !== optionKey);
            this.editConfiguration(JSON.stringify(component));
        }

        deleteCondition(event) {
            event.preventDefault();

            let component = this.getInMemoryConfiguration();
            let conditionIdToBeDeleted = event.target.getAttribute('data-component-condition-id');
            component.conditions = component.conditions.filter(condition => condition.id !== conditionIdToBeDeleted);
            this.editConfiguration(JSON.stringify(component));
        }

        editConfiguration(data) {
            if (this.isInPreviewMode()) return;
            localStorage.setItem(`configuration-${this.form.id}`, data);

            let component = JSON.parse(data);
            let otherComponents = Utils.getAllComponents(this.form)
                .filter(c => c.id !== component.id && !['header', 'label'].includes(c.templateName));

            Utils.querySelector(this.form, '.cf-config')
                .innerHTML = Utils.render(Templates.ConditionTemplate.data, {
                    vm: {
                        component: component,
                        otherComponents: otherComponents
                    }
                });

            let configForm = Utils.querySelector(this.form, '.cf-config-form');

            configForm.querySelectorAll('.cf-component-condition')
                .forEach((conditionRow, conditionRowIndex) => {
                    let otherComponentId = component.conditions[conditionRowIndex].ifRule.otherComponentId;;
                    let otherComponent = Utils.getComponent(this.form, otherComponentId);

                    let otherComponentElement = conditionRow.querySelector('.cf-component-condition-othercomponent-selector');
                    otherComponentElement.value = otherComponentId;

                    if (otherComponentId) {
                        configForm.querySelector(".cf-component-condition-if-value-list")
                            .innerHTML = Utils.render(Templates.IfValueDataListTemplate.data, {
                                vm: otherComponent
                            });
                    }

                    otherComponentElement.addEventListener('change', event => {
                        let otherComponentId = event.target.value;

                        if (otherComponentId) {
                            let otherComponent = Utils.getComponent(this.form, otherComponentId);
                            configForm.querySelector(".cf-component-condition-if-value-list")
                                .innerHTML = Utils.render(Templates.IfValueDataListTemplate.data, {
                                    vm: otherComponent
                                });
                        }
                    });
                });

            EventRegistrations.registerConfigurationSavedEvent.apply(this);
            EventRegistrations.registerConfigurationClosedEvent.apply(this);
            EventRegistrations.registerOptionAddedEvent.apply(this);
            EventRegistrations.registerConditionAddedEvent.apply(this);
            EventRegistrations.registerConditionDeletedEvent.apply(this);
            EventRegistrations.registerOptionDeletedEvent.apply(this);

            this.showConfig();
        }

        getInMemoryConfiguration() {
            let configForm = Utils.querySelector(this.form, '.cf-config-form');
            let component = JSON.parse(localStorage.getItem(`configuration-${this.form.id}`));

            component.title = configForm.componentTitle.value;
            component.required = configForm.componentRequired.checked;

            let optionRows = configForm.querySelectorAll('.cf-component-option');
            let optionKeys = configForm.querySelectorAll('.cf-component-option-key');
            let optionValues = configForm.querySelectorAll('.cf-component-option-value');

            if (optionRows.length > 0) {
                component.options = [];

                optionRows.forEach((_, optionIndex) => {
                    component.options.push({
                        key: optionKeys[optionIndex].value,
                        value: optionValues[optionIndex].value
                    })
                });
            }

            component.conditions = [];
            let conditionnRows = configForm.querySelectorAll('.cf-component-condition');
            let conditionOtherComponentSelectors = configForm.querySelectorAll('.cf-component-condition-othercomponent-selector');
            let conditionOtherComponentIfValues = configForm.querySelectorAll('.cf-component-condition-othercomponent-if-value');

            conditionnRows.forEach((conditionRow, conditionIndex) => {
                let condition = new Condition();
                condition.id = conditionRow.getAttribute('data-component-condition-id');
                condition.ifRule.otherComponentId = conditionOtherComponentSelectors[conditionIndex].value;
                condition.ifRule.otherComponentValue = conditionOtherComponentIfValues[conditionIndex].value;
                condition.thenRule.isHidden = configForm.elements.componentVisibility.value === 'hide';
                component.conditions.push(condition);
            });

            return component;
        }

        saveConfiguration(event) {
            let configForm = Utils.querySelector(this.form, '.cf-config-form');
            let formElements = [...configForm.elements];
            let missingValues = formElements.map(element => element.validity.valueMissing);

            if (!missingValues.includes(true)) {
                event.preventDefault();

                let componentId = configForm.getAttribute('data-component-id');
                let component = Utils.getComponent(this.form, componentId);

                let clonedComponent = this.getInMemoryConfiguration();
                component.title = clonedComponent.title;
                component.required = clonedComponent.required;
                component.options = clonedComponent.options;
                component.conditions = clonedComponent.conditions;
            }
        }

        evaluateConditions(event) {
            if (!this.isInPreviewMode()) return;

            let componentElement = event.target.closest('.cf-component');

            if (componentElement) {
                let component = Utils.getComponent(this.form, componentElement.id);

                if (component) {
                    let selectedValues = [];

                    if (['dropdownlist'].includes(component.templateName)) {
                        selectedValues.push(event.target.options[event.target.selectedIndex].text);
                    } else if (['checkboxgroup'].includes(component.templateName)) {
                        Array.from(componentElement.querySelectorAll('span>input[type=checkbox]'))
                            .filter(checkbox => checkbox.checked)
                            .map(checkbox => {
                                selectedValues.push(checkbox.getAttribute('data-value'));
                            });
                    } else if (['radiogroup'].includes(component.templateName)) {
                        selectedValues.push(event.target.getAttribute('data-value'));
                    } else {
                        selectedValues.push(event.target.value);
                    }

                    component.currentValues = selectedValues;
                    Utils.evaluateConditions(this.form);
                }
            }
        }
    }
})(window);