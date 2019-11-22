import * as Utils from './utils.js'

export class CustomForm {
    constructor() {
        this.id = Utils.uniqueId();
        this.sections = [];
    }

    addSection() {
        let section = new CustomFormSection();
        this.sections.push(section);
        return section;
    }

    render(callback) {
        let renderedSections = this.sections.map(section => section.render()).join('');
        callback(`<form id='${this.id}' class='cf-form'>${renderedSections}</form>`);
    }
}

export class CustomFormSection {
    constructor() {
        this.id = Utils.uniqueId();
        this.components = [];
    }

    addComponent(component) {
        this.components.push(component);
    }

    render() {
        let renderedComponents = this.components.map(component => component.render()).join('');
        return `<div id='${this.id}' class='cf-section cf-border'>${renderedComponents}</div>`;
    }
}

class Component {
    constructor(title, name, templateName, isRequired) {
        this.id = Utils.uniqueId();
        this.title = title || '';
        this.name = name || Utils.uniqueId();
        this.isRequired = isRequired || false;
        this.templateName = templateName;
        this.conditions = [];
        this.currentValues = [];
    }
}

export class Header extends Component {
    constructor(title, name, templateName) {
        super(title, name, templateName);
    }

    render() {
        return `<div id='${this.id}' class='cf-component' data-cf-template-name='${this.templateName}'>
                    <h1 name='${this.name}' contenteditable=true>${this.title}</h1>
                </div>`;
    }
}

export class Label extends Component {
    constructor(title, name, templateName) {
        super(title, name, templateName);
    }

    render() {
        return `<div id='${this.id}' class='cf-component' data-cf-template-name='${this.templateName}'>
                    <label name='${this.name}' contenteditable=true>${this.title}</label>
                </div>`;
    }
}

export class Input extends Component {
    constructor(title, name, templateName, type, required) {
        super(title, name, templateName, required);
        this.type = type;
    }

    render() {
        return `<div id='${this.id}' class='cf-component' data-cf-template-name='${this.templateName}'>
                    <label contenteditable=true>${this.title}</label>
                    <span>
                        <input type='${this.type}' name='${this.name}' ${this.isRequired ? 'required' : ''}>
                    </span>
                </div>`;
    }
}

export class DropdownList extends Component {
    constructor(title, name, templateName, required) {
        super(title, name, templateName, required);
        this.options = [];
    }

    render() {
        let options = this.options.map(option => `<option value='${option.key}'>${option.value}</option>`).join('');
        return `<div id='${this.id}' class='cf-component' data-cf-template-name='${this.templateName}'>
                    <label contenteditable=true>${this.title}</label>
                    <span>
                        <select name='${this.name}' ${this.isRequired ? 'required' : ''}>${options}</select>
                    </span>
                </div>`;
    }
}

export class CheckboxGroup extends Component {
    constructor(title, name, templateName) {
        super(title, name, templateName);
        this.options = [];
    }

    render() {
        let options = this.options.map(option => `<input type='checkbox' name='${this.name}' value='${option.key}'><span contenteditable=true>${option.value}</span>`).join('');
        return `<div id='${this.id}' class='cf-component' data-cf-template-name='${this.templateName}'>
                    <label contenteditable=true>${this.title}</label>
                    <span>${options}</span>
                </div>`;
    }
}

export class RadioGroup extends Component {
    constructor(title, name, templateName) {
        super(title, name, templateName);
        this.options = [];
    }

    render() {
        let options = this.options.map(option => `<input type='radio' name='${this.name}' value='${option.key}'><span contenteditable=true>${option.value}</span>`).join('');
        return `<div id='${this.id}' class='cf-component' data-cf-template-name='${this.templateName}'>
                    <label contenteditable=true>${this.title}</label>
                    <span>${options}</span>
                </div>`;
    }
}

export class TextArea extends Component {
    constructor(title, name, templateName) {
        super(title, name, templateName);
    }

    render() {
        return `<div id='${this.id}' class='cf-component' data-cf-template-name='${this.templateName}'>
                    <label contenteditable=true>${this.title}</label>
                    <span>
                        <textarea name='${this.name}'></textarea>
                    </span>
                </div>`;
    }
}