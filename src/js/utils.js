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
    getAllComponents(form)
        .forEach(component => {
            let componentElement = document.getElementById(component.id);

            let conditionResults = component.conditions.map(condition => {
                let otherComponent = getComponent(form, condition.ifRule.otherComponentId);

                if (otherComponent) {
                    return otherComponent.currentValues.includes(condition.ifRule.value)
                }

                return false;
            });

            if (component.conditions.length > 0) {
                let visibleByDefault = component.conditions[0].thenRule.isHidden;
                let hiddenIfConditionsMet = component.conditions[0].thenRule.isHidden;

                if (!visibleByDefault) {
                    componentElement.classList.add('cf-hidden');
                } else {
                    componentElement.classList.remove('cf-hidden');
                }

                if (conditionResults.every(p => p)) {
                    if (hiddenIfConditionsMet) {
                        componentElement.classList.add('cf-hidden');

                    } else {
                        componentElement.classList.remove('cf-hidden');
                    }
                }
            }
        });
}