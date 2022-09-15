"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeployed = void 0;
const connectWeb3_1 = require("./connectWeb3");
const DID_json_1 = __importDefault(require("../contract/DID.json"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getDeployed = async () => {
    const url = process.env.NETWORK_URL;
    const client = new connectWeb3_1.SingletoneWeb3(url);
    const networkId = await client.web3.eth.net.getId();
    const { address: ca } = DID_json_1.default.networks[networkId];
    const { abi } = DID_json_1.default;
    const deployed = new client.web3.eth.Contract(abi, ca);
    return deployed;
};
exports.getDeployed = getDeployed;
//# sourceMappingURL=connectDeployed.js.map