import * as Elements from './elements.js';
import * as Templates from './templates.js'

export default [{
        name: 'header',
        title: 'Header',
        copyTo(section) {
            let component = new Elements.Header(this.title, false, this.name, Templates.headerTemplate);
            section.addComponent(component)
        }
    },
    {
        name: 'label',
        title: 'Label',
        copyTo(section) {
            let component = new Elements.Label(this.title, true, this.name, Templates.labelTemplate);
            section.addComponent(component);
        }
    },
    {
        name: 'input',
        title: 'Input',
        copyTo(section) {
            let component = new Elements.Input(this.title, 'text', true, this.name, Templates.inputTemplate);
            section.addComponent(component);
        }
    },
    {
        name: 'email',
        title: 'Email',
        copyTo(section) {
            let component = new Elements.Input(this.title, 'email', false, this.name, Templates.inputTemplate);
            section.addComponent(component);
        }
    },
    {
        name: 'date',
        title: 'Date',
        copyTo(section) {
            let component = new Elements.Input(this.title, 'date', true, this.name, Templates.inputTemplate);
            section.addComponent(component);
        }
    },
    {
        name: 'textarea',
        title: 'Text Area',
        copyTo(section) {
            let component = new Elements.TextArea(this.title, true, this.name, Templates.textareaTemplate);
            section.addComponent(component);
        }
    },
    {
        name: 'checkboxgroup',
        title: 'Checkbox Group',
        copyTo(section) {
            let component = new Elements.CheckboxGroup(this.title, this.name, Templates.checkboxgroupTemplate);
            [...Array(4)
                .keys()
            ].forEach((item) => component.options.push({
                key: `checkbox-${item}`,
                value: `Checkbox ${item}`,
                required: false
            }));
            section.addComponent(component);
        }
    },
    {
        name: 'radiogroup',
        title: 'Radio Group',
        copyTo(section) {
            let component = new Elements.RadioGroup(this.title, true, this.name, Templates.radiogroupTemplate);
            [...Array(4)
                .keys()
            ].forEach((item) => component.options.push({
                key: `radio-${item}`,
                value: `Radio ${item}`
            }));
            section.addComponent(component);
        }
    },
    {
        name: 'dropdownlist',
        title: 'Dropdown List',
        copyTo(section) {
            let component = new Elements.DropdownList(this.title, true, this.name, Templates.dropdownlistTemplate);
            [...Array(4)
                .keys()
            ].forEach((item) => component.options.push({
                key: `option-${item}`,
                value: `Option ${item}`
            }));
            section.addComponent(component);
        }
    }
];