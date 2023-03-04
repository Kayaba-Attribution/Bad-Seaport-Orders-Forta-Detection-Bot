import _ from 'lodash';

// modules
import {
    Finding,
    FindingSeverity,
    FindingType,
    TransactionEvent,
    EntityType,
} from "forta-agent";
import { utils } from 'ethers';
import Web3EthAbi from 'web3-eth-abi';

// config
import { markets } from '../config/markets.js';
import { currencies } from '../config/currencies.js';
import { saleEventTypes, cancelEventTypes } from '../config/logEventTypes.js';
import { initializeTransactionData } from '../config/initialize.js';

// parsers
import { parseSeaport } from './parseSeaport.js';
import { parseSaleToken } from './parseSaleToken.js';

// api
import { getReadableName, getEthUsdPrice } from '../utils/api.js';

import type { DecodedLogData, SeaportOrder, BatchContractInfo } from '../types/index.js';

const isSeaport = (
    decodedLogData: DecodedLogData | SeaportOrder
): decodedLogData is SeaportOrder => {
    return (decodedLogData as SeaportOrder).offer !== undefined;
};

async function transferIndexer(
    txEvent: TransactionEvent,
    contractData: BatchContractInfo
) {

    //console.log("transferIndexer Running...")
    const contractAddress: string = contractData.address!;
    const transactionHash: string = txEvent.transaction.hash;

    let recipient: string = txEvent.to ? txEvent.to : '';

    if (!(recipient.toLowerCase() in markets)) {
        return [];
    }
    const tx = initializeTransactionData(transactionHash, contractData.contractMetadata, recipient, contractAddress);
    for (const log of txEvent.logs) {
        const logAddress = log.address.toLowerCase();
        const logMarket = _.get(markets, logAddress);
        if (logAddress in currencies) {
            tx.currency = currencies[logAddress as keyof typeof currencies];
        }

        parseSaleToken(tx, log, logAddress);

        const isSale = logAddress === recipient && saleEventTypes.includes(log.topics[0]);
        const isCancel = cancelEventTypes.includes(log.topics[0])

        if (isSale) {
            const marketLogDecoder = isSale
                ? tx.market.logDecoder
                : markets[logAddress as keyof typeof markets].logDecoder;

            if (marketLogDecoder === undefined) {
                return null;
            }

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
        
        let metadata_ = {
            'contractName': contractName!,
            'quantity': quantity.toString(),
            'itemPrice': itemPrice.toString(),
            'collectionFloor': tx.floor?.toString() || "UNKWN",
            'fromAddr': fromAddr!.toLowerCase(),
            'toAddr': toAddr!.toLowerCase(),
            'tokenIds': tokenIds_,
            'market': market.displayName,
            'currency': currency?.name || "ETH",
            'totalPrice': totalPrice.toString(),
            'hash': transactionHash,
            'contractAddress': contractAddress
        }

        if (itemPrice < tx.floor! * 0.01 && tx.floor!.toString() !== 'UNKWN' && tx.tokenType !== 'ERC1155' ) {
            // Item price is under 1% of floor price
            let critFind: Finding = Finding.fromObject({
                name: `Seaport 1.1 ${tx.tokenType} Phishing Transfer`,
                description: `${quantity} ${contractName || tokenName} id/s: ${tokenIds_} sold on ${market.displayName} for ${totalPrice} ${currency.name} with a floor price of ${tx.floor} ${currency.name}`,
                alertId: alertId_,
                severity: FindingSeverity.Critical,
                type: FindingType.Exploit,
                metadata: metadata_,
                labels: [
                    {
                        entityType: EntityType.Address,
                        entity: toAddr!.toLowerCase(),
                        label: "attacker",
                        confidence: 0.9,
                        remove: false
                    },
                    {
                        entityType: EntityType.Address,
                        entity: fromAddr!.toLowerCase(),
                        label: "victim",
                        confidence: 0.9,
                        remove: false
                    }
                ]
            })
            let tokenIdsArr = tokenIds_.split(',');
            for (const id of tokenIdsArr) {
                critFind.labels.push({
                    entityType: EntityType.Address,
                    entity: `${id},${contractAddress}`,
                    label: "stolen",
                    confidence: 0.9,
                    remove: false,
                })
            }
            return critFind;
        } else {
            // Regular Transfer
            return Finding.fromObject({
                name: `Seaport 1.1 ${tx.tokenType} Transfer`,
                description: `Regular NFT Transfer`,
                alertId: alertId_,
                severity: FindingSeverity.Info,
                type: FindingType.Info,
                metadata: metadata_,
            })
        }
    }
};

export { transferIndexer };
