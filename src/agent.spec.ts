import {
    FindingType,
    FindingSeverity,
    Finding,
    createTransactionEvent,
    ethers,
    TransactionEvent
} from "forta-agent";

import agent, { storage } from "./agent";
import Web3EthAbi from 'web3-eth-abi';
import { NftTokenType, OpenSeaCollectionMetadata } from 'alchemy-sdk';
import type { BatchContractInfo } from './types';

const openSeaLogJSON = [
    {
        type: 'bytes32',
        name: 'orderHash'
    },
    {
        type: 'address',
        name: 'recipient'
    },
    {
        type: 'tuple[]',
        name: 'offer',
        components: [
            {
                type: 'uint8',
                name: 'itemType'
            },
            {
                type: 'address',
                name: 'token'
            },
            {
                type: 'uint256',
                name: 'identifier'
            },
            {
                type: 'uint256',
                name: 'amount'
            }
        ]
    },
    {
        type: 'tuple[]',
        name: 'consideration',
        components: [
            {
                type: 'uint8',
                name: 'itemType'
            },
            {
                type: 'address',
                name: 'token'
            },
            {
                type: 'uint256',
                name: 'identifier'
            },
            {
                type: 'uint256',
                name: 'amount'
            },
            {
                type: 'address',
                name: 'recipient'
            }
        ]
    }
]

const createBatchContractInfo = (
    address: string,
    name: string,
    symbol: string,
    totalSupply: string,
    tokenType: string,
    floorPrice: number,
    from: string,
    to: string,
    tokenId: string | string[]
): [BatchContractInfo[], TransactionEvent] => {
    let mockApiDataArray: BatchContractInfo[] = [];

    const mockOpenSeaCollectionMetadata: OpenSeaCollectionMetadata = {
        floorPrice: floorPrice,
    }

    const mockApiData: BatchContractInfo = {
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
    const SeaPortOrderData: string = Web3EthAbi.encodeParameters(openSeaLogJSON,
        [
            '0x1b258db8d5c9f6842b522df8b87715dbb2827e1b1f761ca7ca06d01c3baa9ae3', // orderHash
            '0x00000000006c3852cbef3e08e8df289169ede581', // recipient
            [ // OFFER
                {
                    itemType: '0x0', // itemType
                    token: address,// token
                    identifier: '0x0', // identifier
                    amount: '1000000000000000' // amount
                }
            ],
            [
                {
                    itemType: '0x0', // itemType
                    token: '0x0000000000000000000000000000000000000000',// token
                    identifier: '0x0', // identifier
                    amount: '1000000000000000', // amount
                    recipient: '0x00000000006c3852cbef3e08e8df289169ede581'
                }
            ]

        ]
    )
    console.log(SeaPortOrderData)
    const mockEvent = createTransactionEvent(
        {
            transaction: {
                hash: '0x1234',
                to: '0x00000000006c3852cbef3e08e8df289169ede581'
            },
            addresses: {
                '0x00000000006c3852cbef3e08e8df289169ede581': true,
                address: true
            },
            logs: [
                {
                    "address": '0x00000000006c3852cbef3e08e8df289169ede581',
                    "topics": [
                        "0x9d9af8e38d66c62e2c12f0225249fd9d721c54b83f48d9352c97c6cacdcb6f31",
                        Web3EthAbi.encodeParameter('address', from),
                        Web3EthAbi.encodeParameter('address', to),
                    ],
                    "data": SeaPortOrderData,
                    "logIndex": 1,
                    "blockNumber": 16217012,
                    "blockHash": "0x4b1f94a7fc5ca5bb74bde07406c1187b0d4dc12c4aacb11972cf2e7fe5fc9608",
                    "transactionIndex": 1,
                    "transactionHash": "0x1234",
                    "removed": false
                }
            ]
        } as any);

    if (tokenId instanceof Array) {
        console.log("tokenId is an array")
        for (let i = 0; i < tokenId.length; i++) {
            let newTransferLog = {
                "address": address,
                "topics": [
                    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                    Web3EthAbi.encodeParameter('address', from),
                    Web3EthAbi.encodeParameter('address', to),
                    Web3EthAbi.encodeParameter('uint256', tokenId[i]),
                ],
                "data": "0x",
                "logIndex": i + 1,
                "blockNumber": 16217012,
                "blockHash": "0x4b1f94a7fc5ca5bb74bde07406c1187b0d4dc12c4aacb11972cf2e7fe5fc9608",
                "transactionIndex": 1 + 1,
                "transactionHash": "0x1234",
                "removed": false
            }
            
            mockEvent.logs.push(newTransferLog);
        }
    } else {
        mockEvent.logs.push(
            {
                "address": address,
                "topics": [
                    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                    Web3EthAbi.encodeParameter('address', from),
                    Web3EthAbi.encodeParameter('address', to),
                    Web3EthAbi.encodeParameter('uint256', tokenId),
                ],
                "data": "0x",
                "logIndex": 2,
                "blockNumber": 16217012,
                "blockHash": "0x4b1f94a7fc5ca5bb74bde07406c1187b0d4dc12c4aacb11972cf2e7fe5fc9608",
                "transactionIndex": 2,
                "transactionHash": "0x1234",
                "removed": false
            }
        );
    }

    mockApiDataArray.push(mockApiData);

    return [mockApiDataArray, mockEvent];
};


function createRandomAddress(): string {
    let r = (Math.random() + 1).toString(36).substring(7);
    return ethers.Wallet.createRandom([r]).address.toLowerCase();
}


type HandleTransaction = (txEvent: TransactionEvent, test?: BatchContractInfo[]) => Promise<Finding[]>;
jest.setTimeout(60000)
describe("high tether transfer agent", () => {
    let handleTransaction: HandleTransaction;
    let victim: string;
    let attacker: string;
    let bob: string;
    let alice: string;

    beforeAll(() => {
        handleTransaction = agent.handleTransaction;
        victim = createRandomAddress();
        attacker = createRandomAddress();
        bob = createRandomAddress();
        alice = createRandomAddress();
    });

    describe("returns an informational finding for regular NFTs transfer", () => {
        it("returns a finding", async () => {
            let randomContract = createRandomAddress();
            let [mockApi, criticalEvent] = createBatchContractInfo(
                randomContract,
                'TestNFT',
                'TST',
                '100',
                'ERC721',
                10,
                victim,
                attacker,
                ['1', '2']
            )
            const findings = await handleTransaction(criticalEvent, mockApi);
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
