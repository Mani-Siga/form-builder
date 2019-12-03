export const MainTemplate = `
    <div id="{{vm.form.id}}" class="cf-form-builder cf-border">
        <div class="cf-editor">
            <form class="cf-form cf-border">
            </form>
            <div class="cf-config cf-border cf-hidden"></div>
        </div>
        <div class="cf-templates cf-border">
            {{#vm.componentTemplates}}
            <button class="cf-element-template btn btn-primary" data-cf-template-name="{{name}}">{{title}}</button>
            {{/vm.componentTemplates}}
        </div>
    </div>
`;

export const FormTemplate = `
    {{#vm.sections.length}}
    <div>
        <button class="cf-preview btn btn-primary">Preview Form</button>
        <button class="cf-close-preview cf-hidden btn btn-primary">Close Preview</button>
    </div>
    {{/vm.sections.length}}
    {{#vm.sections}}
    <div id='{{id}}' class='cf-section'>
        {{#components}}
            <div id='{{id}}' class='cf-component cf-border' data-cf-template-name='{{templateName}}'>
                {{{render}}}
            </div>
        {{/components}}
    </div>
    {{/vm.sections}}
`;

export const ConditionTemplate = `
    <form class="cf-config-form">
        <div class="cf-config-controls">
            <div>
                <input type="submit" class="cf-config-save btn" data-component-id="{{vm.component.id}}" value="Save">
                <input type="button" class="cf-config-close btn" data-component-id="{{vm.component.id}}" value="Close">
                {{#vm.component.hasOptions}}
                <button class="cf-config-add-option btn" data-component-id="{{vm.component.id}}">Add Option</button>
                {{/vm.component.hasOptions}}
                {{#vm.otherComponents.length}}
                <button class="cf-config-add-condition btn" data-component-id="{{vm.component.id}}">Add Condition</button>
                {{/vm.otherComponents.length}}
            </div>
        </div>
        <hr/>
        <table class="table table table-hover">
            <tbody> 
                <tr>
                    <td><strong>Name</strong></td>
                    <td>
                        <input value="{{vm.component.title}}" class="cf-title" required>
                    </td>
                </tr>
                <tr>
                    <td><strong>Is Required?</strong></td>
                    <td>
                        <input type="checkbox" class="cf-required-value" value="{{vm.component.required}}" {{#vm.component.required}}checked{{/vm.component.required}}>
                    </td>
                </tr>
                {{#vm.component.options.length}}
                <tr>
                    <td colspan="3"><strong>Options</strong></td>
                </tr>
                {{#vm.component.options}}
                <tr class="cf-option">
                    <td>
                        <input class="cf-option-key" value="{{key}}" required>
                    </td>
                    <td>
                        <input class="cf-option-value" value="{{value}}" required>
                    </td>
                    <td>
                        <button class="cf-config-delete-option btn" data-component-id="{{vm.component.id}}" data-option-key="{{key}}">Delete</button>
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
                        <select class="cf-source-visibility">
                            <option value="show" {{^vm.component.isHiddenByDefault}} selected {{/vm.component.isHiddenByDefault}}>Show</option>
                            <option value="hide" {{#vm.component.isHiddenByDefault}} selected {{/vm.component.isHiddenByDefault}}>Hide</option>
                        </select>
                    </td>
                </td>
                </tr>
                {{#vm.component.conditions}}
                <tr class="cf-condition" data-condition-id="{{id}}">
                    <td></td>
                    <td>
                        <select class="cf-othercomponent-id" value="{{ifRule.otherComponentId}}">
                            <option value=""></option>
                            {{#vm.otherComponents}}
                            <option value="{{id}}">{{title}}</option>
                            {{/vm.otherComponents}}
                        </select>
                    </td>
                    <td>is</td>
                    <td>
                        <input type="text" class="cf-if-value" value="{{ifRule.value}}">
                    </td>
                    <td>
                        <button class="cf-config-delete-condition btn" data-component-id="{{vm.component.id}}" data-condition-id="{{id}}">Delete</button>
                    </td>
                </tr>
                {{/vm.component.conditions}}
                {{/vm.component.conditions.length}}
                {{/vm.otherComponents.length}}
            </tbody>
        </table>
    </form>
`;

export const HeaderTemplate = `
    <label><h1 {{#vm.required}}class="cf-required"{{/vm.required}}>{{vm.title}}</h1></label>
`;

export const LabelTemplate = `
    <label {{#vm.required}}class="cf-required"{{/vm.required}}>{{vm.title}}</label>
`;

export const InputTemplate = `
    <label {{#vm.required}}class="cf-required"{{/vm.required}}>{{vm.title}}</label>
    <span>
        <input type='{{vm.type}}' name='{{vm.name}}' {{#vm.required}} required="required" {{/vm.required}}>
    </span>
`;

export const TextareaTemplate = `
    <label {{#vm.required}}class="cf-required"{{/vm.required}}>{{vm.title}}</label>
    <span>
        <textarea name='{{vm.name}}' {{#vm.required}} required="required" {{/vm.required}}></textarea>
    </span>
`;

export const CheckboxGroupTemplate = `
    <label {{#vm.required}}class="cf-required"{{/vm.required}}>{{vm.title}}</label>
    <span>
        {{#vm.options}}
        <input name='{{vm.name}}' type='checkbox' value='{{key}}' data-value="{{value}}" {{#required}} required="required" {{/required}}>
        <span>{{value}}</span>
        {{/vm.options}}
    </span>
`;

export const RadioGroupTemplate = `
    <label {{#vm.required}}class="cf-required"{{/vm.required}}>{{vm.title}}</label>
    <span>
        {{#vm.options}}
        <input type='radio' name='{{vm.name}}' value='{{key}}' data-value="{{value}}" {{#vm.required}} required="required" {{/vm.required}}>
        <span>{{value}}</span>
        {{/vm.options}}
    </span>
`;

export const DropdownListTemplate = `
    <label {{#vm.required}}class="cf-required"{{/vm.required}}>{{vm.title}}</label>
    <span>
    <select name='{{vm.name}}' {{#vm.required}} required="required" {{/vm.required}}>
        <option></option>
        {{#vm.options}}
        <option value='{{key}}'>{{value}}</option>
        {{/vm.options}}
    </select>
    </span>
`;