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

16217012 [Attacker gets 5 MHC (6262,6696,8273,9791,9911) for 0.001 ETH](https://etherscan.io/tx/0x4fff109d9a6c030fce4de9426229a113524903f0babd6de11ee6c046d07226ff)

16219118 [Attacker sells 1 MHC (6262) for 0.579 ETH](https://etherscan.io/tx/0xdc6fd3c2846f330aec65615341789397e1a9bb37a471851fe68b2db20a5a7b9f)

16218884 [Attacker sells 1 MHC (6696) for 0.579 ETH](https://etherscan.io/tx/0xfbcb46427535e38d1634143f5ece0282f627e64a9c32977ded70e4a2222227a1)

16218914 [Attacker sells 1 MHC (8273) for 0.579 ETH](https://etherscan.io/tx/0x19c693157c14e180fecad15abaa9b1cd927d2abd25a0aa9d67876660351a7637)

16218814 [Attacker sells 1 MHC (9791) for 0.56 WETH](https://etherscan.io/tx/0x2062705b2f7294316a2bae5e119817ff3266a4587d22a4dc9ebb1ab558959551)

16219019 [Attacker sells 1 MHC (9911) for 0.57 ETH](https://etherscan.io/tx/0x70f5f57a09365442ece8b8de8ea2e1a82f327d85d782913621688736b3a260f0)

