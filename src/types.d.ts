export interface FormatNumberOptions {
  precision?: number
  decimals?: string
}

// type GenericObject = { [key: string]: any }

export interface KnownYieldSourceContract {
  yieldSourceName: string
  type?: string
  option?: object
}

// TODO: Type everything
// import { ethers } from "ethers";

// interface Pool {}

// interface PoolConfig {}

// interface PrizePool extends Contract {}

// interface PrizeStrategy extends Contract {}

// interface Erc20 extends Contract {
//   usd: number
//   derivedETH: string
//   totalValueUsd: string
//   totalValueUsdScaled: ethers.BigNumber
// }

// interface Erc721 extends Contract {}

// interface Contract {
//   address: string
// }
