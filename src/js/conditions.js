import * as Utils from './utils.js'
import jsonLogic from 'json-logic-js'

class If {
    constructor(value) {
        this.value = value;
    }
}

class Then {
    constructor(component = {}, isHidden) {
        this.componentId = component.id;
        this.isHidden = isHidden;
    }
}

export default class Condition {
    constructor(ifRule = new If(), thenRule = new Then()) {
        this.id = Utils.uniqueId();
        this.ifRule = ifRule;
        this.thenRule = thenRule;
    }

    evaluate(currentValues) {
        return jsonLogic.apply({
            "in": [{
                "var": "value"
            }, currentValues]
        }, {
            value: this.ifRule.value
        });
    }
}