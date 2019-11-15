import * as uuid from 'uuid/v4';

export function uniqueId() {
    return uuid();
}

export function getControl(form, id) {
    return getAllControls(form).find(control => control.id === id);
}

export function getAllControls(form) {
    let allControls = [];
    form.sections.map(section => allControls.push(...section.controls));
    return allControls;
}

export function evaluateConditions(control, selectedValue) {
    control.conditions.forEach(condition => {
        let element = document.getElementById(condition.thenRule.controlId);

        if (element) {
            element.classList.remove('cf-control-hidden');
        }
    });

    control.conditions.forEach(condition => {
        if (condition.evaluate(selectedValue) && condition.thenRule.isHidden) {
            document.getElementById(condition.thenRule.controlId).classList.add('cf-control-hidden');
        }
    });
}

export function createElement(tag, type, text) {
    let element = document.createElement(tag);
    element.type = type;
    element.value = text || '';
    element.innerText = text;
    return element;
}