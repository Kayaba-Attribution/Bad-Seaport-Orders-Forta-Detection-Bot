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

export const SEAPORT_ADDRESS = '0x00000000006c3852cbef3e08e8df289169ede581';

// !MINE
let findingsCount = 0;
let nftContractsData: ContractData[] = [];



const handleTransaction: HandleTransaction = async (
  txEvent: TransactionEvent
) => {
  //console.log(txEvent.addresses)
  const findings: Finding[] = [];
  if(!txEvent.addresses.hasOwnProperty(SEAPORT_ADDRESS)) return findings;
  // Only intersted on Seaport

  // limiting this agent to emit only 5 findings so that the alert feed is not spammed
  if (findingsCount >= 5) return findings;

  // Retrieve information from other addresses included, goal is get the info of the ERC-721s
  for (const address in txEvent.addresses) {
    const contractData: ContractData = await getContractData(address);
    if (contractData.tokenType === 'ERC721') nftContractsData.push(contractData)
  }

  // Run the transfer detection for all contracts
  let nftContract: ContractData;
  for (nftContract of nftContractsData) {
    let find: any = await transferIndexer(txEvent.transaction.hash, nftContract);
    if (!find.name) throw new Error("Unexpected error: Missing Finding Object");

    find.addresses = txEvent.addresses
    find.addresses.hasOwnProperty(find.metadata.toAddr) ? find.addresses[find.metadata.toAddr] = true : '';
    find.addresses[find.metadata.fromAddr] = true;

    findings.push(find)
  }

  console.log("EMD")
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
