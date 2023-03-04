import {
  Finding,
  HandleTransaction,
  TransactionEvent,
  FindingSeverity,
  FindingType,
  EntityType
} from "forta-agent";

import { utils } from 'ethers';
import type { BatchContractInfo } from './types';
import { getBatchContractData } from './utils/api.js';
import { transferIndexer } from './controllers/iso.js';

export const SEAPORT_ADDRESS = '0x00000000006c3852cbef3e08e8df289169ede581';

// !MINE
let findingsCount = 0;
let nftContractsData: BatchContractInfo[] = [];


export const storage: Finding[] = [];


export const findingSearch = (find: Finding) => {
  let newFinding: Finding;

  for (const finding of storage) {

    if (finding.metadata.contractAddress == find.metadata.contractAddress && finding.metadata.hash !== find.metadata.hash) {

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

          let alertId_ = utils.keccak256(utils.toUtf8Bytes(finding.metadata.hash + finding.metadata.contractAddress))

          newFinding = Finding.fromObject({
            name: "Seaport 1.1 NFT Phishing Attacker Sold NFT",
            description: `Attacker ${finding.labels[0].entity} sold ${finding.metadata.contractName} id: ${tokenId} stolen from ${finding.labels[1].entity} on ${finding.metadata.market} for a aprox profit of ${new_metadata.profit}`,
            alertId: alertId_,
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
    }


  }
  if (newFinding! === undefined) {
    return find;
  } else {
    return newFinding!;
  }

}

const handleTransaction: HandleTransaction = async (
  txEvent: TransactionEvent,
  testData?: BatchContractInfo[]
) => {
  const findings: Finding[] = [];

  //fs.writeFileSync('test.json', JSON.stringify(txEvent, null, 2));

  // Only intersted on Seaport if not present return 0 findings.
  // Do not run Alchemy API calls on OpenSea Contract.
  if (!txEvent.addresses.hasOwnProperty(SEAPORT_ADDRESS)) { return findings } else { delete txEvent.addresses[SEAPORT_ADDRESS] }
  // limiting this agent to emit only 5 findings so that the alert feed is not spammed
  //if (findingsCount >= 5) return findings;

  // Retrieve metadata from other addresses included, goal is get the info of the NFTs
  // API returns {} for EOA or UNKNOWN for contracts that are not ERC721 or ERC1155 standards.
  if (!testData){
    nftContractsData = await getBatchContractData(Object.keys(txEvent.addresses));
  } else {
    console.log("Test Data Loaded")
    nftContractsData = testData;
  }

  for (const info of nftContractsData) {

    if (Object.keys(info).length !== 0) {
      if (info.contractMetadata.tokenType === 'ERC721' || info.contractMetadata.tokenType === 'ERC1155') {
        console.log(`run indexer for ${info.contractMetadata.name} ${info.address}`)
        let find: any = await transferIndexer(txEvent, info);
        if (!find) return [];
        if (!Object.prototype.hasOwnProperty.call(find, 'name')) return [];

        // Add addresses to finding
        if (find.metadata.toAddr) find.addresses.push((find.metadata.toAddr).toLowerCase());
        if (find.metadata.fromAddr) find.addresses.push((find.metadata.fromAddr).toLowerCase());

        for (const [key, value] of Object.entries(txEvent.addresses)) {
          if (!find.addresses.includes(key)) find.addresses.push(key);
        }

        if (find.severity === FindingSeverity.Critical) {
          // add to storage only if not already present
          console.log("CRITICAL ALERT ADDED TO STORAGE", find.metadata.hash)
          storage.push(find);
        }

        findings.push(findingSearch(find))
      }
    }
  }
  //console.log('storage: ', storage)
  return findings;
};

export default {
  // initialize,
  handleTransaction,
  transferIndexer,
  storage
  // handleBlock,
  // handleAlert
};
