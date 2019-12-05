export default {
    MainTemplate: {
        id: 1,
        data: `
        <div id="{{vm.form.id}}" class="cf-form-builder">
            <div class="cf-editor cf-border">
                <div>
                    <button class="cf-open-preview cf-button">Preview Form</button>
                    <button class="cf-close-preview cf-hidden cf-button">Close Preview</button>
                    <button class="cf-log-form-data cf-button">Log Form Data to Console</button>
                    <hr/>
                </div>
                <form class="cf-form">
                </form>
                <div class="cf-config cf-border cf-hidden"></div>
            </div>
            <div class="cf-component-templates cf-border">
                {{#vm.componentTemplates}}
                <button class="cf-component-template cf-button" data-cf-component-template-name="{{name}}">{{title}}</button>
                {{/vm.componentTemplates}}
            </div>
        </div>
    `
    },
    FormTemplate: {
        id: 2,
        data: `
        {{#vm.sections}}
        <div id="{{id}}" class="cf-section">
            {{#components}}
            <div id="{{id}}" class="cf-component cf-border" data-cf-component-template-name="{{templateName}}">
                {{{render}}}
            </div>
            {{/components}}
        </div>
        {{/vm.sections}}
    `
    },
    IfValueDataListTemplate: {
        id: 3,
        data: `
        <datalist id="cf-component-condition-if-value-list">
            {{#vm.options}}
            <option value="{{value}}">
            {{/vm.options}}
        </datalist>
    `
    },
    ConditionTemplate: {
        id: 4,
        data: `
        <form class="cf-config-form" data-component-id="{{vm.component.id}}">
            <div class="cf-config-controls">
                <input type="submit" class="cf-config-save cf-button" value="Save">
                <input type="button" class="cf-config-close cf-button" value="Close">
                {{#vm.component.hasOptions}}
                <button class="cf-config-add-option cf-button">Add Option</button>
                {{/vm.component.hasOptions}}
                {{#vm.otherComponents.length}}
                <button class="cf-config-add-condition cf-button">Add Condition</button>
                {{/vm.otherComponents.length}}
            </div>
            <hr/>
            <table class="table table-striped table-hovered">
                <tbody> 
                    <tr>
                        <td><strong>Name</strong></td>
                        <td colspan="4">
                            <input name="componentTitle" value="{{vm.component.title}}" class="cf-component-title" required>
                        </td>
                    </tr>
                    <tr>
                        <td><strong>Is Required?</strong></td>
                        <td colspan="4">
                            <input name="componentRequired" type="checkbox" class="cf-component-required" value="{{vm.component.required}}" {{#vm.component.required}}checked{{/vm.component.required}}>
                        </td>
                    </tr>
                    {{#vm.component.options.length}}
                    <tr>
                        <td colspan="3"><strong>Options</strong></td>
                    </tr>
                    {{#vm.component.options}}
                    <tr class="cf-component-option">
                        <td>
                            <input class="cf-component-option-key" value="{{key}}" required>
                        </td>
                        <td>
                            <input class="cf-component-option-value" value="{{value}}" required>
                        </td>
                        <td>
                            <button class="cf-config-delete-option cf-button" data-component-option-key="{{key}}">Delete</button>
                        </td>
                    </tr>
                    {{/vm.component.options}}
                    {{/vm.component.options.length}}
                    {{#vm.otherComponents.length}}
                    {{#vm.component.conditions.length}}
                    <tr>
                        <td>
                            <strong>Conditions</strong>
                        </td>
                        <td colspan="4">
                            I should only be&nbsp<select name="componentVisibility" class="cf-source-visibility">
                                <option value="show" {{^vm.component.isHiddenByDefault}} selected {{/vm.component.isHiddenByDefault}}>visible</option>
                                <option value="hide" {{#vm.component.isHiddenByDefault}} selected {{/vm.component.isHiddenByDefault}}>hidden</option>
                            </select>&nbspwhen all of the following conditions are met.
                        </td>
                    </td>
                    </tr>
                    {{#vm.component.conditions}}
                    <tr class="cf-component-condition" data-component-condition-id="{{id}}">
                        <td>Value of</td>
                        <td>
                            <select class="cf-component-condition-othercomponent-selector" value="{{ifRule.otherComponentId}}">
                                <option value=""></option>
                                {{#vm.otherComponents}}
                                <option value="{{id}}">{{title}}</option>
                                {{/vm.otherComponents}}
                            </select>
                        </td>
                        <td>is</td>
                        <td>
                            <input type="text" class="cf-component-condition-othercomponent-if-value" value="{{ifRule.otherComponentValue}}" list="cf-component-condition-if-value-list">
                            <div class="cf-component-condition-if-value-list"></div>
                        </td>
                        <td>
                            <button class="cf-config-delete-condition cf-button" data-component-condition-id="{{id}}">Delete</button>
                        </td>
                    </tr>
                    {{/vm.component.conditions}}
                    {{/vm.component.conditions.length}}
                    {{/vm.otherComponents.length}}
                </tbody>
            </table>
        </form>
    `
    },
    HeaderTemplate: {
        id: 5,
        data: `
        <label><h1 {{#vm.required}}class="cf-required"{{/vm.required}}>{{vm.title}}</h1></label>
    `
    },
    LabelTemplate: {
        id: 6,
        data: `
        <label {{#vm.required}}class="cf-required"{{/vm.required}}>{{vm.title}}</label>
    `
    },
    InputTemplate: {
        id: 7,
        data: `
        <label {{#vm.required}}class="cf-required"{{/vm.required}}>{{vm.title}}</label>
        <span>
            <input class="component-element" type='{{vm.type}}' name='{{vm.name}}'>
        </span>
    `
    },
    TextareaTemplate: {
        id: 8,
        data: `
        <label {{#vm.required}}class="cf-required"{{/vm.required}}>{{vm.title}}</label>
        <span>
            <textarea class="component-element" name='{{vm.name}}'></textarea>
        </span>
    `
    },
    CheckboxGroupTemplate: {
        id: 9,
        data: `
        <label {{#vm.required}}class="cf-required"{{/vm.required}}>{{vm.title}}</label>
        <span class="component-element">
            {{#vm.options}}
            <input name='{{vm.name}}' type='checkbox' value='{{key}}' data-value="{{value}}">
            <span>{{value}}</span>
            {{/vm.options}}
        </span>
    `
    },

    RadioGroupTemplate: {
        id: 10,
        data: `
        <label {{#vm.required}}class="cf-required"{{/vm.required}}>{{vm.title}}</label>
        <span class="component-element">
            {{#vm.options}}
            <input type='radio' name='{{vm.name}}' value='{{key}}' data-value="{{value}}">
            <span>{{value}}</span>
            {{/vm.options}}
        </span>
    `
    },
    DropdownListTemplate: {
        id: 11,
        data: `
        <label {{#vm.required}}class="cf-required"{{/vm.required}}>{{vm.title}}</label>
        <span>
            <select class="component-element" name='{{vm.name}}'>
                <option></option>
                {{#vm.options}}
                <option value='{{key}}'>{{value}}</option>
                {{/vm.options}}
            </select>
        </span>
    `
    }
};