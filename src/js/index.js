import '../css/index.css'
import '../css/bootstrap.min.css'

import * as Utils from './utils.js';
import * as Elements from './elements.js';
import * as Events from './events.js'
import Condition from './conditions.js';
import templates from './components.js';

(function(window) {
    window.FormBuilder = class FormBuilder {
        constructor() {
            this.form = new Elements.CustomForm();
        }

        load(mainContainer) {
            let topRow = Utils.createDiv();
            let bottomRow = Utils.createDiv();
            let templatesContainer = Utils.createDiv();
            let editor = Utils.createDiv();

            topRow.appendChild(templatesContainer);
            topRow.appendChild(editor);
            mainContainer.appendChild(topRow);
            mainContainer.appendChild(bottomRow);

            mainContainer.classList.add(`cf-${this.form.id}`, 'cf-builder-container', 'cf-border');
            templatesContainer.classList.add('cf-templates-container', 'cf-border');
            editor.classList.add('cf-editor', 'cf-border');
            topRow.classList.add('cf-top-row');
            bottomRow.classList.add('cf-bottom-row');

            this.init();
        }

        init() {
            this.loadTemplates();
            this.configureDragDrop();
            this.reload();
        }

        loadTemplates() {
            templates.forEach(template => {
                let templateElement = Utils.createButton(template.title);
                templateElement.classList.add('cf-element-template');
                templateElement.setAttribute('data-cf-template-name', template.name);
                Utils.querySelector(this.form, '.cf-templates-container').appendChild(templateElement);
            });
        }

        configureDragDrop() {
            Events.registerDragStartEvent.apply(this);
            Events.registerDragOverEvent.apply(this);
            Events.registerDropEvent.apply(this);
        }

        reload() {
            this.form.render(html => {
                Utils.querySelector(this.form, '.cf-editor').innerHTML = html;
                this.applyExternalStyles();
                this.refreshEventsAndConditions();
            });
        }

        applyExternalStyles() {
            Utils.querySelectorAll(this.form, '.cf-templates-container>button').forEach(element => element.classList.add('btn', 'btn-primary'));
            Utils.querySelectorAll(this.form, '.cf-condition-row>button:nth-of-type(1)').forEach(element => element.classList.add('btn', 'btn-success'));
            Utils.querySelectorAll(this.form, '.cf-condition-row>button:nth-of-type(2)').forEach(element => element.classList.add('btn', 'btn-danger'));
        }

        regenerateConditions() {
            Utils.querySelector(this.form, '.cf-bottom-row').innerHTML = '';

            Utils.getAllComponents(this.form).forEach(component => {
                component.conditions.forEach(condition => {
                    let conditionalRowElement = Utils.createDiv();
                    conditionalRowElement.classList.add('cf-condition-row', 'cf-border');
                    Utils.querySelector(this.form, '.cf-bottom-row').appendChild(conditionalRowElement);

                    conditionalRowElement.appendChild(Utils.createDiv('If'));
                    conditionalRowElement.appendChild(Utils.createDiv(`${component.title}`));
                    conditionalRowElement.appendChild(Utils.createDiv('='));

                    let ifValueElement = Utils.createInput(condition.ifRule.value);
                    conditionalRowElement.appendChild(ifValueElement);
                    conditionalRowElement.appendChild(Utils.createDiv('Then'));

                    let visibilitySelectElement = Utils.createSelect();
                    visibilitySelectElement.options.add(new Option('', ''));
                    visibilitySelectElement.options.add(new Option('Show', 'show'));
                    visibilitySelectElement.options.add(new Option('Hide', 'hide'));
                    visibilitySelectElement.value = condition.thenRule.isHidden ? 'hide' : 'show';
                    conditionalRowElement.appendChild(visibilitySelectElement);

                    let hideComponentListElement = Utils.createSelect();

                    Utils.getAllComponents(this.form).filter(c => c.id !== component.id).forEach(element => {
                        let component = Utils.getComponent(this.form, element.id);
                        hideComponentListElement.options.add(new Option(component.title, component.id));

                        document.getElementById(component.id).addEventListener('blur', event => {
                            Array.from(hideComponentListElement.options).find(o => o.value === event.target.id).text = event.target.innerHTML;
                        });
                    });

                    hideComponentListElement.value = condition.thenRule.componentId;
                    conditionalRowElement.appendChild(hideComponentListElement);

                    let saveConditionElement = Utils.createButton('Save');
                    saveConditionElement.setAttribute('disabled', 'true');
                    conditionalRowElement.appendChild(saveConditionElement);

                    saveConditionElement.addEventListener('click', event => {
                        condition.ifRule.value = ifValueElement.value;
                        condition.thenRule.componentId = hideComponentListElement.value;
                        condition.thenRule.isHidden = visibilitySelectElement.value === 'hide';
                        event.target.setAttribute('disabled', 'true');
                    });

                    let deleteConditionElement = Utils.createButton('Delete');

                    conditionalRowElement.appendChild(deleteConditionElement);
                    deleteConditionElement.addEventListener('click', event => {
                        component.conditions = component.conditions.filter(c => c.id !== condition.id);
                        this.regenerateConditions();
                    });

                    [visibilitySelectElement, hideComponentListElement, ifValueElement].forEach(element => element.addEventListener('change', event => saveConditionElement.removeAttribute('disabled')));
                });
            });

            this.applyExternalStyles();
        }

        refreshEventsAndConditions() {
            this.regenerateConditions();
            Events.registerLabelEditEvent.apply(this);
            Events.registerInputChangeEvent.apply(this);
            Events.registerAddNewConditionEvent.apply(this);
        }
    }
})(window);