import { markets } from './markets.js';
import type { BatchContractInfo, TransactionData } from '../types';

export const initializeTransactionData = (
    transactionHash: string,
    contractData: BatchContractInfo['contractMetadata'],
    recipient: string,
    contractAddress: string
) => {
    //console.log(contractAddress)
    //console.log(recipient)
    //console.log(contractData ? contractData.symbol : "no contract data")
    //console.log(markets[recipient.toLowerCase()] ? markets[recipient.toLowerCase()].name : "no market data")
    let tx: TransactionData;
    console.log("initializeTransactionData running...")
    try {
        tx = {
            recipient: markets[recipient].name,
            tokens: [],
            prices: [],
            totalPrice: 0,
            quantity: 0,
            symbol: contractData.symbol,
            tokenType: contractData.tokenType,
            contractName: contractData.name,
            marketList: [],
            market: markets[recipient],
            currency: { name: 'ETH', decimals: 18 },
            contractAddress: contractAddress,
            transactionHash: transactionHash,
            seaportIdentifiers: []
        };
    } catch (error) {
        console.log("LOL", error)
    }
    //console.log(tx!)

    return tx!;
};
