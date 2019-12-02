import Mustache from 'mustache'
const uuidv4 = require('uuid/v4');

export function uniqueId() {
    return uuidv4();
}

export function render(template, view) {
    return Mustache.render(template, view);
}

export function querySelector(form, selector) {
    return document.getElementById(form.id)
        .querySelector(selector);
}

export function querySelectorAll(form, selector) {
    return document.getElementById(form.id)
        .querySelectorAll(selector);
}

export function getSection(form, id) {
    return form.sections.find(section => section.id === id);
}

export function getComponent(form, id) {
    return getAllComponents(form)
        .find(component => component.id === id);
}

export function getAllComponents(form) {
    let allComponents = [];
    form.sections.map(section => allComponents.push(...section.components));
    return allComponents;
}

export function getCondition(component, id) {
    return component.conditions.find(condition => condition.id === id);
}

export function evaluateConditions(form) {
    querySelectorAll(form, '.cf-component')
        .forEach(element => {
            element.classList.remove('cf-hidden');
        });

    getAllComponents(form)
        .forEach(component => {
            component.conditions.forEach(condition => {
                let element = document.getElementById(condition.thenRule.componentId);
                if (component.currentValues.includes(condition.ifRule.value)) {
                    if (condition.thenRule.isHidden) {
                        element.classList.add('cf-hidden');
                    } else {
                        element.classList.remove('cf-hidden');
                    }
                }
            });
        });
}