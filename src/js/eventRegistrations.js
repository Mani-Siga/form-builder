import * as Utils from './utils.js'

export function registerEditConfigurationEvent() {
    Utils.querySelectorAll(this.form, '.cf-component')
        .forEach(element => element.addEventListener('dblclick', event => this.editConfiguration(event.target.closest('.cf-component')
            .id)));
}

export function registerCloseConfigurationEvent() {
    Utils.querySelectorAll(this.form, '.cf-config-close')
        .forEach(element => element.addEventListener('click', event => this.editForm()));
}

export function registerSaveConfigurationEvent() {
    Utils.querySelectorAll(this.form, '.cf-config-save')
        .forEach(element => element.addEventListener('click', event => this.saveConfiguration(event)));
}

export function registerAddNewOptionEvent() {
    Utils.querySelectorAll(this.form, '.cf-config-add-option')
        .forEach(element => element.addEventListener('click', event => this.addNewOption(event)));
}

export function registerAddNewConditionEvent() {
    Utils.querySelectorAll(this.form, '.cf-config-add-condition')
        .forEach(element => element.addEventListener('click', event => this.addNewCondition(event)));
}

export function registerDeleteConditionEvent() {
    Utils.querySelectorAll(this.form, '.cf-config-delete-condition')
        .forEach(element => element.addEventListener('click', event => this.deleteCondition(event)));
}

export function registerFormInputChangedEvent() {
    ['input', 'change'].forEach(event => Utils.querySelectorAll(this.form, '.cf-form')
        .forEach(form => form.addEventListener(event, event => this.evaluateConditions(event))))
}