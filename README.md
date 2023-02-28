# Large Tether Transfer Agent

## Description

This agent detects transactions with large Tether transfers

## Supported Chains

- Ethereum
- List any other chains this agent can support e.g. BSC

## Alerts

Describe each of the type of alerts fired by this agent

- FORTA-1
  - Fired when a transaction contains a Tether transfer over 10,000 USDT
  - Severity is always set to "low" (mention any conditions where it could be something else)
  - Type is always set to "info" (mention any conditions where it could be something else)
  - Mention any other type of metadata fields included with this alert

## Test Data

The agent behaviour can be verified with the following transactions:

- 0x3a0f757030beec55c22cbc545dd8a844cbbb2e6019461769e1bc3f3a95d10826 (15,000 USDT)

### Attack Analysis: 

[example etherscan nft changes](https://etherscan.io/nft/0xae99a698156ee8f8d07cbe7f271c31eeaac07087/6262)

Blocks Span: 16217012 - 16219118
Smallest Test: 16217012..16218814

16217012 [Attacker gets 5 MHC (6262,6696,8273,9791,9911) for 0.001 ETH](https://etherscan.io/tx/0x4fff109d9a6c030fce4de9426229a113524903f0babd6de11ee6c046d07226ff)

16219118 [Attacker sells 1 MHC (6262) for 0.579 ETH](https://etherscan.io/tx/0xdc6fd3c2846f330aec65615341789397e1a9bb37a471851fe68b2db20a5a7b9f)

16218884 [Attacker sells 1 MHC (6696) for 0.579 ETH](https://etherscan.io/tx/0xfbcb46427535e38d1634143f5ece0282f627e64a9c32977ded70e4a2222227a1)

16218914 [Attacker sells 1 MHC (8273) for 0.579 ETH](https://etherscan.io/tx/0x19c693157c14e180fecad15abaa9b1cd927d2abd25a0aa9d67876660351a7637)

16218814 [Attacker sells 1 MHC (9791) for 0.56 WETH](https://etherscan.io/tx/0x2062705b2f7294316a2bae5e119817ff3266a4587d22a4dc9ebb1ab558959551)

16219019 [Attacker sells 1 MHC (9911) for 0.57 ETH](https://etherscan.io/tx/0x70f5f57a09365442ece8b8de8ea2e1a82f327d85d782913621688736b3a260f0)

### Regular OpenSea Sales

(fulfillBasicOrder example)[https://etherscan.io/tx/0x52d8e0c43d0b6a7a62ee8bf2c57afd7ad7ccc931d41f35b4844d7720a8675d75]
```bash
1 findings for transaction 0x52d8e0c43d0b6a7a62ee8bf2c57afd7ad7ccc931d41f35b4844d7720a8675d75 {
  "name": "Seaport 1.1 ERC-721 Transfer",
  "description": "Bad Seaport Orders Forta Detection",
  "alertId": "FORTA-1",
  "protocol": "ethereum",
  "severity": "Low",
  "type": "Info",
  "metadata": {
    "contractName": "MEMEASF Master Pass",
    "quantity": "1",
    "itemPrice": "1.2690000000000001",
    "collectionFloor": "1.3",
    "fromAddr": "0xDBF511df11612E32625B80A0aC97266e62795c51",
    "toAddr": "0x271c6f480Aeb26672B915A7b33159cE8f1e97fd3",
    "tokenIds": "70",
    "market": "Opensea 🌊",
    "currency": "ETH",
    "totalPrice": "1.2690000000000001",
    "hash": "0x52d8e0c43d0b6a7a62ee8bf2c57afd7ad7ccc931d41f35b4844d7720a8675d75",
    "contractAddress": "0x58cab2ad4338b2afe24dd26a6821a3b39c69f63a"
  },
  "addresses": [
    "0x271c6f480aeb26672b915a7b33159ce8f1e97fd3",
    "0xdbf511df11612e32625b80a0ac97266e62795c51",
    "0x58cab2ad4338b2afe24dd26a6821a3b39c69f63a",
    "0xb427fccb4c3eaa47b092ec25b051c7d36cf7bfa0"
  ],
  "labels": []
}
```

(fulfillAvailableAdvancedOrders example)[https://etherscan.io/tx/0xc98866c545690aa593c09c00614dfc7875d64ffe9b4aac1e1750bf260de2431e]
```bash
```

(matchAdvancedOrders example)[https://etherscan.io/tx/0xf3963f4ce3c7207b0749ffd3539b7115b2176acd21eefca7e14e4cd1cd1f06d1]
```bash
1 findings for transaction 0xf3963f4ce3c7207b0749ffd3539b7115b2176acd21eefca7e14e4cd1cd1f06d1 {
  "name": "Seaport 1.1 ERC-1155 Transfer",
  "description": "Bad Seaport Orders Forta Detection",
  "alertId": "FORTA-1",
  "protocol": "ethereum",
  "severity": "Low",
  "type": "Info",
  "metadata": {
    "contractName": "VoxSoulsLunchboxes",
    "quantity": "4",
    "itemPrice": "0.0125",
    "collectionFloor": "0.064425",
    "fromAddr": "0xaDE97d752fe7D7f448143Ba464a5AaF4aF021C03",
    "toAddr": "0x9fC175Cc60E49FdE20b9Ed820eF9a2f866cdc36F",
    "tokenIds": "4",
    "market": "Opensea 🌊",
    "currency": "WETH",
    "totalPrice": "0.05",
    "hash": "0xf3963f4ce3c7207b0749ffd3539b7115b2176acd21eefca7e14e4cd1cd1f06d1",
    "contractAddress": "0xdffc286a5310d829783211035e47cdec12ddacca"
  },
  "addresses": [
    "0x9fc175cc60e49fde20b9ed820ef9a2f866cdc36f",
    "0xade97d752fe7d7f448143ba464a5aaf4af021c03",
    "0xdffc286a5310d829783211035e47cdec12ddacca",
    "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
  ],
  "labels": []
}
```
### Multiple NFTs Phishing Transfer Detection on a single tx

[3 Different Phishing NFTs Sale Detected](https://etherscan.io/tx/0x0f650996e73e4501a28333b79e18d487edd6f106c74e7d8f33a73ac807b4e8bb)

+ id 4564 FridayBeers for 0 ETH (floor is 0.012 ETH)
+ id 848 Hedz for 0 ETH (floor is 2.34 ETH)
+ id 19481 Rug Radio Faces of Web3 by Cory Van Lew for 0 ETH (floor is 0.0584 ETH)

```bash
3 findings for transaction 0x0f650996e73e4501a28333b79e18d487edd6f106c74e7d8f33a73ac807b4e8bb {
  "name": "Seaport 1.1 ERC-721 Phishing Transfer",
  "description": "Bad Seaport Orders Forta Detection",
  "alertId": "FORTA-1",
  "protocol": "ethereum",
  "severity": "Critical",
  "type": "Exploit",
  "metadata": {
    "contractName": "FridayBeers",
    "quantity": "1",
    "itemPrice": "0",
    "collectionFloor": "0.012",
    "fromAddr": "0xF3cAC0099121399D52fee93De68709D66D3d81f5",
    "toAddr": "0x945E5Da00FF55fedA8C4aD9B8CdA225d014E219a",
    "tokenIds": "4564",
    "market": "Opensea 🌊",
    "currency": "ETH",
    "totalPrice": "0",
    "hash": "0x0f650996e73e4501a28333b79e18d487edd6f106c74e7d8f33a73ac807b4e8bb",
    "contractAddress": "0x7a1e98c559ff6676ec2aae3a821fe6e601d8b75b"
  },
  "addresses": [
    "0x945e5da00ff55feda8c4ad9b8cda225d014e219a",
    "0xf3cac0099121399d52fee93de68709d66d3d81f5",
    "0x3426a32b445b9b5ccf9b44e246fefe244fe42c5b",
    "0x7a1e98c559ff6676ec2aae3a821fe6e601d8b75b",
    "0xefed2a58cc6a5b81f9158b231847f005cf086c01",
    "0xc28313a1080322cd4a23a89b71ba5632d1fc8962"
  ],
  "labels": [
    {
      "entityType": "Address",
      "entity": "0x945E5Da00FF55fedA8C4aD9B8CdA225d014E219a",
      "label": "attacker",
      "confidence": 0.9,
      "remove": false
    },
    {
      "entityType": "Address",
      "entity": "0xF3cAC0099121399D52fee93De68709D66D3d81f5",
      "label": "victim",
      "confidence": 0.9,
      "remove": false
    }
  ]
},{
  "name": "Seaport 1.1 ERC-721 Phishing Transfer",
  "description": "Bad Seaport Orders Forta Detection",
  "alertId": "FORTA-1",
  "protocol": "ethereum",
  "severity": "Critical",
  "type": "Exploit",
  "metadata": {
    "contractName": "Hedz",
    "quantity": "1",
    "itemPrice": "0",
    "collectionFloor": "2.34",
    "fromAddr": "0xF3cAC0099121399D52fee93De68709D66D3d81f5",
    "toAddr": "0x945E5Da00FF55fedA8C4aD9B8CdA225d014E219a",
    "tokenIds": "848",
    "market": "Opensea 🌊",
    "currency": "ETH",
    "totalPrice": "0",
    "hash": "0x0f650996e73e4501a28333b79e18d487edd6f106c74e7d8f33a73ac807b4e8bb",
    "contractAddress": "0xefed2a58cc6a5b81f9158b231847f005cf086c01"
  },
  "addresses": [
    "0x945e5da00ff55feda8c4ad9b8cda225d014e219a",
    "0xf3cac0099121399d52fee93de68709d66d3d81f5",
    "0x3426a32b445b9b5ccf9b44e246fefe244fe42c5b",
    "0x7a1e98c559ff6676ec2aae3a821fe6e601d8b75b",
    "0xefed2a58cc6a5b81f9158b231847f005cf086c01",
    "0xc28313a1080322cd4a23a89b71ba5632d1fc8962"
  ],
  "labels": [
    {
      "entityType": "Address",
      "entity": "0x945E5Da00FF55fedA8C4aD9B8CdA225d014E219a",
      "label": "attacker",
      "confidence": 0.9,
      "remove": false
    },
    {
      "entityType": "Address",
      "entity": "0xF3cAC0099121399D52fee93De68709D66D3d81f5",
      "label": "victim",
      "confidence": 0.9,
      "remove": false
    }
  ]
},{
  "name": "Seaport 1.1 ERC-721 Phishing Transfer",
  "description": "Bad Seaport Orders Forta Detection",
  "alertId": "FORTA-1",
  "protocol": "ethereum",
  "severity": "Critical",
  "type": "Exploit",
  "metadata": {
    "contractName": "Rug Radio Faces of Web3 by Cory Van Lew",
    "quantity": "1",
    "itemPrice": "0",
    "collectionFloor": "0.0584",
    "fromAddr": "0xF3cAC0099121399D52fee93De68709D66D3d81f5",
    "toAddr": "0x945E5Da00FF55fedA8C4aD9B8CdA225d014E219a",
    "tokenIds": "19481",
    "market": "Opensea 🌊",
    "currency": "ETH",
    "totalPrice": "0",
    "hash": "0x0f650996e73e4501a28333b79e18d487edd6f106c74e7d8f33a73ac807b4e8bb",
    "contractAddress": "0xc28313a1080322cd4a23a89b71ba5632d1fc8962"
  },
  "addresses": [
    "0x945e5da00ff55feda8c4ad9b8cda225d014e219a",
    "0xf3cac0099121399d52fee93de68709d66d3d81f5",
    "0x3426a32b445b9b5ccf9b44e246fefe244fe42c5b",
    "0x7a1e98c559ff6676ec2aae3a821fe6e601d8b75b",
    "0xefed2a58cc6a5b81f9158b231847f005cf086c01",
    "0xc28313a1080322cd4a23a89b71ba5632d1fc8962"
  ],
  "labels": [
    {
      "entityType": "Address",
      "entity": "0x945E5Da00FF55fedA8C4aD9B8CdA225d014E219a",
      "label": "attacker",
      "confidence": 0.9,
      "remove": false
    },
    {
      "entityType": "Address",
      "entity": "0xF3cAC0099121399D52fee93De68709D66D3d81f5",
      "label": "victim",
      "confidence": 0.9,
      "remove": false
    }
  ]
}
```
