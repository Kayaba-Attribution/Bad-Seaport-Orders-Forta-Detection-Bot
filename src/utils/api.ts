import 'dotenv/config';
import _ from 'lodash';
import axios from 'axios';
import Jimp from 'jimp-compact';
import { ethers } from 'ethers';
import type { BigNumberish } from 'ethers';
import retry from 'async-retry';
import { Network, Alchemy } from 'alchemy-sdk';
import type { NftTokenType, GetFloorPriceResponse } from 'alchemy-sdk';
import type { ContractData, CustomError, TokenData, BatchContractInfo } from '../types';
import fs from 'fs';

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY || '';
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || '';
const OPENSEA_API_KEY = process.env.OPENSEA_API_KEY || '';
const DEFAULT_NFT_API = OPENSEA_API_KEY ? 'Opensea' : 'Alchemy';

// Alchemy sdk setup
const settings = {
    apiKey: ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET
};
const alchemy = new Alchemy(settings);
const provider = new ethers.providers.AlchemyProvider('homestead', ALCHEMY_API_KEY);

const openseaNftApi = async (tokenId: BigNumberish, contractAddress: string) => {
    const baseURL = `https://api.opensea.io/api/v1/asset/${contractAddress}/${tokenId}`;

    try {
        const response = await axios.get(baseURL, {
            headers: {
                'X-API-KEY': OPENSEA_API_KEY
            }
        });

        return response;
    } catch (error) {
        if (error instanceof Error) {
            const customError: CustomError = error;

            if (customError.response) {
                console.log(customError.response.data);
                console.log(customError.response.status);
            } else {
                console.error(error.message);
            }
        }

        return null;
    }
};

const getArrayBuffer = async (url: string) => {
    const result = await retry(async () => {
        const response = await axios.get(url, {
            responseType: 'arraybuffer'
        });

        return response.data;
    });

    return result;
};

const readImageData = async (image: string | Buffer) => {
    const result = await retry(async () => {
        const response = await Jimp.read(image);

        return response;
    });

    return result;
};



const getOpenseaName = async (address: string) => {
    try {
        const response = await axios.get(`https://api.opensea.io/api/v1/account/${address}`);

        const result = _.get(response, 'data');

        return _.get(result, ['data', 'user', 'username']);
    } catch (error) {
        console.log('getOpenseaName API error');
        console.log(`address: ${address}`);

        if (error instanceof Error) {
            const customError: CustomError = error;

            if (customError.response) {
                console.log(customError.response.data);
                console.log(customError.response.status);
            } else {
                console.error(error.message);
            }
        }

        return null;
    }
};



const retryOnGetContractMetadata = async (contractAddress: string): Promise<ContractData> => {
    const result = await retry(
        async () => {
            const response = await alchemy.nft.getContractMetadata(contractAddress);

            if (response === null) {
                console.error('Might hitting rate limit, try again');
            }

            return {
                name: _.get(response, 'name'),
                symbol: _.get(response, 'symbol'),
                tokenType: _.get(response, 'tokenType'),
                address: contractAddress
            };
        },
        {
            retries: 5
        }
    );

    return result;
};

const getAssetContract = async (contractAddress: string) => {
    try {
        const response = await axios.get(
            `https://api.opensea.io/api/v1/asset_contract/${contractAddress}`,
            {
                headers: {
                    'X-API-KEY': OPENSEA_API_KEY
                }
            }
        );

        return response;
    } catch (error) {
        console.log('getAssetContract API error');

        if (error instanceof Error) {
            const customError: CustomError = error;
            if (customError.response) {
                console.log(customError.response.data);
                console.log(customError.response.status);
            } else {
                console.error(error.message);
            }
        }
    }
};

const retryOnGetAssetContract = async (contractAddress: string): Promise<ContractData> => {
    const result = await retry(
        async () => {
            const response = await getAssetContract(contractAddress);

            if (response === null) {
                throw new Error('Might hitting rate limit, try again');
            }

            const data = _.get(response, 'data');

            return {
                name: _.get(data, ['collection', 'name']),
                symbol: _.get(data, 'symbol'),
                tokenType: _.get(data, 'schema_name'),
                address: contractAddress
            };
        },
        {
            retries: 5
        }
    );

    return result;
};

const getENSName = async (address: string) => {
    try {
        // const provider = new ethers.providers.CloudflareProvider();
        const provider = new ethers.providers.AlchemyProvider('homestead', ALCHEMY_API_KEY);
        const result = await provider.lookupAddress(address);

        return result;
    } catch (error) {
        console.log('API error: ', error);
    }
};

const isContract = async (address: string) => {
    try {
        // const provider = new ethers.providers.CloudflareProvider();
        const result = await provider.getCode(address);

        return result !== '0x';
    } catch (error) {
        console.log('API error: ', error);
    }
};

const getReadableName = async (address: string) => {
    const result =
        (await getOpenseaName(address)) || (await getENSName(address)) || shortenAddress(address);

    return result;
};


const getContractData = async (contractAddress: string) => {
    let contractData;

    if (DEFAULT_NFT_API === 'Alchemy') {
        contractData = await retryOnGetContractMetadata(contractAddress);
    } else {
        contractData = await retryOnGetAssetContract(contractAddress);
    }

    return contractData;
};

const getBatchContractData = async (contractAddresses: string[]): Promise<BatchContractInfo[]> => {
    const options = {
        method: 'POST',
        headers: { accept: 'application/json', 'content-type': 'application/json' },
        body: JSON.stringify({
            contractAddresses: contractAddresses
        })
    };

    const url = `
        https://eth-mainnet.g.alchemy.com/nft/v2/${ALCHEMY_API_KEY}/getContractMetadataBatch
    `;
    const result = await retry(
        async (bail) => {
            const response = await fetch(url, options);
            if (403 === response.status) {
                // don't retry upon 403
                bail(new Error('Unauthorized'));
                return;
              }
          
              const data = await response.json();
              return data;
        },
        {
            retries: 5
        }
    );
    return result;
};


const shortenAddress = (address: string) => {
    if (!ethers.utils.isAddress(address)) {
        throw new Error('Not a valid address');
    }
    return address.substring(0, 6) + '...' + address.substring(address.length - 4);
};

const getEthUsdPrice = async (ethPrice: number) => {
    const url = `
        https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${ETHERSCAN_API_KEY}
    `;
    const result = await retry(
        async () => {
            const response = await axios.get(url);
            const result = _.get(response, ['data', 'result']);
            const ethusd = _.get(result, 'ethusd');
            const usdPrice = (ethPrice * ethusd).toFixed(2);

            if (!response || !result || !ethusd || !usdPrice) {
                throw new Error('Might hitting rate limit, try again');
            }

            return parseFloat(usdPrice).toLocaleString('en-US');
        },
        {
            retries: 5
        }
    );

    return result;
};

const formatPrice = (price: number) => {
    let formatedPrice = price.toLocaleString('en-US', {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4
    });
    let lastIdx = formatedPrice.length - 1;
    let i = 0;

    while (formatedPrice[lastIdx] === '0' || formatedPrice[lastIdx] === '.') {
        i++;
        if (formatedPrice[lastIdx--] === '.') {
            break;
        }
    }

    if (i > 0) {
        formatedPrice = formatedPrice.slice(0, -i);
    }

    return formatedPrice === '' ? '0' : formatedPrice;
};

export {
    getENSName,
    formatPrice,
    readImageData,
    getArrayBuffer,
    shortenAddress,
    getEthUsdPrice,
    getOpenseaName,
    getContractData,
    getReadableName,
    isContract,
    getBatchContractData
};
