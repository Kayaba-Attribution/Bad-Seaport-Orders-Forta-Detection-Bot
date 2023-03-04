
> forta-agent-starter@0.0.1 tx
> npm run build && forta-agent run --tx 0x4fff109d9a6c030fce4de9426229a113524903f0babd6de11ee6c046d07226ff


> forta-agent-starter@0.0.1 build
> tsc

run indexer for Mutant Hound Collars 0xae99a698156ee8f8d07cbe7f271c31eeaac07087
transferIndexer Running...
initializeTransactionData running...
parseSaleToken Running...
parseSeaport Running...
parseSaleToken Running...
parseSeaport Running...
parseSaleToken Running...
parseSaleToken Running...
parseSaleToken Running...
parseSaleToken Running...
parseSaleToken Running...
5 Mutant Hound Collars sold on Opensea 🌊 for 0.001 ETH
critical
object
storage length:  1
storage:  [
  Finding {
    name: 'Seaport 1.1 ERC721 Phishing Transfer',
    description: '5 Mutant Hound Collars ids: 6262,6696,8273,9791,9911 sold on Opensea 🌊 for 0.001 ETH with a floor price of 0.58 ETH',
    alertId: '0x971ea6bf1498c680b8b0ba118fce7f21514fe2570aa0e15e98af51fc9dd64131',
    protocol: 'ethereum',
    severity: 5,
    type: 1,
    metadata: {
      contractName: 'Mutant Hound Collars',
      quantity: '5',
      itemPrice: '0.0002',
      collectionFloor: '0.58',
      fromAddr: '0x08395c15c21dc3534b1c3b1d4fa5264e5bd7020c',
      toAddr: '0xbf96d79074b269f75c20bd9fa6daed0773209ee7',
      tokenIds: '6262,6696,8273,9791,9911',
      market: 'Opensea 🌊',
      currency: 'ETH',
      totalPrice: '0.001',
      hash: '0x4fff109d9a6c030fce4de9426229a113524903f0babd6de11ee6c046d07226ff',
      contractAddress: '0xae99a698156ee8f8d07cbe7f271c31eeaac07087'
    },
    addresses: [
      '0xbf96d79074b269f75c20bd9fa6daed0773209ee7',
      '0x08395c15c21dc3534b1c3b1d4fa5264e5bd7020c',
      '0xaefc35de05da370f121998b0e2e95698841de9b1',
      '0xae99a698156ee8f8d07cbe7f271c31eeaac07087'
    ],
    labels: [ [Label], [Label] ]
  }
]
1 findings for transaction 0x4fff109d9a6c030fce4de9426229a113524903f0babd6de11ee6c046d07226ff {
  "name": "Seaport 1.1 ERC721 Phishing Transfer",
  "description": "5 Mutant Hound Collars ids: 6262,6696,8273,9791,9911 sold on Opensea 🌊 for 0.001 ETH with a floor price of 0.58 ETH",
  "alertId": "0x971ea6bf1498c680b8b0ba118fce7f21514fe2570aa0e15e98af51fc9dd64131",
  "protocol": "ethereum",
  "severity": "Critical",
  "type": "Exploit",
  "metadata": {
    "contractName": "Mutant Hound Collars",
    "quantity": "5",
    "itemPrice": "0.0002",
    "collectionFloor": "0.58",
    "fromAddr": "0x08395c15c21dc3534b1c3b1d4fa5264e5bd7020c",
    "toAddr": "0xbf96d79074b269f75c20bd9fa6daed0773209ee7",
    "tokenIds": "6262,6696,8273,9791,9911",
    "market": "Opensea 🌊",
    "currency": "ETH",
    "totalPrice": "0.001",
    "hash": "0x4fff109d9a6c030fce4de9426229a113524903f0babd6de11ee6c046d07226ff",
    "contractAddress": "0xae99a698156ee8f8d07cbe7f271c31eeaac07087"
  },
  "addresses": [
    "0xbf96d79074b269f75c20bd9fa6daed0773209ee7",
    "0x08395c15c21dc3534b1c3b1d4fa5264e5bd7020c",
    "0xaefc35de05da370f121998b0e2e95698841de9b1",
    "0xae99a698156ee8f8d07cbe7f271c31eeaac07087"
  ],
  "labels": [
    {
      "entityType": "Address",
      "entity": "0xBF96d79074b269F75c20BD9fa6DAed0773209EE7",
      "label": "attacker",
      "confidence": 0.9,
      "remove": false
    },
    {
      "entityType": "Address",
      "entity": "0x08395C15C21DC3534B1C3b1D4FA5264E5Bd7020C",
      "label": "victim",
      "confidence": 0.9,
      "remove": false
    }
  ]
}
