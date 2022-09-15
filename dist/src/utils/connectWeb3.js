"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingletoneWeb3 = void 0;
const Web3 = require('web3');
let instance;
class SingletoneWeb3 {
    constructor(url) {
        if (instance)
            return instance;
        this.web3 = new Web3(new Web3.providers.HttpProvider(url));
        instance = this;
    }
}
exports.SingletoneWeb3 = SingletoneWeb3;
//# sourceMappingURL=connectWeb3.js.map