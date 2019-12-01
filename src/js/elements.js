import * as Utils from './utils.js'
import * as ElementTemplates from './templates.js'

class Component {
    constructor(title = '', required = true, options, templateName, template) {
        this.title = title;
        this.required = required;
        this.options = [];
        this.templateName = templateName;
        this.template = template;

        this.id = Utils.uniqueId();
        this.name = Utils.uniqueId();
        this.conditions = [];
        this.currentValues = [];
    }

    addCondition(condition) {
        this.conditions.push(condition);
    }

    render() {
        return Utils.render(this.template, {
            vm: this
        });
    }
}

export class Header extends Component {
    constructor(title, required, templateName) {
        super(title, required, [], templateName, ElementTemplates.HeaderTemplate);
    }
}

export class Label extends Component {
    constructor(title, required, templateName) {
        super(title, required, [], templateName, ElementTemplates.LabelTemplate);
    }
}

export class Input extends Component {
    constructor(title, type, required, templateName) {
        super(title, required, [], templateName, ElementTemplates.InputTemplate);
        this.type = type;
    }
}

export class DropdownList extends Component {
    constructor(title, required, templateName) {
        super(title, required, [], templateName, ElementTemplates.DropdownListTemplate);
    }
}

export class CheckboxGroup extends Component {
    constructor(title, templateName) {
        super(title, false, [], templateName, ElementTemplates.CheckboxGroupTemplate);
    }
}

export class RadioGroup extends Component {
    constructor(title, required, templateName) {
        super(title, required, [], templateName, ElementTemplates.RadioGroupTemplate);
    }
}

export class TextArea extends Component {
    constructor(title, required, templateName) {
        super(title, required, [], templateName, ElementTemplates.TextareaTemplate);
    }
}