import * as Utils from './utils.js'

class If {
    constructor(value, otherComponentId) {
        this.value = value;
        this.otherComponentId = otherComponentId;
    }
}

class Then {
    constructor(isHidden = false) {
        this.isHidden = isHidden;
    }
}

export default class Condition {
    constructor(ifRule = new If(), thenRule = new Then()) {
        this.id = Utils.uniqueId();
        this.ifRule = ifRule;
        this.thenRule = thenRule;
    }
}