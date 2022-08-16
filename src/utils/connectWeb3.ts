// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3 = require('web3');

let instance: SingletoneWeb3;

export class SingletoneWeb3 {
  web3: any;
  constructor(url: string) {
    if (instance) return instance;
    this.web3 = new Web3(new Web3.providers.HttpProvider(url));
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    instance = this;
  }
}
