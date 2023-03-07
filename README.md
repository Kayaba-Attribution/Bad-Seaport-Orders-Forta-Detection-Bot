# Seaport Orders Forta Detection Bot 

[Bot Forta Page](https://explorer.forta.network/bot/0xd9584a587a469f3cdd8a03ffccb14114bc78485657e28739b8036aee7782df5c)

## Description

This agent detects all ERC-721 & ERC-1155 orders on Opensea Seaport 1.1. The primary aim of this agent is to identify, label, and compare orders on Opensea Seaport 1.1 to detect potential phishing scams. These scams involve users losing their NFTs for minimal amounts, sometimes even zero, and the attacker subsequently selling them at or near the collection floor price for profit.

#### Supported Chains

- Ethereum

### Details

- Utilizes the Alchemy API to fetch the NFT's floor price. If a sale occurs where the item price is less than 1% of the collection floor price, a critical alert is triggered.

- Tracks all orders on Seaport 1.1, and regular transactions generate an informational alert.

- The filter and storage system included in this agent allows for the saving of critical alerts. Any new alerts are compared against the stored ones to detect when scammers sell stolen NFTs. When a tokenId match is found, another critical alert is emitted, and the previous alert is modified accordingly. This feature enhances the agent's ability to track and report on potential phishing scams.

- Critical alerts contain labels for the attacker, victim, and nftIds + nftContract.

- Custom functions were developed to simulate API calls and Seaport orders for testing purposes.

- Provides rich descriptions for alerts to assist viewers.

- Designed with modularity in mind, allowing new exchanges to be added in the future.

### All Alerts Metadata

+ contractName 
+ quantity
+ itemPrice
+ collectionFloor
+ fromAddr
+ toAddr
+ tokenIds
+ market
+ currency
+ totalPrice
+ hash




## Alerts

- Seaport 1.1 (ERC711 OR ERC1155) Phishing Transfer
  - Fired when the itemPrice for the tokens is lower than 1% of the collection floor price
  - Severity is always set to "critical"
  - Type is always set to "exploit"
    > Regular orders for low values between normal users could be wrongly tagged
  - Attacker and Victim addresses are inlcuded in the labels
  - All NFTs Ids along the NFT contract are included in the labels
  - Follows the following description:
  > *{quantity} {contractName || tokenName} id/s: {tokenIds} sold on {market} for {totalPrice} {currency name} with a floor price of {tx.floor} {currency name}`*

  - Example: 
  
    > **5 Mutant Hound Collars id/s: 6262,6696,8273,9791,9911 sold on Opensea 🌊 for 0.001 ETH with a floor price of 0.58 ETH**

- Seaport 1.1 NFT Phishing Attacker Sold NFT
  - Fired when a previously marked as stolen NFT is sold.
  - Severity is always set to "critical"
  - Type is always set to "exploit"
  - Attacker, Victim, Buyer addresses are inlcuded in the labels
  - Sold NFT id is also included in the labels
  - An alert is emited by each NFT as attackers often make multiple txns to sell the NFTs
  - The alert in storage is modified if a NFT id is sold
  - Aprox profit is calculated using the item price and the sell price
  - Follows the following description:
  > *Attacker {label attacker} sold {contractName} id: {tokenId} stolen from {victim} on {market} for a aprox profit of {profit}*

  - Example: 
  
    > **Attacker 0xbca...6fa sold Mutant Hound Collars id: 6262 stolen from 0x702...674 on Opensea 🌊 for a aprox profit of 0.5598 ETH**

- Seaport 1.1 (ERC711 OR ERC1155) Transfer
  - Fired on all orders related to SeaPort
  - Does not contain extra information on labels or description

## Test Data

The agent behaviour can be verified with the following Attack Analysis:


### Attack Analysis:

5 Mutant Hound Collars id/s: 6262,6696,8273,9791,9911 sold on Opensea 🌊 for 0.001 ETH with a floor price of 0.58 ETH

Blocks Span: 16217012..16219118
Smallest Test: 16217012..16218814

16217012 [Attacker gets 5 MHC (6262,6696,8273,9791,9911) for 0.001 ETH](https://etherscan.io/tx/0x4fff109d9a6c030fce4de9426229a113524903f0babd6de11ee6c046d07226ff)

16219118 [Attacker sells 1 MHC (6262) for 0.579 ETH](https://etherscan.io/tx/0xdc6fd3c2846f330aec65615341789397e1a9bb37a471851fe68b2db20a5a7b9f)

16218884 [Attacker sells 1 MHC (6696) for 0.579 ETH](https://etherscan.io/tx/0xfbcb46427535e38d1634143f5ece0282f627e64a9c32977ded70e4a2222227a1)

16218914 [Attacker sells 1 MHC (8273) for 0.579 ETH](https://etherscan.io/tx/0x19c693157c14e180fecad15abaa9b1cd927d2abd25a0aa9d67876660351a7637)

16218814 [Attacker sells 1 MHC (9791) for 0.56 WETH](https://etherscan.io/tx/0x2062705b2f7294316a2bae5e119817ff3266a4587d22a4dc9ebb1ab558959551)

16219019 [Attacker sells 1 MHC (9911) for 0.57 ETH](https://etherscan.io/tx/0x70f5f57a09365442ece8b8de8ea2e1a82f327d85d782913621688736b3a260f0)

[Example in etherscan of Mutant Hound Collars 6262 owner Change](https://etherscan.io/nft/0xae99a698156ee8f8d07cbe7f271c31eeaac07087/6262)

### Where the alerts are as follows:

#### Bot detects sale of tokens for <1% of collection floor

```bash
1 findings for transaction 0x4fff109d9a6c030fce4de9426229a113524903f0babd6de11ee6c046d07226ff {
  "name": "Seaport 1.1 ERC721 Phishing Transfer",
  "description": "5 Mutant Hound Collars id/s: 6262,6696,8273,9791,9911 sold on Opensea 🌊 for 0.001 ETH with a floor price of 0.58 ETH",
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
      "entity": "0xbf96d79074b269f75c20bd9fa6daed0773209ee7",
      "label": "attacker",
      "confidence": 0.9,
      "remove": false
    },
    {
      "entityType": "Address",
      "entity": "0x08395c15c21dc3534b1c3b1d4fa5264e5bd7020c",
      "label": "victim",
      "confidence": 0.9,
      "remove": false
    },
    {
      "entityType": "Address",
      "entity": "6262,0xae99a698156ee8f8d07cbe7f271c31eeaac07087",
      "label": "stolen",
      "confidence": 0.9,
      "remove": false
    },
    {
      "entityType": "Address",
      "entity": "6696,0xae99a698156ee8f8d07cbe7f271c31eeaac07087",
      "label": "stolen",
      "confidence": 0.9,
      "remove": false
    },
    {
      "entityType": "Address",
      "entity": "8273,0xae99a698156ee8f8d07cbe7f271c31eeaac07087",
      "label": "stolen",
      "confidence": 0.9,
      "remove": false
    },
    {
      "entityType": "Address",
      "entity": "9791,0xae99a698156ee8f8d07cbe7f271c31eeaac07087",
      "label": "stolen",
      "confidence": 0.9,
      "remove": false
    },
    {
      "entityType": "Address",
      "entity": "9911,0xae99a698156ee8f8d07cbe7f271c31eeaac07087",
      "label": "stolen",
      "confidence": 0.9,
      "remove": false
    }
  ]
}
```

#### Bot detects id 6262 that matches the information on the critical alert is sold
<sub> ***taken from tests as the span of blocks is too large to test***</sub>
```bash
Finding {
        name: 'Seaport 1.1 NFT Phishing Attacker Sold NFT',
        description: 'Attacker 0x3abfa81962db1a9b4dbaa1a82212ba4f3792e8f6 sold Mutant Hound Collars id: 6262 stolen from 0x61bdae6b842032db6244a208e4d8ac0eff5d07d1 on Opensea 🌊 for a aprox profit of 0.5598000000000001',
        alertId: '0x98ea8288a0fd7b303cd63d45401e2b65ab9727c264b870a2dbbac2ea7a93afb2',
        protocol: 'ethereum',
        severity: 5,
        type: 1,
        metadata: {
          contractName: 'Mutant Hound Collars',
          quantity: '1',
          itemPrice: '0.56',
          collectionFloor: '0.58',
          fromAddr: '0x3abfa81962db1a9b4dbaa1a82212ba4f3792e8f6',
          toAddr: '0xfecaf6820fca048be693ea2ef3ab926fd3e0cbe0',
          tokenIds: '6262',
          market: 'Opensea 🌊',
          currency: 'ETH',
          totalPrice: '0.56',
          hash: '0x002',
          contractAddress: '0x096db5f3f7fc3ee31f98cf0f28ae463cb6a2ff65',
          attackHash: '0x001',
          buyPrice: '0.0002',
          profit: '0.5598000000000001'
        },
        addresses: [],
        labels: [ [Label], [Label], [Label], [Label] ]
      }
```

### Multiple NFTs Phishing Transfer Detection on a single tx

[3 Different Phishing NFTs Sale Detected](https://etherscan.io/tx/0x0f650996e73e4501a28333b79e18d487edd6f106c74e7d8f33a73ac807b4e8bb)

- id 4564 FridayBeers for 0 ETH (floor is 0.012 ETH)
- id 848 Hedz for 0 ETH (floor is 2.34 ETH)
- id 19481 Rug Radio Faces of Web3 by Cory Van Lew for 0 ETH (floor is 0.0584 ETH)

```bash
3 findings for transaction 0x0f650996e73e4501a28333b79e18d487edd6f106c74e7d8f33a73ac807b4e8bb {
  "name": "Seaport 1.1 ERC721 Phishing Transfer",
  "description": "1 FridayBeers id/s: 4564 sold on Opensea 🌊 for 0 ETH with a floor price of 0.012 ETH",
  "alertId": "0x5d04e5ed9eaab4f24bb00db0704af1527ac0de5148afca3346090c352806f8d9",
  "protocol": "ethereum",
  "severity": "Critical",
  "type": "Exploit",
  "metadata": {
    "contractName": "FridayBeers",
    "quantity": "1",
    "itemPrice": "0",
    "collectionFloor": "0.012",
    "fromAddr": "0xf3cac0099121399d52fee93de68709d66d3d81f5",
    "toAddr": "0x945e5da00ff55feda8c4ad9b8cda225d014e219a",
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
      "entity": "0x945e5da00ff55feda8c4ad9b8cda225d014e219a",
      "label": "attacker",
      "confidence": 0.9,
      "remove": false
    },
    {
      "entityType": "Address",
      "entity": "0xf3cac0099121399d52fee93de68709d66d3d81f5",
      "label": "victim",
      "confidence": 0.9,
      "remove": false
    },
    {
      "entityType": "Address",
      "entity": "4564,0x7a1e98c559ff6676ec2aae3a821fe6e601d8b75b",
      "label": "stolen",
      "confidence": 0.9,
      "remove": false
    }
  ]
},{
  "name": "Seaport 1.1 ERC721 Phishing Transfer",
  "description": "1 Hedz id/s: 848 sold on Opensea 🌊 for 0 ETH with a floor price of 2.34 ETH",
  "alertId": "0x2cab63af1cb844173b1835e48d962a04e5a64d8bc684cdc88606d7b4a36c91f7",
  "protocol": "ethereum",
  "severity": "Critical",
  "type": "Exploit",
  "metadata": {
    "contractName": "Hedz",
    "quantity": "1",
    "itemPrice": "0",
    "collectionFloor": "2.34",
    "fromAddr": "0xf3cac0099121399d52fee93de68709d66d3d81f5",
    "toAddr": "0x945e5da00ff55feda8c4ad9b8cda225d014e219a",
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
      "entity": "0x945e5da00ff55feda8c4ad9b8cda225d014e219a",
      "label": "attacker",
      "confidence": 0.9,
      "remove": false
    },
    {
      "entityType": "Address",
      "entity": "0xf3cac0099121399d52fee93de68709d66d3d81f5",
      "label": "victim",
      "confidence": 0.9,
      "remove": false
    },
    {
      "entityType": "Address",
      "entity": "848,0xefed2a58cc6a5b81f9158b231847f005cf086c01",
      "label": "stolen",
      "confidence": 0.9,
      "remove": false
    }
  ]
},{
  "name": "Seaport 1.1 ERC721 Phishing Transfer",
  "description": "1 Rug Radio Faces of Web3 by Cory Van Lew id/s: 19481 sold on Opensea 🌊 for 0 ETH with a floor price of 0.0584 ETH",
  "alertId": "0x66fa834fde1d36a40305e719e2ab864535f19def01be9ff527506d9203b7f746",
  "protocol": "ethereum",
  "severity": "Critical",
  "type": "Exploit",
  "metadata": {
    "contractName": "Rug Radio Faces of Web3 by Cory Van Lew",
    "quantity": "1",
    "itemPrice": "0",
    "collectionFloor": "0.0584",
    "fromAddr": "0xf3cac0099121399d52fee93de68709d66d3d81f5",
    "toAddr": "0x945e5da00ff55feda8c4ad9b8cda225d014e219a",
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
      "entity": "0x945e5da00ff55feda8c4ad9b8cda225d014e219a",
      "label": "attacker",
      "confidence": 0.9,
      "remove": false
    },
    {
      "entityType": "Address",
      "entity": "0xf3cac0099121399d52fee93de68709d66d3d81f5",
      "label": "victim",
      "confidence": 0.9,
      "remove": false
    },
    {
      "entityType": "Address",
      "entity": "19481,0xc28313a1080322cd4a23a89b71ba5632d1fc8962",
      "label": "stolen",
      "confidence": 0.9,
      "remove": false
    }
  ]
}
```

### Regular SeaPort NFTs Orders Examples

[fulfillBasicOrder example](https://etherscan.io/tx/0x52d8e0c43d0b6a7a62ee8bf2c57afd7ad7ccc931d41f35b4844d7720a8675d75)

```bash
1 findings for transaction 0x52d8e0c43d0b6a7a62ee8bf2c57afd7ad7ccc931d41f35b4844d7720a8675d75 {
  "name": "Seaport 1.1 ERC721 Transfer",
  "description": "Regular NFT Transfer",
  "alertId": "0x278c49ab3e66bc6b4416d5aecc316af27de7a4ee21f6c7d5cd67bfe3251ce514",
  "protocol": "ethereum",
  "severity": "Low",
  "type": "Info",
  "metadata": {
    "contractName": "MEMEASF Master Pass",
    "quantity": "1",
    "itemPrice": "1.2690000000000001",
    "collectionFloor": "1.3",
    "fromAddr": "0xdbf511df11612e32625b80a0ac97266e62795c51",
    "toAddr": "0x271c6f480aeb26672b915a7b33159ce8f1e97fd3",
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

[fulfillAvailableAdvancedOrders example](https://etherscan.io/tx/0x8aaa46e39e3a071a6db95b00e59a146b48250a18c249c2ade0a408860e667c00)

```bash
1 findings for transaction 0x8aaa46e39e3a071a6db95b00e59a146b48250a18c249c2ade0a408860e667c00 {
  "name": "Seaport 1.1 ERC721 Transfer",
  "description": "Regular NFT Transfer",
  "alertId": "0xd48c54072ae0b4649546015276322e263c7abc07f8b125679dc54650f8b04a84",
  "protocol": "ethereum",
  "severity": "Low",
  "type": "Info",
  "metadata": {
    "contractName": "Base, Introduced",
    "quantity": "3",
    "itemPrice": "0.00278",
    "collectionFloor": "0",
    "fromAddr": "0x89ce8a6fa1d9d95ef1d8123c02c8e7c3e8d38125",
    "toAddr": "0x3810e63abdf61cc83f676000118a877ec1ba58d0",
    "tokenIds": "216105,166849,166852",
    "market": "Opensea 🌊",
    "currency": "ETH",
    "totalPrice": "0.00834",
    "hash": "0x8aaa46e39e3a071a6db95b00e59a146b48250a18c249c2ade0a408860e667c00",
    "contractAddress": "0xd4307e0acd12cf46fd6cf93bc264f5d5d1598792"
  },
  "addresses": [
    "0x3810e63abdf61cc83f676000118a877ec1ba58d0",
    "0x89ce8a6fa1d9d95ef1d8123c02c8e7c3e8d38125",
    "0xd4307e0acd12cf46fd6cf93bc264f5d5d1598792"
  ],
  "labels": []
}
```

[matchAdvancedOrders example](https://etherscan.io/tx/0xf3963f4ce3c7207b0749ffd3539b7115b2176acd21eefca7e14e4cd1cd1f06d1)

```bash
1 findings for transaction 0xf3963f4ce3c7207b0749ffd3539b7115b2176acd21eefca7e14e4cd1cd1f06d1 {
  "name": "Seaport 1.1 ERC1155 Transfer",
  "description": "Regular NFT Transfer",
  "alertId": "0xebf304cd677ff7e99134b7bee57b7fdcf631943448e10a4a1a23d3acb0c1f683",
  "protocol": "ethereum",
  "severity": "Low",
  "type": "Info",
  "metadata": {
    "contractName": "VoxSoulsLunchboxes",
    "quantity": "1",
    "itemPrice": "0.05",
    "collectionFloor": "0.064425",
    "fromAddr": "0xade97d752fe7d7f448143ba464a5aaf4af021c03",
    "toAddr": "0x9fc175cc60e49fde20b9ed820ef9a2f866cdc36f",
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

## 0 Value Transfer Test Data

- 0x0e70d96ca35e9f102fba78fbcaf60b49c8e4229e3e675ce498485054f2d3b4cf
> 12 Hound Yacht Club id/s: 4560,4514,4356,4336,4109,3825,3814,3750,3739,3527,2616,2561 sold on Opensea 🌊 for 0 ETH with a floor price of 0.001 ETH
> 10 Donald Trump Yacht Club id/s: 8530,8422,8304,6845,5278,4849,2835,2622,1493,650 sold on Opensea 🌊 for 0 ETH with a floor price of 0.0072 ETH
- 0xc57a28a4bd32996005bff6337b6143a17559b7f02d5f68718689a29e01961f53
> 6 100 Meals id/s: 12848,12845,12847,9315,9316,9317 sold on Opensea 🌊 for 0 ETH with a floor price of 0.003 ETH

Hello All! 

I deployed the bot a few days ago and it was working, but then I wanted to make some changes to the code. After I ran npm run publish again the agent was successfully updated but no incoming txs from the node operators were reaching it.

I tried to disable and enable the agent but still no txns or alerts are being fired.

Also on the UI it seems like the bot is disabled but the output of npm run info for me is:

name: seaport-orders-forta-detection-bot
agentId: 0xd9584a587a469f3cdd8a03ffccb14114bc78485657e28739b8036aee7782df5c
status: Enabled
version: 1.0.1

The first version of the bot was using obfuscating for the source code, but the new version is using the normal code in case that the obfuscating step was triggering any errors.

Any ideas on how to get incoming transactions, or what may be stopping the bot from working correctly?