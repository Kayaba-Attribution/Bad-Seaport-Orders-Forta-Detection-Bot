const transferEventTypes = {
    ERC721: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', // Transfer
    ERC1155: [
        '0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62', // TransferSingle
        '0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb' // TransferBatch
    ]
};

const saleEventTypes = [
    '0x9d9af8e38d66c62e2c12f0225249fd9d721c54b83f48d9352c97c6cacdcb6f31' // OrderFulfilled (Seaport)
];

const cancelEventTypes = [
    '0x6bacc01dbe442496068f7d234edd811f1a5f833243e0aec824f86ab861f3c90d'  // OrderCancelled (Seaport)
];
export { transferEventTypes, saleEventTypes, cancelEventTypes };
