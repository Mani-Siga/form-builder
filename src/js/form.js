import * as Utils from './utils.js'

export default class Form {
    constructor() {
        this.id = Utils.uniqueId();
        this.sections = [];
    }

    addSection() {
        let section = new FormSection();
        this.sections.push(section);
        return section;
    }
}

class FormSection {
    constructor() {
        this.id = Utils.uniqueId();
        this.components = [];
    }

    addComponent(component) {
        this.components.push(component);
    }
}