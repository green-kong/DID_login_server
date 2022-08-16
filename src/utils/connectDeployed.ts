import { SingletoneWeb3 } from './connectWeb3';
import DIDContract from '../contract/DID.json';
import dotenv from 'dotenv';

dotenv.config();

export const getDeployed = async () => {
  const url = process.env.NETWORK_URL;
  const client = new SingletoneWeb3(url);
  const networkId = await client.web3.eth.net.getId();
  const { address: ca } = DIDContract.networks[networkId];
  const { abi } = DIDContract;
  const deployed = new client.web3.eth.Contract(abi, ca);

  return deployed;
};
