import {
    BlockEvent,
    Finding,
    Initialize,
    HandleBlock,
    HandleTransaction,
    HandleAlert,
    AlertEvent,
    TransactionEvent,
    FindingSeverity,
    FindingType,
    EntityType
} from "forta-agent";

import type { ContractData, BatchContractInfo } from './types';

let Crit: Finding = {
    "name": "Seaport 1.1 ERC-721 Phishing Transfer",
    "description": "Bad Seaport Orders Forta Detection",
    "alertId": "FORTA-1",
    "protocol": "ethereum",
    "severity": FindingSeverity.Critical,
    "type": FindingType.Exploit,
    "metadata": {
        "contractName": "Mutant Hound Collars",
        "quantity": "5",
        "itemPrice": "0.0002",
        "collectionFloor": "0.58",
        "fromAddr": "0x08395C15C21DC3534B1C3b1D4FA5264E5Bd7020C",
        "toAddr": "0xBF96d79074b269F75c20BD9fa6DAed0773209EE7",
        "tokenIds": "6262,6696,8273,9791,9911",
        "market": "Opensea 🌊",
        "currency": "ETH",
        "totalPrice": "0.001",
        "hash": "0x4fff109d9a6c030fce4de9426229a113524903f0babd6de11ee6c046d07226ff",
        "contractAddress": "0xae99a698156ee8f8d07cbe7f271c31eeaac07087"
    },
    "addresses": [
        "0xaefc35de05da370f121998b0e2e95698841de9b1",
        "0xae99a698156ee8f8d07cbe7f271c31eeaac07087",
        "0xBF96d79074b269F75c20BD9fa6DAed0773209EE7",
        "0x08395C15C21DC3534B1C3b1D4FA5264E5Bd7020C"
    ],
    "labels": [
        {
            "entityType": EntityType.Address,
            "entity": "0xBF96d79074b269F75c20BD9fa6DAed0773209EE7",
            "label": "attacker",
            "confidence": 0.9,
            "remove": false
        },
        {
            "entityType": EntityType.Address,
            "entity": "0x08395C15C21DC3534B1C3b1D4FA5264E5Bd7020C",
            "label": "victim",
            "confidence": 0.9,
            "remove": false
        }
    ]
}

let info_0: Finding = {
    "name": "Seaport 1.1 ERC-721 Transfer",
    "description": "Bad Seaport Orders Forta Detection",
    "alertId": "FORTA-1",
    "protocol": "ethereum",
    "severity": FindingSeverity.Low,
    "type": FindingType.Info,
    "metadata": {
        "contractName": "Mutant Hound Collars",
        "quantity": "1",
        "itemPrice": "0.5790000000000001",
        "collectionFloor": "0.58",
        "fromAddr": "0xBF96d79074b269F75c20BD9fa6DAed0773209EE7",
        "toAddr": "0x679d5162BaD71990ABCA0f18095948c12a2756B0",
        "tokenIds": "6262",
        "market": "Opensea 🌊",
        "currency": "ETH",
        "totalPrice": "0.5790000000000001",
        "hash": "0xdc6fd3c2846f330aec65615341789397e1a9bb37a471851fe68b2db20a5a7b9f",
        "contractAddress": "0xae99a698156ee8f8d07cbe7f271c31eeaac07087"
    },
    "addresses": [
        "0x679d5162bad71990abca0f18095948c12a2756b0",
        "0xae99a698156ee8f8d07cbe7f271c31eeaac07087",
        "0x679d5162BaD71990ABCA0f18095948c12a2756B0",
        "0xBF96d79074b269F75c20BD9fa6DAed0773209EE7"
    ],
    "labels": []
}

let info_1: Finding = {
    "name": "Seaport 1.1 ERC-721 Transfer",
    "description": "Bad Seaport Orders Forta Detection",
    "alertId": "FORTA-1",
    "protocol": "ethereum",
    "severity": FindingSeverity.Low,
    "type": FindingType.Info,
    "metadata": {
        "contractName": "Mutant Hound Collars",
        "quantity": "1",
        "itemPrice": "0.5790000000000001",
        "collectionFloor": "0.58",
        "fromAddr": "0xBF96d79074b269F75c20BD9fa6DAed0773209EE7",
        "toAddr": "0x679d5162BaD71990ABCA0f18095948c12a2756B0",
        "tokenIds": "6696",
        "market": "Opensea 🌊",
        "currency": "ETH",
        "totalPrice": "0.5790000000000001",
        "hash": "0xdc6fd3c2846f330aec65615341789397e1a9bb37a471851fe68b2db20a5a7b9f",
        "contractAddress": "0xae99a698156ee8f8d07cbe7f271c31eeaac07087"
    },
    "addresses": [
        "0x679d5162bad71990abca0f18095948c12a2756b0",
        "0xae99a698156ee8f8d07cbe7f271c31eeaac07087",
        "0x679d5162BaD71990ABCA0f18095948c12a2756B0",
        "0xBF96d79074b269F75c20BD9fa6DAed0773209EE7"
    ],
    "labels": []
}

let info_2: Finding = {
    "name": "Seaport 1.1 ERC-721 Transfer",
    "description": "Bad Seaport Orders Forta Detection",
    "alertId": "FORTA-1",
    "protocol": "ethereum",
    "severity": FindingSeverity.Low,
    "type": FindingType.Info,
    "metadata": {
        "contractName": "Mutant Hound Collars",
        "quantity": "1",
        "itemPrice": "0.5790000000000001",
        "collectionFloor": "0.58",
        "fromAddr": "0xBF96d79074b269F75c20BD9fa6DAed0773209EE7",
        "toAddr": "0x679d5162BaD71990ABCA0f18095948c12a2756B0",
        "tokenIds": "8273",
        "market": "Opensea 🌊",
        "currency": "ETH",
        "totalPrice": "0.5790000000000001",
        "hash": "0xdc6fd3c2846f330aec65615341789397e1a9bb37a471851fe68b2db20a5a7b9f",
        "contractAddress": "0xae99a698156ee8f8d07cbe7f271c31eeaac07087"
    },
    "addresses": [
        "0x679d5162bad71990abca0f18095948c12a2756b0",
        "0xae99a698156ee8f8d07cbe7f271c31eeaac07087",
        "0x679d5162BaD71990ABCA0f18095948c12a2756B0",
        "0xBF96d79074b269F75c20BD9fa6DAed0773209EE7"
    ],
    "labels": []
}

let info_3: Finding = {
    "name": "Seaport 1.1 ERC-721 Transfer",
    "description": "Bad Seaport Orders Forta Detection",
    "alertId": "FORTA-1",
    "protocol": "ethereum",
    "severity": FindingSeverity.Low,
    "type": FindingType.Info,
    "metadata": {
        "contractName": "Mutant Hound Collars",
        "quantity": "1",
        "itemPrice": "0.5790000000000001",
        "collectionFloor": "0.58",
        "fromAddr": "0xBF96d79074b269F75c20BD9fa6DAed0773209EE7",
        "toAddr": "0x679d5162BaD71990ABCA0f18095948c12a2756B0",
        "tokenIds": "9791",
        "market": "Opensea 🌊",
        "currency": "ETH",
        "totalPrice": "0.5790000000000001",
        "hash": "0xdc6fd3c2846f330aec65615341789397e1a9bb37a471851fe68b2db20a5a7b9f",
        "contractAddress": "0xae99a698156ee8f8d07cbe7f271c31eeaac07087"
    },
    "addresses": [
        "0x679d5162bad71990abca0f18095948c12a2756b0",
        "0xae99a698156ee8f8d07cbe7f271c31eeaac07087",
        "0x679d5162BaD71990ABCA0f18095948c12a2756B0",
        "0xBF96d79074b269F75c20BD9fa6DAed0773209EE7"
    ],
    "labels": []
}

let info_4: Finding = {
    "name": "Seaport 1.1 ERC-721 Transfer",
    "description": "Bad Seaport Orders Forta Detection",
    "alertId": "FORTA-1",
    "protocol": "ethereum",
    "severity": FindingSeverity.Low,
    "type": FindingType.Info,
    "metadata": {
        "contractName": "Mutant Hound Collars",
        "quantity": "1",
        "itemPrice": "0.5790000000000001",
        "collectionFloor": "0.58",
        "fromAddr": "0xBF96d79074b269F75c20BD9fa6DAed0773209EE7",
        "toAddr": "0x679d5162BaD71990ABCA0f18095948c12a2756B0",
        "tokenIds": "9911",
        "market": "Opensea 🌊",
        "currency": "ETH",
        "totalPrice": "0.5790000000000001",
        "hash": "0xdc6fd3c2846f330aec65615341789397e1a9bb37a471851fe68b2db20a5a7b9f",
        "contractAddress": "0xae99a698156ee8f8d07cbe7f271c31eeaac07087"
    },
    "addresses": [
        "0x679d5162bad71990abca0f18095948c12a2756b0",
        "0xae99a698156ee8f8d07cbe7f271c31eeaac07087",
        "0x679d5162BaD71990ABCA0f18095948c12a2756B0",
        "0xBF96d79074b269F75c20BD9fa6DAed0773209EE7"
    ],
    "labels": []
}

const storage: Finding[] = [];
storage.push(Crit);

function test(find: any) {

    let newFinding: Finding;

    for (const finding of storage) {

        if (finding.metadata.contractAddress == find.metadata.contractAddress) {
            
            let findingTokenIds = finding.metadata.tokenIds.split(',');
            let findTokenIds = find.metadata.tokenIds.split(',');

            for (const tokenId of findingTokenIds) {
                if (findTokenIds.includes(tokenId)) {
                    let new_metadata = find.metadata;

                    new_metadata.attackHash = finding.metadata.hash;
                    new_metadata.buyPrice = finding.metadata.itemPrice;
                    new_metadata.profit = (parseFloat(find.metadata.totalPrice) - parseFloat(finding.metadata.itemPrice)).toString();

                    // remove the tokenId from the findingTokenIds array
                    findingTokenIds.splice(findTokenIds.indexOf(tokenId), 1);
                    finding.metadata.tokenIds = findingTokenIds.join(',');
                    if (finding.metadata.tokenIds === '') { 
                        storage.splice(storage.indexOf(finding), 1);
                    }

                    newFinding = Finding.fromObject({
                        name: "Seaport 1.1 ERC-721 Phishing Transfer",
                        description: `Bad Seaport Orders Forta Detection NFT Sold`,
                        alertId: "FORTA-1",
                        severity: FindingSeverity.Critical,
                        type: FindingType.Exploit,
                        metadata: new_metadata,
                        labels: [
                            finding.labels[0],
                            finding.labels[1],
                            {
                                entityType: EntityType.Address,
                                entity: find.metadata.toAddr!,
                                label: "buyer",
                                confidence: 0.9,
                                remove: false
                            }
                        ]
                    })

                } 
            }
            break;
        }

        
    }

    return newFinding!;
}

// for loop 5 times
let test_set = [info_0, info_1, info_2, info_3, info_4];
for (let i = 0; i < 5; i++) {
    console.log(test(test_set[i]));
}
console.log(storage);