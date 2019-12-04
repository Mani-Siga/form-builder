import * as Utils from './utils.js'

export function registerConfigurationOpenedEvent() {
    Utils.querySelectorAll(this.form, '.cf-component')
        .forEach(element => element.addEventListener('dblclick', event =>
            this.editConfiguration(JSON.stringify(Utils.getComponent(this.form, event.target.closest('.cf-component')
                .id)))));
}

export function registerConfigurationClosedEvent() {
    Utils.querySelectorAll(this.form, '.cf-config-close')
        .forEach(element => element.addEventListener('click', event => this.buildForm()));
}

export function registerConfigurationSavedEvent() {
    Utils.querySelectorAll(this.form, '.cf-config-save')
        .forEach(element => element.addEventListener('click', event => this.saveConfiguration(event)));
}

export function registerOptionAddedEvent() {
    Utils.querySelectorAll(this.form, '.cf-config-add-option')
        .forEach(element => element.addEventListener('click', event => this.addNewOption(event)));
}

export function registerConditionAddedEvent() {
    Utils.querySelectorAll(this.form, '.cf-config-add-condition')
        .forEach(element => element.addEventListener('click', event => this.addNewCondition(event)));
}

export function registerConditionDeletedEvent() {
    Utils.querySelectorAll(this.form, '.cf-config-delete-condition')
        .forEach(element => element.addEventListener('click', event => this.deleteCondition(event)));
}

export function registerOptionDeletedEvent() {
    Utils.querySelectorAll(this.form, '.cf-config-delete-option')
        .forEach(element => element.addEventListener('click', event => this.deleteOption(event)));
}

export function registerFormInputChangedEvent() {
    ['input', 'change'].forEach(event => Utils.querySelectorAll(this.form, '.cf-form')
        .forEach(form => form.addEventListener(event, event => this.evaluateConditions(event))))
}

export function registerOpenFormPreviewEvent() {
    Utils.querySelectorAll(this.form, '.cf-open-preview')
        .forEach(element => element.addEventListener('click', event => this.preview()));
}

export function registerCloseFormPreviewEvent() {
    Utils.querySelectorAll(this.form, '.cf-close-preview')
        .forEach(element => element.addEventListener('click', event => this.closePreview()));
}