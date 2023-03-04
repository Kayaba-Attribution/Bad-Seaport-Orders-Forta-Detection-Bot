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
    price: number,
    floorPrice: number,
    from: string,
    to: string,
    tokenId: string | string[],
    hash: string,
): [BatchContractInfo[], TransactionEvent] => {
    let mockApiDataArray: BatchContractInfo[] = [];
    let nftContract: string = address;
    const mockOpenSeaCollectionMetadata: OpenSeaCollectionMetadata = {
        floorPrice: floorPrice,
    }

    const mockApiData: BatchContractInfo = {
        address: nftContract,
        contractMetadata: {
            name: name,
            symbol: symbol,
            totalSupply: totalSupply,
            tokenType: tokenType == "ERC721" ? NftTokenType.ERC721 : NftTokenType.ERC1155,
            contractDeployer: '0x999',
            deployedBlockNumber: 999,
            openSea: mockOpenSeaCollectionMetadata,
            address: nftContract,
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
                    amount: ethers.utils.parseEther(price.toString()) // amount
                }
            ],
            [
                {
                    itemType: '0x0', // itemType
                    token: '0x0000000000000000000000000000000000000000',// token
                    identifier: '0x0', // identifier
                    amount: ethers.utils.parseEther(price.toString()), // amount
                    recipient: '0x00000000006c3852cbef3e08e8df289169ede581'
                }
            ]

        ]
    )
    const mockEvent = createTransactionEvent(
        {
            transaction: {
                hash: hash,
                to: '0x00000000006c3852cbef3e08e8df289169ede581'
            },
            addresses: {
                '0x00000000006c3852cbef3e08e8df289169ede581': true,
                nftContract: true
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
                    "transactionHash": hash,
                    "removed": false
                }
            ]
        } as any);

    if (tokenId instanceof Array) {
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
                "transactionHash": hash,
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
                "transactionHash": hash,
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

jest.setTimeout(5000);
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

    describe("SeaPort 1.1 NFTs transfers and phishing tracking", () => {
        it("Creates a critical sale alert connecting an attacker to a sell of stolen assets", async () => {
            let randomContract = createRandomAddress();
            let [mockApi, criticalEvent] = createBatchContractInfo(
                randomContract,
                'Mutant Hound Collars',
                'MHC',
                '100',
                'ERC721',
                0.001,
                0.58,
                victim,
                attacker,
                ['6262', '6696', '8273', '9791', '9911'],
                "0x001"
            )
            const findings = await handleTransaction(criticalEvent, mockApi);
            expect(storage.length).toBe(1);
            expect(findings[0].labels[0].entity).toBe(attacker);
            expect(findings[0].labels[1].entity).toBe(victim);
            expect(findings[0].labels[2].entity).toBe(`6262,${randomContract}`);

            [mockApi, criticalEvent] = createBatchContractInfo(
                randomContract,
                'Mutant Hound Collars',
                'MHC',
                '100',
                'ERC721',
                0.56,
                0.58,
                attacker,
                bob,
                ['6262'],
                "0x002"
            )
            const extraFinding = await handleTransaction(criticalEvent, mockApi);
            console.log(extraFinding);

        });
        it("returns critial finding for a NFT sale for very low value and check that is stored.", async () => {
            let randomContract = createRandomAddress();
            let [mockApi, criticalEvent] = createBatchContractInfo(
                randomContract,
                'stolenNFT',
                'SNFT',
                '100',
                'ERC721',
                0.001,
                10,
                victim,
                attacker,
                ['666'],
                "0x002"
            )
            const findings = await handleTransaction(criticalEvent, mockApi);
            expect(storage.length).toBe(2);
            expect(findings[0].name).toBe('Seaport 1.1 ERC721 Phishing Transfer');
            expect(findings[0].severity).toBe(5);
            expect(findings[0].description).toBe('1 stolenNFT id/s: 666 sold on Opensea 🌊 for 0.001 ETH with a floor price of 10 ETH');
            expect(findings[0].labels[0].entity).toBe(attacker);
            expect(findings[0].labels[1].entity).toBe(victim);
            expect(findings[0].labels[2].entity).toBe(`666,${randomContract}`);

        });

        it("returns an informational finding for a regular NFTs transfer", async () => {
            let randomContract = createRandomAddress();
            let [mockApi, criticalEvent] = createBatchContractInfo(
                randomContract,
                'TestNFT',
                'TST',
                '100',
                'ERC721',
                9,
                10,
                bob,
                alice,
                ['1', '2'],
                "0x001"
            )
            const findings = await handleTransaction(criticalEvent, mockApi);
            console.log(findings)
            expect(findings).toStrictEqual([
                Finding.fromObject(
                    {
                        name: 'Seaport 1.1 ERC721 Transfer',
                        description: 'Regular NFT Transfer',
                        alertId: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("0x001" + randomContract)),
                        protocol: 'ethereum',
                        severity: 2,
                        type: 4,
                        metadata: {
                            contractName: 'TestNFT',
                            quantity: '2',
                            itemPrice: '4.5',
                            collectionFloor: '10',
                            fromAddr: bob,
                            toAddr: alice,
                            tokenIds: '1,2',
                            market: 'Opensea 🌊',
                            currency: 'ETH',
                            totalPrice: '9',
                            hash: "0x001",
                            contractAddress: randomContract
                        },
                        addresses: [
                            alice.toLowerCase(),
                            bob.toLowerCase(),
                            'nftContract'
                        ],
                        labels: []
                    }
                ),
            ]);

        });


    });
});
