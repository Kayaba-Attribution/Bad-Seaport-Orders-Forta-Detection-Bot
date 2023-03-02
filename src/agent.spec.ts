import {
    FindingType,
    FindingSeverity,
    Finding,
    createTransactionEvent,
    ethers,
    TransactionEvent
} from "forta-agent";

import 'whatwg-fetch'


import { NftTokenType, OpenSeaCollectionMetadata } from 'alchemy-sdk';

import agent, {
    findingSearch,
    SEAPORT_ADDRESS,
} from "./agent";

import { transferIndexer } from "./controllers/iso.js";
import type { BatchContractInfo } from './types';

// returns an object of type BatchContractInfo (nft contract data using Alchemy API)
const createBatchContractInfo = (
    address: string,
    name: string,
    symbol: string,
    totalSupply: string,
    tokenType: string,
    floorPrice: number
): BatchContractInfo[] => {
    let res: BatchContractInfo[] = [];

    const mockOpenSeaCollectionMetadata: OpenSeaCollectionMetadata = {
        floorPrice: floorPrice,
    }

    let mockApiData: BatchContractInfo = {
        address: address,
        contractMetadata: {
            name: name,
            symbol: symbol,
            totalSupply: totalSupply,
            tokenType: tokenType == "ERC721" ? NftTokenType.ERC721 : NftTokenType.ERC1155,
            contractDeployer: '0x999',
            deployedBlockNumber: 999,
            openSea: mockOpenSeaCollectionMetadata,
            address: address,
        }
    }

    res.push(mockApiData);

    return res;
};



type HandleTransaction = (txEvent: TransactionEvent, test?: BatchContractInfo[]) => Promise<Finding[]>;
jest.setTimeout(60000)
describe("high tether transfer agent", () => {
    let handleTransaction: HandleTransaction;
    const mockTxEvent = createTransactionEvent({} as any);

    beforeAll(() => {
        handleTransaction = agent.handleTransaction;
    });

    describe("handleTransaction", () => {
        // it("returns empty findings if there are no OpenSea Sales", async () => {

        //     const findings = await handleTransaction(mockTxEvent);

        //     expect(findings).toStrictEqual([]);
        // });

        it("returns a finding", async () => {
            const criticalEvent = createTransactionEvent(
                {
                    transaction: {
                        hash: '0x1234',
                        to: SEAPORT_ADDRESS
                    },
                    addresses: {
                        '0x00000000006c3852cbef3e08e8df289169ede581': true,
                        '0x1': true
                    },
                    logs: [
                        {
                            "address": "0x111",
                            "topics": [
                                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                                "0x00000000000000000000000008395c15c21dc3534b1c3b1d4fa5264e5bd7020c",
                                "0x000000000000000000000000bf96d79074b269f75c20bd9fa6daed0773209ee7",
                                "0x0000000000000000000000000000000000000000000000000000000000000001"
                            ],
                            "data": "0x576b9b7de07c6332ddd0b627851cb0c4e943542ac61e83bffb91f2363521d96e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000000050000000000000000000000000000000000000000000000000000000000000002000000000000000000000000ae99a698156ee8f8d07cbe7f271c31eeaac07087000000000000000000000000000000000000000000000000000000000000187600000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000ae99a698156ee8f8d07cbe7f271c31eeaac070870000000000000000000000000000000000000000000000000000000000001a2800000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000ae99a698156ee8f8d07cbe7f271c31eeaac07087000000000000000000000000000000000000000000000000000000000000205100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000ae99a698156ee8f8d07cbe7f271c31eeaac07087000000000000000000000000000000000000000000000000000000000000263f00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000ae99a698156ee8f8d07cbe7f271c31eeaac0708700000000000000000000000000000000000000000000000000000000000026b7000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000070000000000000000000000000000000000000000000000000000000000000002000000000000000000000000ae99a698156ee8f8d07cbe7f271c31eeaac0708700000000000000000000000000000000000000000000000000000000000018760000000000000000000000000000000000000000000000000000000000000001000000000000000000000000bf96d79074b269f75c20bd9fa6daed0773209ee70000000000000000000000000000000000000000000000000000000000000002000000000000000000000000ae99a698156ee8f8d07cbe7f271c31eeaac070870000000000000000000000000000000000000000000000000000000000001a280000000000000000000000000000000000000000000000000000000000000001000000000000000000000000bf96d79074b269f75c20bd9fa6daed0773209ee70000000000000000000000000000000000000000000000000000000000000002000000000000000000000000ae99a698156ee8f8d07cbe7f271c31eeaac0708700000000000000000000000000000000000000000000000000000000000020510000000000000000000000000000000000000000000000000000000000000001000000000000000000000000bf96d79074b269f75c20bd9fa6daed0773209ee70000000000000000000000000000000000000000000000000000000000000002000000000000000000000000ae99a698156ee8f8d07cbe7f271c31eeaac07087000000000000000000000000000000000000000000000000000000000000263f0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000bf96d79074b269f75c20bd9fa6daed0773209ee70000000000000000000000000000000000000000000000000000000000000002000000000000000000000000ae99a698156ee8f8d07cbe7f271c31eeaac0708700000000000000000000000000000000000000000000000000000000000026b70000000000000000000000000000000000000000000000000000000000000001000000000000000000000000bf96d79074b269f75c20bd9fa6daed0773209ee7000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000376c1e0a7f00000000000000000000000000008395c15c21dc3534b1c3b1d4fa5264e5bd7020c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016bcc41e90000000000000000000000000000000a26b00c1f0df003000390027140000faa719",
                            "logIndex": 72,
                            "blockNumber": 16217012,
                            "blockHash": "0x4b1f94a7fc5ca5bb74bde07406c1187b0d4dc12c4aacb11972cf2e7fe5fc9608",
                            "transactionIndex": 40,
                            "transactionHash": "0x1234",
                            "removed": false
                        }
                    ]
                } as any);


            //console.log(criticalEvent);
            const findings = await handleTransaction(criticalEvent,
                createBatchContractInfo(
                    '0x111',
                    'TestNFT',
                    'TST',
                    '100',
                    'ERC721',
                    10
                )
            );
            console.log(findings);

        });

        // it("returns a finding if there is a Tether transfer over 10,000", async () => {
        //   const mockTetherTransferEvent = {
        //     args: {
        //       from: "0xabc",
        //       to: "0xdef",
        //       value: ethers.BigNumber.from("20000000000"), //20k with 6 decimals
        //     },
        //   };
        //   mockTxEvent.filterLog = jest
        //     .fn()
        //     .mockReturnValue([mockTetherTransferEvent]);

        //   const findings = await handleTransaction(mockTxEvent);

        //   const normalizedValue = mockTetherTransferEvent.args.value.div(
        //     10 ** TETHER_DECIMALS
        //   );
        //   expect(findings).toStrictEqual([
        //     Finding.fromObject({
        //       name: "High Tether Transfer",
        //       description: `High amount of USDT transferred: ${normalizedValue}`,
        //       alertId: "FORTA-1",
        //       severity: FindingSeverity.Low,
        //       type: FindingType.Info,
        //       metadata: {
        //         to: mockTetherTransferEvent.args.to,
        //         from: mockTetherTransferEvent.args.from,
        //       },
        //     }),
        //   ]);
        //   expect(mockTxEvent.filterLog).toHaveBeenCalledTimes(1);
        //   expect(mockTxEvent.filterLog).toHaveBeenCalledWith(
        //     ERC20_TRANSFER_EVENT,
        //     TETHER_ADDRESS
        //   );
        // });
    });
});
