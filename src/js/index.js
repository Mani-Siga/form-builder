import 'spectre.css'
import '../css/index.css'

import Form from './form.js';
import Condition from './conditions';
import ComponentTemplates from './components.js';

import * as Utils from './utils.js';
import * as Templates from './templates.js'
import * as EventRegistrations from './eventRegistrations.js'

import Sortable from 'sortablejs';

(function(window) {
    window.FormBuilder = class FormBuilder {
        constructor() {
            this.form = new Form();
        }

        render(mainContainer) {
            document.getElementById(mainContainer.id)
                .innerHTML = Utils.render(Templates.MainTemplate, {
                    vm: {
                        form: this.form,
                        componentTemplates: ComponentTemplates
                    }
                });

            this.buildForm();
            this.setupDragDrop();
        }

        buildForm() {
            this.form.isInPreviewMode = false;
            Utils.querySelector(this.form, '.cf-templates')
                .classList.remove('cf-hidden');

            let formElement = Utils.querySelector(this.form, '.cf-form');

            formElement.innerHTML = Utils.render(Templates.FormTemplate, {
                vm: this.form
            });

            this.refreshDragDrop();
            EventRegistrations.registerConfigurationOpenedEvent.apply(this);
            EventRegistrations.registerFormInputChangedEvent.apply(this);
            EventRegistrations.registerFormPreviewEvent.apply(this);
            EventRegistrations.registerCloseFormPreviewEvent.apply(this);

            // Show form
            let configDialogElement = Utils.querySelector(this.form, '.cf-config');
            formElement.classList.remove('cf-hidden');
            configDialogElement.classList.add('cf-hidden');
        }

        previewForm() {
            this.form.isInPreviewMode = true;

            event.preventDefault();
            Utils.querySelector(this.form, '.cf-templates')
                .classList.add('cf-hidden');
            Utils.querySelector(this.form, '.cf-preview')
                .classList.add('cf-hidden');
            Utils.querySelector(this.form, '.cf-close-preview')
                .classList.remove('cf-hidden');
            Utils.evaluateConditions(this.form);
        }

        reorder() {
            let existingForm = this.form;
            let reorderedForm = new Form();

            Utils.querySelectorAll(existingForm, '.cf-section')
                .forEach(sectionElement => {
                    let existingSection = Utils.getSection(existingForm, sectionElement.id);

                    if (existingSection) {
                        let newSection = reorderedForm.addSection();

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

            Sortable.create(Utils.querySelector(self.form, '.cf-templates'), {
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
            if (event.from.classList.contains('cf-templates')) {
                let templateName = event.item.getAttribute('data-cf-template-name');
                let template = ComponentTemplates.find(t => t.name === templateName);

                let section = null;
                let sectionElement = event.target.closest('.cf-section');

                if (!sectionElement) {
                    section = this.form.addSection();
                } else {
                    section = Utils.getSection(this.form, sectionElement.id);
                }

                template.copyTo(section);
                this.buildForm();
            } else if (event.from.classList.contains('cf-section')) {
                if (event.to.classList.contains('cf-form')) {
                    let section = this.form.addSection();
                    let component = Utils.getComponent(this.form, event.item.id);
                    section.addComponent(component);

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

            let component = this.getComponentConfiguration();
            component.options.push({
                key: 'enter-unique-key-name',
                value: 'enter-value'
            });

            this.editConfiguration(JSON.stringify(component));
        }

        addNewCondition(event) {
            event.preventDefault();

            let component = this.getComponentConfiguration();
            component.conditions.push(new Condition());
            this.editConfiguration(JSON.stringify(component));
        }

        deleteOption(event) {
            event.preventDefault();

            let component = this.getComponentConfiguration();
            let optionKey = event.target.getAttribute('data-option-key');
            component.options = component.options.filter(option => option.key !== optionKey);
            this.editConfiguration(JSON.stringify(component));
        }

        deleteCondition(event) {
            event.preventDefault();

            let component = this.getComponentConfiguration();
            let conditionId = event.target.getAttribute('data-condition-id');
            component.conditions = component.conditions.filter(condition => condition.id !== conditionId);
            this.editConfiguration(JSON.stringify(component));
        }

        editConfiguration(data) {
            if (this.form.isInPreviewMode) {
                return;
            }

            localStorage.setItem(`configuration-${this.form.id}`, data);

            let component = JSON.parse(data);
            let otherComponents = Utils.getAllComponents(this.form)
                .filter(c => c.id !== component.id);

            Utils.querySelector(this.form, '.cf-config')
                .innerHTML = Utils.render(Templates.ConditionTemplate, {
                    vm: {
                        component: component,
                        otherComponents: otherComponents
                    }
                });

            Utils.querySelectorAll(this.form, '.cf-condition')
                .forEach((element, index) => {
                    let otherComponentElement = element.querySelector('.cf-othercomponent-id');
                    otherComponentElement.value = component.conditions[index].ifRule.otherComponentId;
                });


            if (Array.isArray(component.options)) {
                Utils.querySelectorAll(this.form, '.cf-condition')
                    .forEach((element, index) => {
                        let ifValueElement = element.querySelector('.cf-if-value');
                        ifValueElement.value = (component.options.find(o => o.value === component.conditions[index].ifRule.value) || {})
                            .value;
                    });
            }

            EventRegistrations.registerConfigurationSavedEvent.apply(this);
            EventRegistrations.registerConfigurationClosedEvent.apply(this);
            EventRegistrations.registerOptionAddedEvent.apply(this);
            EventRegistrations.registerConditionAddedEvent.apply(this);
            EventRegistrations.registerConditionDeletedEvent.apply(this);
            EventRegistrations.registerOptionDeletedEvent.apply(this);

            this.showConfig();
        }

        getComponentConfiguration() {
            let component = JSON.parse(localStorage.getItem(`configuration-${this.form.id}`));

            component.title = Utils.querySelector(this.form, '.cf-title')
                .value;
            component.required = Utils.querySelector(this.form, '.cf-required-value')
                .checked;

            let options = [];
            Utils.querySelectorAll(this.form, '.cf-option')
                .forEach(element => {
                    let key = element.querySelector('.cf-option-key')
                        .value;
                    let value = element.querySelector('.cf-option-value')
                        .value;
                    options.push({
                        key: key,
                        value: value
                    })
                });

            component.options = Array.isArray(component.options) ? options : null;

            component.conditions = [];

            let isHidden = false;
            let isHiddenElement = Utils.querySelector(this.form, '.cf-source-visibility');

            if (isHiddenElement) {
                isHidden = isHiddenElement.value === 'hide';
            }

            Utils.querySelectorAll(this.form, '.cf-condition')
                .forEach(element => {
                    let condition = new Condition();
                    condition.id = element.getAttribute('data-condition-id');
                    condition.ifRule.value = element.querySelector('.cf-if-value')
                        .value;
                    condition.ifRule.otherComponentId = element.querySelector('.cf-othercomponent-id')
                        .value;
                    condition.thenRule.isHidden = isHidden;
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

                let componentId = event.target.getAttribute('data-component-id');
                let component = Utils.getComponent(this.form, componentId);

                let clonedComponent = this.getComponentConfiguration();
                component.title = clonedComponent.title;
                component.required = clonedComponent.required;
                component.options = clonedComponent.options;
                component.conditions = clonedComponent.conditions;
            }
        }

        evaluateConditions(event) {
            if (this.form.isInPreviewMode) {
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
    }
})(window);