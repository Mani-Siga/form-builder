import * as Utils from './utils.js'

export class Form {
    constructor() {
        this.id = Utils.uniqueId();
        this.sections = [];
    }
}

export class FormSection {
    constructor() {
        this.id = Utils.uniqueId();
        this.components = [];
    }
}