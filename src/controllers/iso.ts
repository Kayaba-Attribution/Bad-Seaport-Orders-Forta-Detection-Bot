import { formatPrice, getReadableName, getEthUsdPrice } from '../utils/api.js';
import _ from 'lodash';
import { ethers, utils } from 'ethers';
import { markets } from '../config/markets.js';
import { currencies } from '../config/currencies.js';
import { saleEventTypes, cancelEventTypes } from '../config/logEventTypes.js';
import { initializeTransactionData } from '../config/initialize.js';

import { parseSeaport } from './parseSeaport.js';
import { parseSaleToken } from './parseSaleToken.js';

import type { DecodedLogData, SeaportOrder, BatchContractInfo } from '../types/index.js';
import { NftTokenType } from 'alchemy-sdk';
import Web3EthAbi from 'web3-eth-abi';
import { alchemy } from '../config/setup.js';

import {
    Finding,
    FindingSeverity,
    FindingType,
    TransactionEvent,
    EntityType,
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

    console.log("transferIndexer Running...")
    const contractAddress: string = contractData.address!;
    const transactionHash: string = txEvent.transaction.hash;

    let recipient: string = txEvent.to ? txEvent.to : '';

    // if recipient not in markets return []
    if (!(recipient.toLowerCase() in markets)) {
        return [];
    }

    // ! Create a tx obeject with empty fields, which will be filled later on

    const tx = initializeTransactionData(transactionHash, contractData.contractMetadata, recipient, contractAddress);
    //console.log("txEvent.logs:", txEvent.logs)
    
    for (const log of txEvent.logs) {
        const logAddress = log.address.toLowerCase();
        const logMarket = _.get(markets, logAddress);
        if (logAddress in currencies) {
            tx.currency = currencies[logAddress as keyof typeof currencies];
        }

        parseSaleToken(tx, log, logAddress);

        const isSale = logAddress === recipient && saleEventTypes.includes(log.topics[0]);
        const isCancel = cancelEventTypes.includes(log.topics[0])
        //console.log("isSale:", isSale)
        //console.log(logAddress, recipient, saleEventTypes.includes(log.topics[0]))
        if (isSale) {
            const marketLogDecoder = isSale
                ? tx.market.logDecoder
                : markets[logAddress as keyof typeof markets].logDecoder;

            if (marketLogDecoder === undefined){
                console.log("marketLogDecoder is undefined")
                return null;
            } 

            const decodedLogData = Web3EthAbi.decodeLog(marketLogDecoder, log.data, []);
            // if(log.data !== "0x") {
            //     console.log('\n\n -------------- \n\n')
            //     console.log("log:", log.data)
            //     console.log("decoded:", decodedLogData)
            //     console.log("marketLogDecoder:", marketLogDecoder)
            //     console.log('\n\n -------------- \n\n')
            // }
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

    tx.tokenName = tx.contractName || `${tx.symbol} #${tx.tokenId}`;
    tx.usdPrice = (tx.currency.name === 'ETH' || tx.currency.name === 'WETH')
        ? await getEthUsdPrice(tx.totalPrice)
        : null;
    tx.ethUsdValue = tx.usdPrice ? `($ ${tx.usdPrice})` : '';

    const { tokenName, contractName, market, totalPrice, currency, quantity, fromAddr, toAddr } = tx;
    if (tx) {
        console.log(`${quantity} ${contractName || tokenName} sold on ${market.displayName} for ${totalPrice} ${currency.name}`);

        let itemPrice: number = totalPrice / quantity;
        let tokenIds_ = tx.tokenType === 'ERC721' ? tx.tokens!.toString() : tx.tokenId!;
        let alertId_ = utils.keccak256(utils.toUtf8Bytes(transactionHash + contractAddress))
        
        if (itemPrice < tx.floor! * 0.01) {
            // Item price is under 1% of floor price
            return Finding.fromObject({
                name: `Seaport 1.1 ${tx.tokenType} Phishing Transfer`,
                description: `${quantity} ${contractName || tokenName} ids: ${tokenIds_} sold on ${market.displayName} for ${totalPrice} ${currency.name} with a floor price of ${tx.floor} ${currency.name}`,
                alertId: alertId_,
                severity: FindingSeverity.Critical,
                type: FindingType.Exploit,
                metadata: {
                    'contractName': contractName!,
                    'quantity': quantity.toString(),
                    'itemPrice': itemPrice.toString(),
                    'collectionFloor': tx.floor!.toString(),
                    'fromAddr': fromAddr!,
                    'toAddr': toAddr!,
                    'tokenIds': tokenIds_,
                    'market': market.displayName,
                    'currency': currency?.name,
                    'totalPrice': totalPrice.toString(),
                    'hash': transactionHash,
                    'contractAddress': contractAddress
                },
                labels: [
                    {
                        entityType: EntityType.Address,
                        entity: toAddr!,
                        label: "attacker",
                        confidence: 0.9,
                        remove: false
                    },
                    {
                        entityType: EntityType.Address,
                        entity: fromAddr!,
                        label: "victim",
                        confidence: 0.9,
                        remove: false
                    },
                    {
                        entityType: EntityType.Unknown,
                        entity: tokenIds_,
                        label: "Stolen NFTs Ids",
                        confidence: 0.9,
                        remove: false
                    }
                ]
            })
        } else {
            // Regular Transfer
            return Finding.fromObject({
                name: `Seaport 1.1 ${tx.tokenType} Transfer`,
                description: `Regular NFT Transfer`,
                alertId: alertId_,
                severity: FindingSeverity.Low,
                type: FindingType.Info,
                metadata: {

                    'contractName': contractName!,
                    'quantity': quantity.toString(),
                    'itemPrice': itemPrice.toString(),
                    'collectionFloor': tx.floor!.toString(),
                    'fromAddr': fromAddr!,
                    'toAddr': toAddr!,
                    'tokenIds': tokenIds_,
                    'market': market.displayName,
                    'currency': currency?.name || "ETH",
                    'totalPrice': totalPrice.toString(),
                    'hash': transactionHash,
                    'contractAddress': contractAddress
                },
            })
        }
    }
};

export { transferIndexer };
//const transactionHash = '0x4fff109d9a6c030fce4de9426229a113524903f0babd6de11ee6c046d07226ff';
//const recipient = '0x00000000006c3852cbef3e08e8df289169ede581';
//const contractAddress = '0xae99a698156ee8f8d07cbe7f271c31eeaac07087';
//const contractData: ContractData = { name: 'Mutant Hound Collars', symbol: 'MHC', tokenType: NftTokenType.ERC721 };
//await transferIndexer(transactionHash, contractAddress, contractData);