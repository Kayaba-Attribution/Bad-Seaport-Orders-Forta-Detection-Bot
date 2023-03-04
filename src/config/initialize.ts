import { markets } from './markets.js';
import type { BatchContractInfo, TransactionData } from '../types';

export const initializeTransactionData = (
    transactionHash: string,
    contractData: BatchContractInfo['contractMetadata'],
    recipient: string,
    contractAddress: string
) => {
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
        console.log("initializeTransactionData error", error)
    }


    return tx!;
};
