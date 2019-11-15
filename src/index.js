import './styles.css'

import {
    CustomForm
} from './form.js'

import {
    Header,
    DropdownList,
    TextArea,
    Label,
    Input,
    CheckboxGroup,
    RadioGroup
} from './elements.js';

import {
    Condition
} from './conditions.js';


import {
    uniqueId,
    getControl,
    getAllControls,
    evaluateConditions,
    createElement,
} from './utils.js';

export class FormBuilder {
    load(mainContainer) {
        let topRow = document.createElement('div');
        let bottomRow = document.createElement('div');
        let templatesContainer = document.createElement('div');
        let editor = document.createElement('div');

        topRow.appendChild(templatesContainer);
        topRow.appendChild(editor);
        mainContainer.appendChild(topRow);
        mainContainer.appendChild(bottomRow);

        mainContainer.classList.add('cf-builder-container', 'cf-box');
        templatesContainer.classList.add('cf-templates-container', 'cf-box');
        editor.classList.add('cf-editor', 'cf-box');
        topRow.classList.add('cf-top-row');
        bottomRow.classList.add('cf-bottom-row');

        //**********************************************************************
        let elementTemplates = [{
                name: 'header',
                title: 'Header',
                copyTo(section) {
                    let control = new Header('Header', uniqueId());
                    control.templateName = this.name;
                    section.addControl(control);
                }
            },
            {
                name: 'label',
                title: 'Label',
                copyTo(section) {
                    let control = new Label(this.title, uniqueId());
                    control.templateName = this.name;
                    section.addControl(control);
                }
            },
            {
                name: 'input',
                title: 'Input',
                copyTo(section) {
                    let control = new Input(this.title, 'text', uniqueId());
                    control.templateName = this.name;
                    section.addControl(control);
                }
            },
            {
                name: 'email',
                title: 'Email',
                copyTo(section) {
                    let control = new Input(this.title, 'email', uniqueId());
                    control.templateName = this.name;
                    section.addControl(control);
                }
            },
            {
                name: 'date',
                title: 'Date',
                copyTo(section) {
                    let control = new Input(this.title, 'date', uniqueId());
                    control.templateName = this.name;
                    section.addControl(control);
                }
            },
            {
                name: 'textarea',
                title: 'Text Area',
                copyTo(section) {
                    let control = new TextArea(this.title, uniqueId());
                    control.templateName = this.name;
                    section.addControl(control);
                }
            },
            {
                name: 'checkboxgroup',
                title: 'Checkbox Group',
                copyTo(section) {
                    let control = new CheckboxGroup(this.title, uniqueId());
                    control.templateName = this.name;
                    [...Array(4).keys()].forEach((item) => control.options.push({
                        key: `checkbox-${item}`,
                        value: `Checkbox ${item}`
                    }));
                    section.addControl(control);
                }
            },
            {
                name: 'radiogroup',
                title: 'Radio Group',
                copyTo(section) {
                    let control = new RadioGroup(this.title, uniqueId());
                    control.templateName = this.name;
                    [...Array(4).keys()].forEach((item) => control.options.push({
                        key: `radio-${item}`,
                        value: `Radio ${item}`
                    }));
                    section.addControl(control);

                }
            },
            {
                name: 'dropdownlist',
                title: 'Dropdown List',
                copyTo(section) {
                    let control = new DropdownList(this.title, uniqueId());
                    control.templateName = this.name;
                    [...Array(4).keys()].forEach((item) => control.options.push({
                        key: item === 0 ? '' : `option-${item}`,
                        value: item === 0 ? '' : `Option ${item}`
                    }));
                    section.addControl(control);
                }
            }
        ];

        elementTemplates.forEach(item => {
            let templateElement = document.createElement('button');
            templateElement.classList.add('cf-element-template');
            templateElement.setAttribute('data-cf-template-name', item.name);
            templateElement.innerHTML = item.title;
            templatesContainer.appendChild(templateElement);
        });
        //**********************************************************************
        function onLabelEdited(event) {
            let control = getAllControls(form).find(control => control.id === event.target.parentElement.id);

            if (control) {
                control.title = event.target.innerText;
                reload();
                refreshConditions();
            }
        }

        function onInputChanged(event) {
            let control = getControl(form, event.target.closest('.cf-control').id);

            if (control) {
                evaluateConditions(control, event.target.value);
            }
        }

        function onAddNewCondition(event) {
            let controlElement = event.target.querySelector('.cf-control');

            if (controlElement) {
                let control = getControl(form, controlElement.id);
                control.conditions.push(new Condition());
                refreshConditions();
            }
        }

        function refreshConditions() {
            bottomRow.innerHTML = '';

            getAllControls(form).forEach(control => {
                control.conditions.forEach(condition => {
                    let conditionRow = createElement('div', null, '');
                    conditionRow.classList.add('cf-condition-row', 'cf-box');
                    bottomRow.appendChild(conditionRow);

                    conditionRow.appendChild(createElement('div', null, 'If'));
                    conditionRow.appendChild(createElement('div', null, `${control.title}`));
                    conditionRow.appendChild(createElement('div', null, '='));

                    let ifValue = createElement('input', 'text', condition.ifRule.value);
                    conditionRow.appendChild(ifValue);
                    conditionRow.appendChild(createElement('div', null, 'Then'));

                    let visibilitySelect = document.createElement('select');
                    visibilitySelect.options.add(new Option('', ''));
                    visibilitySelect.options.add(new Option('Show', 'show'));
                    visibilitySelect.options.add(new Option('Hide', 'hide'));
                    visibilitySelect.value = condition.thenRule.isHidden ? 'hide' : 'show';
                    conditionRow.appendChild(visibilitySelect);

                    let hideControlList = document.createElement('select');

                    getAllControls(form).filter(c => c.id !== control.id).forEach(element => {
                        let control = getControl(form, element.id);
                        hideControlList.options.add(new Option(control.title, control.id));

                        document.getElementById(control.id).addEventListener('blur', event => {
                            Array.from(hideControlList.options).find(o => o.value === event.target.id).text = event.target.innerHTML;
                        });
                    });

                    hideControlList.value = condition.thenRule.controlId;
                    conditionRow.appendChild(hideControlList);

                    let saveCondition = createElement('input', 'button', 'Save');
                    saveCondition.setAttribute('disabled', 'true');
                    conditionRow.appendChild(saveCondition);

                    saveCondition.addEventListener('click', event => {
                        condition.ifRule.value = ifValue.value;
                        condition.thenRule.controlId = hideControlList.value;
                        condition.thenRule.isHidden = visibilitySelect.value === 'hide';
                        saveCondition.setAttribute('disabled', 'true');
                    });

                    let deleteCondition = createElement('input', 'button', 'Delete');
                    conditionRow.appendChild(deleteCondition);
                    deleteCondition.addEventListener('click', event => {
                        control.conditions = control.conditions.filter(c => c.id !== condition.id);
                        refreshConditions();
                    });

                    [visibilitySelect, hideControlList, ifValue].forEach(element => element.addEventListener('change', event => saveCondition.removeAttribute('disabled')));
                });
            });
        }

        function onElementDragStarted(event) {
            event.dataTransfer.setData("templateName", event.target.getAttribute('data-cf-template-name'));
        }

        function onElementDraggedOver(event) {
            event.preventDefault();
        }

        function onElementDropped(event) {
            let elementTemplateTag = event.dataTransfer.getData("templateName");
            let elementTemplate = elementTemplates.find(d => d.name === elementTemplateTag);
            let formSection = form.addSection();
            elementTemplate.copyTo(formSection);

            form.render(html => {
                editor.innerHTML = html;
                reload();
                refreshConditions();
            });
        }

        function setDragDrop() {
            document.querySelectorAll('.cf-element-template').forEach(element => {
                element.setAttribute('draggable', "true");

                element.removeEventListener('dragstart', onElementDragStarted);
                element.addEventListener('dragstart', onElementDragStarted);
            });

            document.querySelectorAll('.cf-editor').forEach(element => {
                element.removeEventListener('dragover', onElementDraggedOver);
                element.addEventListener('dragover', onElementDraggedOver);

                element.removeEventListener('drop', onElementDropped);
                element.addEventListener('drop', onElementDropped);
            });
        }

        function reload() {
            addExternalStyles();

            document.querySelectorAll('.cf-control>span').forEach(element => {
                element.removeEventListener('change', onInputChanged);
                element.addEventListener('change', onInputChanged);
                element.removeEventListener('input', onInputChanged);
                element.addEventListener('input', onInputChanged);
            });

            document.querySelectorAll('.cf-section').forEach(element => {
                element.removeEventListener('dblclick', onAddNewCondition);
                element.addEventListener('dblclick', onAddNewCondition);
            });

            document.querySelectorAll('[contenteditable=true]').forEach(element => {
                element.removeEventListener('input', onLabelEdited);
                element.addEventListener('input', onLabelEdited);
            });

            refreshConditions();
        }

        function addExternalStyles() {
            document.querySelectorAll('.cf-control').forEach(element => element.classList.add('form-group'));
            document.querySelectorAll('.cf-element-template').forEach(element => element.classList.add('btn', 'btn-primary'));
        }

        //**********************************************************************
        let form = new CustomForm();
        setDragDrop();
        reload();
        //**********************************************************************
    }
}