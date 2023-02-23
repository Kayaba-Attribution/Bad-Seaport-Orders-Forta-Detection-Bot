import { formatPrice, getTokenData, getReadableName, getEthUsdPrice, getCollectionFloorPrice } from '../utils/api.js';
import _ from 'lodash';
import { ethers, utils } from 'ethers';
import { markets } from '../config/markets.js';
import { currencies } from '../config/currencies.js';
import { saleEventTypes, cancelEventTypes } from '../config/logEventTypes.js';
import { initializeTransactionData } from '../config/initialize.js';

import { parseSeaport } from './parseSeaport.js';
import { parseSaleToken } from './parseSaleToken.js';

import type { ContractData, DecodedLogData, SeaportOrder, BatchContractInfo } from '../types/index.js';
import { NftTokenType } from 'alchemy-sdk';
import Web3EthAbi from 'web3-eth-abi';
import { alchemy } from '../config/setup.js';

import {
    Finding,
    FindingSeverity,
    FindingType,
    TransactionEvent,
} from "forta-agent";




const isSeaport = (
    decodedLogData: DecodedLogData | SeaportOrder
): decodedLogData is SeaportOrder => {
    return (decodedLogData as SeaportOrder).offer !== undefined;
};


async function transferIndexer(
    txEvent: TransactionEvent,
    contractData: BatchContractInfo
) {

    const contractAddress: string = contractData.address!;
    const transactionHash: string = txEvent.transaction.hash;

    let recipient: string = txEvent.to ? txEvent.to : '';

    // ! Create a tx obeject with empty fields, which will be filled later on
    const tx = initializeTransactionData(transactionHash, contractData.contractMetadata, recipient, contractAddress);
    const cancelEvents: Finding[] = [];

    for (const log of txEvent.logs) {
        const logAddress = log.address.toLowerCase();
        const logMarket = _.get(markets, logAddress);
        if (logAddress in currencies) {
            tx.currency = currencies[logAddress as keyof typeof currencies];
        }

        parseSaleToken(tx, log, logAddress);

        const isSale = logAddress === recipient && saleEventTypes.includes(log.topics[0]);

        const isCancel = cancelEventTypes.includes(log.topics[0])

        if (isCancel) {
            cancelEvents.push(Finding.fromObject({
                name: "Seaport 1.1 ERC-721 Transfer",
                description: `Seaport Orders Cancelled`,
                alertId: "FORTA-1",
                severity: FindingSeverity.Info,
                type: FindingType.Info,
            }));
        }

        if (cancelEvents.length === 1) {
            return cancelEvents[0];
        }

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
        console.error(`\n No tokens found. for hash ${transactionHash}\n`);
        return null;
    }

    tx.to = await getReadableName(tx.toAddr ?? '');
    tx.from = await getReadableName(tx.fromAddr ?? '');

    tx.floor = contractData.contractMetadata.openSea?.floorPrice;

    tx.tokenName = tx.tokenData?.name || `${tx.symbol} #${tx.tokenId}`;
    tx.usdPrice = (tx.currency.name === 'ETH' || tx.currency.name === 'WETH')
        ? await getEthUsdPrice(tx.totalPrice)
        : null;
    tx.ethUsdValue = tx.usdPrice ? `($ ${tx.usdPrice})` : '';

    if (tx) {
        const { tokenName, contractName, swap, market, totalPrice, currency, quantity, fromAddr, toAddr, tokenId } = tx;
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
                'tokenIds': tx.tokens!.toString(),
                'collectionFloor': tx.floor!.toString(),
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