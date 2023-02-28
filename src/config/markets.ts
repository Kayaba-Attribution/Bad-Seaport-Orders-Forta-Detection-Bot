import type { Market } from '../types';

const markets: { [key: string]: Market } = {
    // Opensea Seaport Protocol Contract Address
    '0x00000000006c3852cbef3e08e8df289169ede581': {
        name: 'opensea',
        displayName: 'Opensea 🌊',
        color: '#2081e2',
        site: 'https://opensea.io/assets/',
        accountPage: 'https://opensea.io/',
        iconURL: 'https://pbs.twimg.com/profile_images/1544105652330631168/ZuvjfGkT_400x400.png',
        logDecoder: [
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
    },
    '0x0804b76278eac7c719ee7b7921b3f1071d1ae2f7': {
        name: 'opensea',
        displayName: 'Opensea 🌊',
        color: '#2081e2',
        site: 'https://opensea.io/assets/',
        accountPage: 'https://opensea.io/',
        iconURL: 'https://pbs.twimg.com/profile_images/1544105652330631168/ZuvjfGkT_400x400.png',
        logDecoder: [
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
    },
   
};

export { markets };
