import { NETWORK } from './networks'

export const getGovernanceSubgraphUrl = (chainId: number, apiKey: string) => {
  if (chainId === NETWORK.mainnet) {
    return `https://gateway.thegraph.com/api/${apiKey}/subgraphs/id/0xa57d294c3a11fb542d524062ae4c5100e0e373ec-0`
  } else {
    return 'https://api.thegraph.com/subgraphs/name/pooltogether/pooltogether-rinkeby-governance'
  }
}

export const GOVERNANCE_CONTRACT_ADDRESSES = {
  [NETWORK.mainnet]: {
    GovernorAlpha: '0xB3a87172F555ae2a2AB79Be60B336D2F7D0187f0',
    GovernanceToken: '0x0cEC1A9154Ff802e7934Fc916Ed7Ca50bDE6844e',
    GovernanceReserve: '0xdb8E47BEFe4646fCc62BE61EEE5DF350404c124F',
    MerkleDistributor: '0xBE1a33519F586A4c8AA37525163Df8d67997016f'
  },
  [NETWORK.rinkeby]: {
    GovernorAlpha: '0x9B63243CD27102fbEc9FAf67CA1a858dcC16Ee01',
    GovernanceToken: '0xc4E90a8Dc6CaAb329f08ED3C8abc6b197Cf0F40A',
    GovernanceReserve: '0xA5224da01a5A792946E4270a02457EB75412c84c',
    MerkleDistributor: '0x93a6540DcE05a4A5E5B906eB97bBCBb723768F2D'
  },
  [NETWORK.polygon]: {
    GovernanceToken: '0x25788a1a171ec66Da6502f9975a15B609fF54CF6'
  }
}

export const POOL_ADDRESSES = Object.freeze({
  [NETWORK.mainnet]: {
    pool: '0x0cEC1A9154Ff802e7934Fc916Ed7Ca50bDE6844e',
    ppool: '0x27d22a7648e955e510a40bdb058333e9190d12d4'
  },
  [NETWORK.rinkeby]: {
    pool: '0xc4E90a8Dc6CaAb329f08ED3C8abc6b197Cf0F40A'
  },
  [NETWORK.polygon]: {
    polygon_bridge: '0x25788a1a171ec66Da6502f9975a15B609fF54CF6',
    ppool: '0xd80eaa761ccfdc8698999d73c96cec39fbb1fc48'
  },
  [NETWORK.optimism]: {
    pool: '0x395ae52bb17aef68c2888d941736a71dc6d4e125'
  }
})
