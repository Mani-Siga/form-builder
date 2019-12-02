import * as Utils from './utils.js'
import * as Templates from './templates.js'

class Component {
    constructor(title, type, required, options, templateName, template) {
        this.title = title;
        this.type = type;
        this.required = required;
        this.options = options;
        this.templateName = templateName;
        this.template = template;

        this.id = Utils.uniqueId();
        this.name = Utils.uniqueId();
        this.conditions = [];
        this.currentValues = [];
    }

    render() {
        this.currentValues = [];
        this.hasOptions = Array.isArray(this.options);

        return Utils.render(this.template, {
            vm: this
        });
    }
}

export default [{
        name: 'header',
        title: 'Header',
        copyTo(section) {
            let component = new Component(this.title, '', false, null, this.name, Templates.HeaderTemplate);
            section.addComponent(component)
        }
    },
    {
        name: 'label',
        title: 'Label',
        copyTo(section) {
            let component = new Component(this.title, '', false, null, this.name, Templates.LabelTemplate);
            section.addComponent(component);
        }
    },
    {
        name: 'input',
        title: 'Input',
        copyTo(section) {
            let component = new Component(this.title, 'text', false, null, this.name, Templates.InputTemplate);
            section.addComponent(component);
        }
    },
    {
        name: 'email',
        title: 'Email',
        copyTo(section) {
            let component = new Component(this.title, 'email', false, null, this.name, Templates.InputTemplate);
            section.addComponent(component);
        }
    },
    {
        name: 'date',
        title: 'Date',
        copyTo(section) {
            let component = new Component(this.title, 'date', false, null, this.name, Templates.InputTemplate);
            section.addComponent(component);
        }
    },
    {
        name: 'time',
        title: 'Time',
        copyTo(section) {
            let component = new Component(this.title, 'time', false, null, this.name, Templates.InputTemplate);
            section.addComponent(component);
        }
    },
    {
        name: 'number',
        title: 'Number',
        copyTo(section) {
            let component = new Component(this.title, 'number', false, null, this.name, Templates.InputTemplate);
            section.addComponent(component);
        }
    },
    {
        name: 'file',
        title: 'File',
        copyTo(section) {
            let component = new Component(this.title, 'file', false, null, this.name, Templates.InputTemplate);
            section.addComponent(component);
        }
    },
    {
        name: 'textarea',
        title: 'Text Area',
        copyTo(section) {
            let component = new Component(this.title, '', false, null, this.name, Templates.TextareaTemplate);
            section.addComponent(component);
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

            let component = new Component(this.title, '', false, options, this.name, Templates.CheckboxGroupTemplate);
            section.addComponent(component);
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

            let component = new Component(this.title, '', false, options, this.name, Templates.RadioGroupTemplate);
            section.addComponent(component);
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

            let component = new Component(this.title, '', false, options, this.name, Templates.DropdownListTemplate);
            section.addComponent(component);
        }
    }
];