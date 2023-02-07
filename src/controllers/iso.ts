import { formatPrice, getTokenData, getReadableName, getEthUsdPrice, getCollectionFloorPrice } from '../utils/api.js';
import _ from 'lodash';
import { ethers } from 'ethers';
import { markets } from '../config/markets.js';
import { currencies } from '../config/currencies.js';
import { saleEventTypes } from '../config/logEventTypes.js';
import { initializeTransactionData } from '../config/initialize.js';

import { parseSeaport } from './parseSeaport.js';
import { parseSaleToken } from './parseSaleToken.js';

import type { ContractData, DecodedLogData, SeaportOrder } from '../types/index.js';
import { NftTokenType } from 'alchemy-sdk';
import Web3EthAbi from 'web3-eth-abi';
import { alchemy } from '../config/setup.js';

import {
    Finding,
    FindingSeverity,
    FindingType,
} from "forta-agent";



const isSeaport = (
    decodedLogData: DecodedLogData | SeaportOrder
): decodedLogData is SeaportOrder => {
    return (decodedLogData as SeaportOrder).offer !== undefined;
};


async function parseTransaction(
    transactionHash: string,
    contractAddress: string,
    contractData: ContractData
) {
    // ! Check the "to" filed on Alchemy txn receipt to match for markets (marketplaces)
    const receipt = await alchemy.core.getTransactionReceipt(transactionHash);
    console.log(receipt)
    const recipient = receipt ? receipt.to.toLowerCase() : '';

    if (!receipt || !(recipient in markets)) {
        return null;
    }
    // ! Create a tx obeject with empty fields, which will be filled later on
    const tx = initializeTransactionData(transactionHash, contractData, recipient, contractAddress);

    for (const log of receipt.logs) {
        //console.log(receipt.logs);
        const logAddress = log.address.toLowerCase();
        const logMarket = _.get(markets, logAddress);
        if (logAddress in currencies) {
            tx.currency = currencies[logAddress as keyof typeof currencies];
        }

        parseSaleToken(tx, log, logAddress);

        const isSale = logAddress === recipient && saleEventTypes.includes(log.topics[0]);
        
        if (isSale) {
            const marketLogDecoder = isSale
                ? tx.market.logDecoder
                : markets[logAddress as keyof typeof markets].logDecoder;

            if (marketLogDecoder === undefined) return null;

            const decodedLogData = Web3EthAbi.decodeLog(marketLogDecoder, log.data, []);

            if (isSeaport(decodedLogData)) {
                const parseResult = parseSeaport(tx, log, logMarket, decodedLogData);

                if (parseResult === false) continue;
            }
        }
    }

    tx.quantity = tx.tokenType === 'ERC721' ? tx.tokens.length : _.sum(tx.tokens);

    if ((tx.quantity === 0)) {
        console.error('No tokens found. Please check the contract address is correct.');
        return null;
    }
    tx.to = await getReadableName(tx.toAddr ?? '');

    let floor = await getCollectionFloorPrice(contractAddress);
    if (floor && 'floorPrice' in floor.openSea) {
        tx.floor = floor.openSea.floorPrice;
    } else {
        console.log('floor is undefined or openSea is of type FloorPriceError');
    }

    tx.from = await getReadableName(tx.fromAddr ?? '');
    tx.tokenData = await getTokenData(contractAddress, tx.tokenId ?? '', tx.tokenType);
    tx.tokenName = tx.tokenData?.name || `${tx.symbol} #${tx.tokenId}`;
    tx.sweeperAddr = receipt.from;
    tx.usdPrice = (tx.currency.name === 'ETH' || tx.currency.name === 'WETH')
            ? await getEthUsdPrice(tx.totalPrice)
            : null;
    tx.ethUsdValue = tx.usdPrice ? `($ ${tx.usdPrice})` : '';
    

    return tx;
}


const transferIndexer = async (transactionHash: string, contractData: ContractData) => {
    const contractAddress: string = contractData.address!;
    const txData = await parseTransaction(transactionHash, contractAddress, contractData);
    if (txData) {
        const { tokenName, contractName, swap, market, totalPrice, currency, quantity, fromAddr, toAddr, tokenId } = txData;
        console.log(`${quantity} ${contractName || tokenName} sold on ${market.displayName} for ${totalPrice} ${currency.name}`);
        
        return Finding.fromObject({
            name: "Seaport 1.1 ERC-721 Transfer",
            description: `Bad Seaport Orders Forta Detection`,
            alertId: "FORTA-1",
            severity: FindingSeverity.Low,
            type: FindingType.Info,
            metadata: {
                'quantity': quantity.toString(),
                'contractName': contractName!,
                'market': market.displayName,
                'currency': currency?.name,
                'price': totalPrice.toString(),
                'fromAddr': fromAddr!,
                'toAddr': toAddr!,
                'tokenIds': txData.tokens!.toString(),
                'collectionFloor': txData.floor!.toString()
            },
        })

    }
};

export { transferIndexer };
//const transactionHash = '0x4fff109d9a6c030fce4de9426229a113524903f0babd6de11ee6c046d07226ff';
//const recipient = '0x00000000006c3852cbef3e08e8df289169ede581';
//const contractAddress = '0xae99a698156ee8f8d07cbe7f271c31eeaac07087';
//const contractData: ContractData = { name: 'Mutant Hound Collars', symbol: 'MHC', tokenType: NftTokenType.ERC721 };
//await transferIndexer(transactionHash, contractAddress, contractData);