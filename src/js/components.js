import * as Utils from './utils.js';
import * as Elements from './elements.js';

export default [{
        name: 'header',
        title: 'Header',
        copyTo(section) {
            let component = new Elements.Header(this.title, Utils.uniqueId(), this.name);
            section.addComponent(component)
        }
    },
    {
        name: 'label',
        title: 'Label',
        copyTo(section) {
            let component = new Elements.Label(this.title, Utils.uniqueId(), this.name);
            section.addComponent(component);
        }
    },
    {
        name: 'input',
        title: 'Input',
        copyTo(section) {
            let component = new Elements.Input(this.title, Utils.uniqueId(), this.name, 'text');
            section.addComponent(component);
        }
    },
    {
        name: 'email',
        title: 'Email',
        copyTo(section) {
            let component = new Elements.Input(this.title, Utils.uniqueId(), this.name, 'email');
            section.addComponent(component);
        }
    },
    {
        name: 'date',
        title: 'Date',
        copyTo(section) {
            let component = new Elements.Input(this.title, Utils.uniqueId(), this.name, 'date');
            section.addComponent(component);
        }
    },
    {
        name: 'textarea',
        title: 'Text Area',
        copyTo(section) {
            let component = new Elements.TextArea(this.title, Utils.uniqueId(), this.name);
            section.addComponent(component);
        }
    },
    {
        name: 'checkboxgroup',
        title: 'Checkbox Group',
        copyTo(section) {
            let component = new Elements.CheckboxGroup(this.title, Utils.uniqueId(), this.name);
            [...Array(4).keys()].forEach((item) => component.options.push({
                key: `checkbox-${item}`,
                value: `Checkbox ${item}`
            }));
            section.addComponent(component);
        }
    },
    {
        name: 'radiogroup',
        title: 'Radio Group',
        copyTo(section) {
            let component = new Elements.RadioGroup(this.title, Utils.uniqueId(), this.name);
            [...Array(4).keys()].forEach((item) => component.options.push({
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
            let component = new Elements.DropdownList(this.title, Utils.uniqueId(), this.name);
            [...Array(4).keys()].forEach((item) => component.options.push({
                key: item === 0 ? '' : `option-${item}`,
                value: item === 0 ? '' : `Option ${item}`
            }));
            section.addComponent(component);
        }
    }
];