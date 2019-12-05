import {
    Component
} from './components.js';

import * as Utils from './utils.js'

export class Form {
    constructor() {
        this.id = Utils.uniqueId();
        this.sections = [];
    }

    static parse(formData) {
        let form = new Form();
        form.id = formData.id;
        formData.sections.forEach(sectionData => form.sections.push(FormSection.parse(sectionData)));
        return form;
    }
}

export class FormSection {
    constructor() {
        this.id = Utils.uniqueId();
        this.components = [];
    }

    static parse(sectionData) {
        let section = new FormSection();
        section.id = sectionData.id;
        sectionData.components.forEach(componentData => section.components.push(Component.parse(componentData)));
        return section;
    }
}