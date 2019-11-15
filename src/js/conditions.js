import {
    uniqueId
} from './utils.js'

import jsonLogic from 'json-logic-js'

class If {
    constructor(value) {
        this.value = value;
    }

    get() {
        return {
            "==": [{
                "var": "value"
            }, this.value]
        }
    }
}

class Then {
    constructor(control = {}, isHidden) {
        this.controlId = control.id;
        this.isHidden = isHidden;
    }
}

class Condition {
    constructor(ifRule = new If(), thenRule = new Then()) {
        this.id = uniqueId();
        this.ifRule = ifRule;
        this.thenRule = thenRule;
    }

    evaluate(value) {
        return jsonLogic.apply(this.ifRule.get(), {
            value: value
        });
    }
}

export {
    If,
    Then,
    Condition
}