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
} from "forta-agent";

import type { ContractData } from './types';
import { getContractData } from './utils/api.js';
import { transferIndexer } from './controllers/iso.js';
import { add } from "lodash";

export const SEAPORT_ADDRESS = '0x00000000006c3852cbef3e08e8df289169ede581';

// !MINE
let findingsCount = 0;
let nftContractsData: ContractData[] = [];

import { isContract } from './utils/api.js';




const handleTransaction: HandleTransaction = async (
  txEvent: TransactionEvent
) => {
  const findings: Finding[] = [];

  console.log(txEvent.addresses)
  
  // Only intersted on Seaport if not present return 0 findings.
  // Do not run Alchemy API calls on OpenSea Contract.
  if (!txEvent.addresses.hasOwnProperty(SEAPORT_ADDRESS)) { return findings } else { delete txEvent.addresses[SEAPORT_ADDRESS] }

  // limiting this agent to emit only 5 findings so that the alert feed is not spammed
  //if (findingsCount >= 5) return findings;

  // Retrieve information from other addresses included, goal is get the info of the ERC-721s
  for (const address in txEvent.addresses) {
    console.log(address, await isContract(address));
    const contractData: ContractData = await getContractData(address);
    if (contractData.tokenType === 'ERC721' || contractData.tokenType === 'ERC1155') nftContractsData.push(contractData)
  }

  // Run the transfer detection for all contracts
  let nftContract: ContractData;
  for (nftContract of nftContractsData) {
    console.log(`run indexer for ${nftContract.name} ${nftContract.address}`)
    let find: any = await transferIndexer(txEvent, nftContract);
    if (!find) return [];
    if (!find.name) throw new Error("Unexpected error: Missing Finding Object");

    find.addresses = txEvent.addresses
    find.addresses.hasOwnProperty(find.metadata.toAddr) ? find.addresses[find.metadata.toAddr] = true : '';
    find.addresses[find.metadata.fromAddr] = true;

    findings.push(find)
  }

  // ! OLD FROM HERE TO END FILE
  return findings;
};

// const initialize: Initialize = async () => {
//   // do some initialization on startup e.g. fetch data
// }

// const handleBlock: HandleBlock = async (blockEvent: BlockEvent) => {
//   const findings: Finding[] = [];
//   // detect some block condition
//   return findings;
// }

// const handleAlert: HandleAlert = async (alertEvent: AlertEvent) => {
//   const findings: Finding[] = [];
//   // detect some alert condition
//   return findings;
// }

export default {
  // initialize,
  handleTransaction,
  // handleBlock,
  // handleAlert
};
