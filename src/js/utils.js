const uuidv4 = require('uuid/v4');

export function uniqueId() {
    return uuidv4();
}

export function createDiv(text = '') {
    let element = document.createElement('div');
    element.innerText = text;
    return element;
}

export function createSelect() {
    return document.createElement('select');
}

export function createInput(text = '') {
    let element = document.createElement('input');
    element.type = 'text';
    element.value = text;
    return element;
}

export function createButton(text = '') {
    let element = document.createElement('button');
    element.innerText = text;
    return element;
}

export function querySelector(form, selector) {
    return document.querySelector(`.cf-${form.id}`).querySelector(selector);
}

export function querySelectorAll(form, selector) {
    return document.querySelector(`.cf-${form.id}`).querySelectorAll(selector);
}

export function getComponent(form, id) {
    return getAllComponents(form).find(component => component.id === id);
}

export function getAllComponents(form) {
    let allComponents = [];
    form.sections.map(section => allComponents.push(...section.components));
    return allComponents;
}

export function evaluateConditions(form) {
    querySelectorAll(form, '.cf-component').forEach(element => {
        element.classList.remove('cf-component-hidden');
    });

    // Start applying conditional logic
    getAllComponents(form).forEach(component => {
        component.conditions.forEach(condition => {
            let element = document.getElementById(condition.thenRule.componentId);

            if (element) {
                element.classList.remove('cf-component-hidden');
            }

            if (condition.evaluate(component.currentValues) && condition.thenRule.isHidden) {
                document.getElementById(condition.thenRule.componentId).classList.add('cf-component-hidden');
            }
        });
    });
}