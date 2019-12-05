import * as Utils from './utils.js'
import Templates from './templates.js'

export class Component {
    constructor(title, type, required, options, name, templateId) {
        this.id = Utils.uniqueId();

        this.title = title;
        this.type = type;
        this.required = required;
        this.options = options;
        this.name = name;
        this.templateId = templateId;

        this.conditions = [];
        this.currentValues = [];
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            type: this.type,
            required: this.required,
            options: this.options,
            name: this.name,
            templateId: this.templateId,
            conditions: this.conditions,
            currentValues: this.currentValues
        }
    }

    render() {
        this.currentValues = [];
        this.hasOptions = Array.isArray(this.options);

        if (this.conditions.length > 0) {
            this.isHiddenByDefault = this.conditions[0].thenRule.isHidden;
        }

        let template = Object.values(Templates)
            .find(t => t.id === this.templateId);

        return Utils.render(template.data, {
            vm: this
        });
    }
}

export const ComponentTemplates = [{
        name: 'header',
        title: 'Header',
        copyTo(section) {
            let component = new Component(this.title, '', false, null, this.name, Templates.HeaderTemplate.id);
            section.components.push(component)
        }
    },
    {
        name: 'label',
        title: 'Label',
        copyTo(section) {
            let component = new Component(this.title, '', false, null, this.name, Templates.LabelTemplate.id);
            section.components.push(component);
        }
    },
    {
        name: 'input',
        title: 'Input',
        copyTo(section) {
            let component = new Component(this.title, 'text', false, null, this.name, Templates.InputTemplate.id);
            section.components.push(component);
        }
    },
    {
        name: 'email',
        title: 'Email',
        copyTo(section) {
            let component = new Component(this.title, 'email', false, null, this.name, Templates.InputTemplate.id);
            section.components.push(component);
        }
    },
    {
        name: 'date',
        title: 'Date',
        copyTo(section) {
            let component = new Component(this.title, 'date', false, null, this.name, Templates.InputTemplate.id);
            section.components.push(component);
        }
    },
    {
        name: 'time',
        title: 'Time',
        copyTo(section) {
            let component = new Component(this.title, 'time', false, null, this.name, Templates.InputTemplate.id);
            section.components.push(component);
        }
    },
    {
        name: 'number',
        title: 'Number',
        copyTo(section) {
            let component = new Component(this.title, 'number', false, null, this.name, Templates.InputTemplate.id);
            section.components.push(component);
        }
    },
    {
        name: 'file',
        title: 'File',
        copyTo(section) {
            let component = new Component(this.title, 'file', false, null, this.name, Templates.InputTemplate.id);
            section.components.push(component);
        }
    },
    {
        name: 'textarea',
        title: 'Text Area',
        copyTo(section) {
            let component = new Component(this.title, '', false, null, this.name, Templates.TextareaTemplate.id);
            section.components.push(component);
        }
    },
    {
        name: 'checkboxgroup',
        title: 'Checkbox Group',
        copyTo(section) {
            let options = [...Array(3)
                .keys()
            ].map((item) => {
                return {
                    key: `checkbox-${item}`,
                    value: `Checkbox ${item}`,
                    required: false
                }
            });

            let component = new Component(this.title, '', false, options, this.name, Templates.CheckboxGroupTemplate.id);
            section.components.push(component);
        }
    },
    {
        name: 'radiogroup',
        title: 'Radio Group',
        copyTo(section) {
            let options = [...Array(3)
                .keys()
            ].map((item) => {
                return {
                    key: `radio-${item}`,
                    value: `Radio ${item}`
                }
            });

            let component = new Component(this.title, '', false, options, this.name, Templates.RadioGroupTemplate.id);
            section.components.push(component);
        }
    },
    {
        name: 'dropdownlist',
        title: 'Dropdown List',
        copyTo(section) {
            let options = [...Array(3)
                .keys()
            ].map((item) => {
                return {
                    key: `option-${item}`,
                    value: `Option ${item}`
                }
            });

            let component = new Component(this.title, '', false, options, this.name, Templates.DropdownListTemplate.id);
            section.components.push(component);
        }
    }
];