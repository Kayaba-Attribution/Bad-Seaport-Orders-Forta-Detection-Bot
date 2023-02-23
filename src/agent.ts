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

import type { ContractData, BatchContractInfo } from './types';
import { getContractData } from './utils/api.js';
import { transferIndexer } from './controllers/iso.js';
import { add } from "lodash";

export const SEAPORT_ADDRESS = '0x00000000006c3852cbef3e08e8df289169ede581';

// !MINE
let findingsCount = 0;
let nftContractsData: BatchContractInfo[] = [];

import { isContract, getBatchContractData, getEthUsdPrice } from './utils/api.js';





const handleTransaction: HandleTransaction = async (
  txEvent: TransactionEvent
) => {
  const findings: Finding[] = [];


  // Only intersted on Seaport if not present return 0 findings.
  // Do not run Alchemy API calls on OpenSea Contract.
  if (!txEvent.addresses.hasOwnProperty(SEAPORT_ADDRESS)) { return findings } else { delete txEvent.addresses[SEAPORT_ADDRESS] }
  console.log(txEvent.addresses)

  // limiting this agent to emit only 5 findings so that the alert feed is not spammed
  //if (findingsCount >= 5) return findings;

  // Retrieve information from other addresses included, goal is get the info of the ERC-721s
  nftContractsData = await getBatchContractData(Object.keys(txEvent.addresses));
  //console.log(nftContractsData)
  //console.log("getBatchContractData for:", info);
  //console.log("getBatchContractData for:", await getEthUsdPrice(10));
  for (const info of nftContractsData) {

    if (Object.keys(info).length !== 0) {
      if (info.contractMetadata.tokenType === 'ERC721' || info.contractMetadata.tokenType === 'ERC1155') {
        console.log(info)
      }
    }
  }

  return findings;

  // Run the transfer detection for all contracts
  let nftContract: ContractData;
  // for (nftContract of nftContractsData) {
  //   console.log(`run indexer for ${nftContract.name} ${nftContract.address}`)
  //   let find: any = await transferIndexer(txEvent, nftContract);
  //   if (!find) return [];
  //   if (!find.name) throw new Error("Unexpected error: Missing Finding Object");

  //   find.addresses = txEvent.addresses
  //   find.addresses.hasOwnProperty(find.metadata.toAddr) ? find.addresses[find.metadata.toAddr] = true : '';
  //   find.addresses[find.metadata.fromAddr] = true;

  //   findings.push(find)
  // }

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
