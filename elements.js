import {
    uniqueId
} from './utils.js'

class Control {
    constructor(title, name, isRequired, templateName) {
        this.id = uniqueId();
        this.title = title || '';
        this.name = name || uniqueId();
        this.isRequired = isRequired || false;
        this.templateName = templateName;
        this.conditions = [];
    }
}

export class Header extends Control {
    constructor(title, name) {
        super(title, name);
    }

    render() {
        return `<div id='${this.id}' class='cf-control' data-cf-template-name='${this.templateName}'>
                    <h1 name='${this.name}' contenteditable=true>${this.title}</h1>
                </div>`;
    }
}

export class Label extends Control {
    constructor(title, name) {
        super(title, name);
    }

    render() {
        return `<div id='${this.id}' class='cf-control' data-cf-template-name='${this.templateName}'>
                    <label name='${this.name}' contenteditable=true>${this.title}</label>
                </div>`;
    }
}

export class Input extends Control {
    constructor(title, type, name, required) {
        super(title, name, required);
        this.type = type;
    }

    render() {
        return `<div id='${this.id}' class='cf-control' data-cf-template-name='${this.templateName}'>
                    <label contenteditable=true>${this.title}</label>
                    <span>
                        <input type='${this.type}' name='${this.name}' ${this.isRequired ? 'required' : ''}>
                    </span>
                </div>`;
    }
}

export class DropdownList extends Control {
    constructor(title, name, required) {
        super(title, name, required);
        this.options = [];
    }

    render() {
        let options = this.options.map(option => `<option value='${option.key}'>${option.value}</option>`).join('');
        return `<div id='${this.id}' class='cf-control' data-cf-template-name='${this.templateName}'>
                    <label contenteditable=true>${this.title}</label>
                    <span>
                        <select name='${this.name}' ${this.isRequired ? 'required' : ''}>${options}</select>
                    </span>
                </div>`;
    }
}

export class CheckboxGroup extends Control {
    constructor(title, name) {
        super(title, name);
        this.options = [];
    }

    render() {
        let options = this.options.map(option => `<input type='checkbox' name='${this.name}' value='${option.key}'>${option.value}`).join('');
        return `<div id='${this.id}' class='cf-control' data-cf-template-name='${this.templateName}'>
                    <label contenteditable=true>${this.title}</label>
                    <span>${options}</span>
                </div>`;
    }
}

export class RadioGroup extends Control {
    constructor(title, name) {
        super(title, name);
        this.options = [];
    }

    render() {
        let options = this.options.map(option => `<input type='radio' name='${this.name}' value='${option.key}'>${option.value}`).join('');
        return `<div id='${this.id}' class='cf-control' data-cf-template-name='${this.templateName}'>
                    <label contenteditable=true>${this.title}</label>
                    <span>${options}</span>
                </div>`;
    }
}

export class TextArea extends Control {
    constructor(title, name) {
        super(title, name);
    }

    render() {
        return `<div id='${this.id}' class='cf-control' data-cf-template-name='${this.templateName}'>
                    <label contenteditable=true>${this.title}</label>
                    <span>
                        <textarea name='${this.name}'></textarea>
                    </span>
                </div>`;
    }
}