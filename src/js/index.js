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
            EventRegistrations.registerFormInputChangedEvent.apply(this);
        }

        buildForm() {
            let self = this;
            let formElement = Utils.querySelector(self.form, '.cf-form');

            formElement.innerHTML = Utils.render(Templates.FormTemplate, {
                vm: this.form
            });

            this.refreshDragDrop();
            EventRegistrations.registerEditConfigurationEvent.apply(this);
        }

        reorder() {
            let form = new Form();

            document.getElementById(this.form.id)
                .querySelectorAll('.cf-section')
                .forEach(sectionElement => {
                    let existingSection = Utils.getSection(this.form, sectionElement.id);

                    if (existingSection) {
                        let newSection = form.addSection();

                        sectionElement.querySelectorAll('.cf-component')
                            .forEach(componentElement => {
                                let existingComponent = Utils.getComponent(this.form, componentElement.id);

                                if (existingComponent) {
                                    newSection.components.push(existingComponent);
                                }
                            });
                    }
                });

            this.form.sections = form.sections.filter(section => section.components.length > 0);
            this.buildForm();
        }

        setupDragDrop() {
            let self = this;

            Sortable.create(Utils.querySelector(self.form, '.cf-templates-container'), {
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
            if (event.from.classList.contains('cf-templates-container')) {
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

        editForm() {
            let formElement = Utils.querySelector(this.form, '.cf-form');
            let configDialogElement = Utils.querySelector(this.form, '.cf-config');
            formElement.classList.remove('cf-hidden');
            configDialogElement.classList.add('cf-hidden');
            this.buildForm();
        }

        editConfiguration(componentId) {
            let component = Utils.getComponent(this.form, componentId);
            let otherComponents = Utils.getAllComponents(this.form)
                .filter(c => c.id !== componentId);

            Utils.querySelector(this.form, '.cf-config')
                .innerHTML = Utils.render(Templates.ConditionTemplate, {
                    vm: {
                        component: component,
                        otherComponents: otherComponents
                    }
                });

            Utils.querySelectorAll(this.form, '.cf-condition')
                .forEach((element, index) => {
                    let targetIdElement = element.querySelector('.cf-target-id');
                    targetIdElement.value = component.conditions[index].thenRule.componentId;
                });

            EventRegistrations.registerSaveConfigurationEvent.apply(this);
            EventRegistrations.registerAddNewOptionEvent.apply(this);
            EventRegistrations.registerAddNewConditionEvent.apply(this);
            EventRegistrations.registerDeleteConditionEvent.apply(this);

            let formElement = Utils.querySelector(this.form, '.cf-form');
            let configDialogElement = Utils.querySelector(this.form, '.cf-config');
            formElement.classList.add('cf-hidden');
            configDialogElement.classList.remove('cf-hidden');
        }

        addNewOption(event) {
            let componentId = event.target.getAttribute('data-component-id');
            let component = Utils.getComponent(this.form, componentId);
            component.addOption();
            this.editConfiguration(componentId);
        }

        addNewCondition(event) {
            let componentId = event.target.getAttribute('data-component-id');
            let component = Utils.getComponent(this.form, componentId);
            component.addCondition(new Condition());
            this.editConfiguration(componentId);
        }

        deleteCondition(event) {
            let componentId = event.target.getAttribute('data-component-id');
            let component = Utils.getComponent(this.form, componentId);
            let conditionId = event.target.getAttribute('data-condition-id');
            component.conditions = component.conditions.filter(condition => condition.id !== conditionId);
            this.editConfiguration(componentId);
        }

        saveConfiguration(event) {
            let componentId = event.target.getAttribute('data-component-id');
            let component = Utils.getComponent(this.form, componentId);
            component.title = Utils.querySelector(this.form, '.cf-title')
                .value;
            component.required = Utils.querySelector(this.form, '.cf-required')
                .checked;

            component.options = [];
            Utils.querySelectorAll(this.form, '.cf-option')
                .forEach(element => {
                    let key = element.querySelector('.cf-option-key')
                        .value;
                    let value = element.querySelector('.cf-option-value')
                        .value;
                    component.options.push({
                        key: key,
                        value: value
                    })
                });

            component.conditions = [];
            Utils.querySelectorAll(this.form, '.cf-condition')
                .forEach(element => {
                    let condition = new Condition();
                    condition.ifRule.value = element.querySelector('.cf-if-value')
                        .value;
                    condition.thenRule.isHidden = element.querySelector('.cf-target-visibility')
                        .value === 'hide';
                    condition.thenRule.componentId = element.querySelector('.cf-target-id')
                        .value;
                    component.addCondition(condition);
                });

            this.editForm();
        }

        evaluateConditions(event) {
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