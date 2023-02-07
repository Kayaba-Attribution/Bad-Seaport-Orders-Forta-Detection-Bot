import 'dotenv/config';
import ABI from '../abi/transferEvent.json';
import { Network, Alchemy } from 'alchemy-sdk';

// Required settings
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS
    ? process.env.CONTRACT_ADDRESS.toLowerCase()
    : '';
const CONTRACT_ADDRESSES = process.env.CONTRACT_ADDRESSES
    ? process.env.CONTRACT_ADDRESSES.toLowerCase()
    : '';
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY || '';
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || '';

// Optional settings
const OPENSEA_API_KEY = process.env.OPENSEA_API_KEY || '';
const DEFAULT_NFT_API = OPENSEA_API_KEY ? 'Opensea' : 'Alchemy';


// Alchemy sdk setup
const settings = {
    apiKey: ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET
};
const alchemy = new Alchemy(settings);


export {
    ABI,
    alchemy,
    DEFAULT_NFT_API,
    OPENSEA_API_KEY,
    ALCHEMY_API_KEY,
    ETHERSCAN_API_KEY,
    CONTRACT_ADDRESS,
    CONTRACT_ADDRESSES
};
