import {
    uniqueId
} from './utils.js'

export class CustomFormSection {
    constructor() {
        this.id = uniqueId();
        this.controls = [];
    }

    addControl(control) {
        this.controls.push(control);
    }

    render() {
        let renderedControls = this.controls.map(control => control.render()).join('');
        return `<div id='${this.id}' class='cf-section cf-box'>${renderedControls}</div>`;
    }
}

export class CustomForm {
    constructor() {
        this.id = uniqueId();
        this.sections = [];
    }

    addSection() {
        let section = new CustomFormSection();
        this.sections.push(section);
        return section;
    }

    render(callback) {
        let renderedSections = this.sections.map(section => section.render()).join('');
        callback(`<form id='${this.id}' class='cf'>${renderedSections}</form>`);
    }
}