import * as Utils from './utils.js'
import Condition from './conditions.js';
import templates from './components.js';

export function registerTemplateDragStartEvent() {
    Utils.querySelectorAll(this.form, '.cf-element-template').forEach(element => {
        element.setAttribute('draggable', "true");
        element.addEventListener('dragstart', onTemplateDragStartedEvent.bind(this));
    });
}

export function registerComponentDragStartEvent() {
    Utils.querySelectorAll(this.form, '.cf-component').forEach(element => {
        element.setAttribute('draggable', "true");
        element.addEventListener('dragstart', onComponentDragStartedEvent.bind(this));
    });
}

export function registerTemplateDragOverEvent() {
    Utils.querySelectorAll(this.form, '.cf-editor').forEach(element => element.addEventListener('dragover', onTemplateDragOverEvent.bind(this)));
}

export function registerComponentDragOverEvent() {
    Utils.querySelector(this.form, '.cf-templates-container').addEventListener('dragover', onComponentDragOverEvent.bind(this));
    Utils.querySelectorAll(this.form, '.cf-section').forEach(element => element.addEventListener('dragover', onComponentDragOverEvent.bind(this)));
}

export function registerTemplateDropEvent() {
    Utils.querySelector(this.form, '.cf-editor').addEventListener('drop', onTemplateDropped.bind(this));
}

export function registerComponentDropEvent() {
    Utils.querySelectorAll(this.form, '.cf-section').forEach(element => element.addEventListener('drop', onComponentDroppedEvent.bind(this)));
}

export function registerComponentDeletedEvent() {
    Utils.querySelector(this.form, '.cf-templates-container').addEventListener('drop', onComponentDroppedEvent.bind(this));
}

export function registerLabelEditEvent() {

    Utils.querySelectorAll(this.form, '[contenteditable=true]').forEach(element => element.addEventListener('input', onLabelEditedEvent.bind(this)))
}

export function registerAddNewConditionEvent() {
    Utils.querySelectorAll(this.form, '.cf-component').forEach(element => element.addEventListener('dblclick', onAddNewConditionEvent.bind(this)));
};

export function registerInputChangeEvent() {
    Utils.querySelectorAll(this.form, '.cf-component>span').forEach(element => ['input', 'change'].forEach(eventName => element.addEventListener(eventName, onInputChangedEvent.bind(this))));
}

function onTemplateDragStartedEvent(event) {
    event.dataTransfer.setData("templateName", event.target.getAttribute('data-cf-template-name'))
}

function onTemplateDragOverEvent(event) {
    event.preventDefault();
}

function onTemplateDropped(event) {
    let templateTag = event.dataTransfer.getData("templateName");
    let template = templates.find(d => d.name === templateTag);

    if (template) {
        let section = null;
        let sectionElement = event.target.closest('.cf-section');

        if (sectionElement) {
            section = Utils.getSection(this.form, sectionElement.id);
        } else {
            section = this.form.addSection();
        }

        template.copyTo(section);
        this.reload();
    }
};

function onComponentDragStartedEvent(event) {
    event.dataTransfer.setData("componentId", event.target.id);
}

function onComponentDragOverEvent(event) {
    event.preventDefault();
}

function onComponentDroppedEvent(event) {
    let sourceComponentId = event.dataTransfer.getData("componentId");
    let sourceComponent = Utils.getComponent(this.form, sourceComponentId);

    if (sourceComponent) {
        let sourceSectionId = document.getElementById(sourceComponentId).closest('.cf-section').id;
        let sourceSection = Utils.getSection(this.form, sourceSectionId);

        sourceSection.components = sourceSection.components.filter(component => component.id !== sourceComponentId);

        let destinationSelectionElement = event.target.closest('.cf-section');

        if (destinationSelectionElement) {
            let destinationSectionId = destinationSelectionElement.id;
            let destinationSection = Utils.getSection(this.form, destinationSectionId);

            destinationSection.components.push(sourceComponent);
        }

        if (sourceSection.components.length === 0) {
            this.form.sections = this.form.sections.filter(section => section.id !== sourceSectionId);
        }

        this.reload();
    }
}

function onLabelEditedEvent(event) {
    let component = Utils.getAllComponents(this.form).find(component => component.id === event.target.parentElement.id);

    if (component) {
        component.title = event.target.innerText;
        this.regenerateConditions();
    }
}

function onInputChangedEvent(event) {
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
}

function onAddNewConditionEvent(event) {
    let component = Utils.getComponent(this.form, event.target.id)

    if (component) {
        component.conditions.push(new Condition());
        this.regenerateConditions();
    }
}