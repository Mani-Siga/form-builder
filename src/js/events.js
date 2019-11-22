import * as Utils from './utils.js'
import Condition from './conditions.js';
import templates from './components.js';

export function registerDragStartEvent() {
    Utils.querySelectorAll(this.form, '.cf-element-template').forEach(element => {
        element.setAttribute('draggable', "true");
        element.addEventListener('dragstart', event => event.dataTransfer.setData("templateName", event.target.getAttribute('data-cf-template-name')));
    });
}

export function registerDragOverEvent() {
    Utils.querySelectorAll(this.form, '.cf-editor').forEach(element => {
        element.addEventListener('dragover', event => event.preventDefault());
    });
}

export function registerDropEvent() {
    Utils.querySelectorAll(this.form, '.cf-editor').forEach(element => {
        element.addEventListener('drop', event => {
            let templateTag = event.dataTransfer.getData("templateName");
            let template = templates.find(d => d.name === templateTag);

            if (template) {
                let section = this.form.addSection();
                template.copyTo(section);
                this.reload();
            }
        })
    });
}

export function registerLabelEditEvent() {
    Utils.querySelectorAll(this.form, '[contenteditable=true]').forEach(element => {
        element.addEventListener('input', event => {
            let component = Utils.getAllComponents(this.form).find(component => component.id === event.target.parentElement.id);

            if (component) {
                component.title = event.target.innerText;
                this.regenerateConditions();
            }
        });
    });
}

export function registerAddNewConditionEvent() {
    Utils.querySelectorAll(this.form, '.cf-section').forEach(element => {
        element.addEventListener('dblclick', event => {
            let componentElement = event.target.querySelector('.cf-component');

            if (componentElement) {
                let component = Utils.getComponent(this.form, componentElement.id);
                component.conditions.push(new Condition());
                this.regenerateConditions();
            }
        });
    });
};

export function registerInputChangeEvent() {
    Utils.querySelectorAll(this.form, '.cf-component>span').forEach(element => {
        ['input', 'change'].forEach(eventName => element.addEventListener(eventName, event => {
            let componentElement = event.target.closest('.cf-component');
            let component = Utils.getComponent(this.form, componentElement.id);

            if (component) {
                let selectedValues = [];

                if (['dropdownlist'].includes(component.templateName)) {
                    selectedValues.push(event.target.options[event.target.selectedIndex].text);
                } else if (['checkboxgroup'].includes(component.templateName)) {
                    Array.from(componentElement.querySelectorAll('span>input[type=checkbox]'))
                        .filter(checkbox => checkbox.checked).map(checkbox => {
                            selectedValues.push(checkbox.nextSibling.innerHTML);
                        });
                } else if (['radiogroup'].includes(component.templateName)) {
                    selectedValues.push(event.target.nextSibling.innerHTML);
                } else {
                    selectedValues.push(event.target.value);
                }

                component.currentValues = selectedValues;
                Utils.evaluateConditions(this.form);
            }
        }))
    });
}