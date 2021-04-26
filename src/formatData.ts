import { ethers } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import cloneDeep from 'lodash.clonedeep'
import { toScaledUsdBigNumber } from './formatNumber'
import { amountMultByUsd } from './math'
import { bn } from './_utils'
import {
  contractAddresses,
  tokenBlockList,
  PRIZE_POOL_TYPES
} from '@pooltogether/current-pool-data'

/**
 * Recursively looks through an object, converting all big numbers into actual BigNumbers
 * @param {any} data json blob
 * @returns
 */
export const deserializeBigNumbers = (data: any) => {
  try {
    if (Array.isArray(data)) {
      data.forEach(deserializeBigNumbers)
    } else if (typeof data === 'object' && data !== null) {
      Object.keys(data).forEach((key) => {
        if (Array.isArray(data[key])) {
          data[key].forEach(deserializeBigNumbers)
        } else if (typeof data[key] === 'object' && data[key] !== null) {
          if (data[key]?.type === 'BigNumber') {
            data[key] = ethers.BigNumber.from(data[key])
          } else {
            deserializeBigNumbers(data[key])
          }
        }
      })
    }
    return data
  } catch (e) {
    return data
  }
}

/**
 * Formats the data returned from the graph for a lootBox
 * @param {*} lootBoxGraphData
 * @returns
 */
export const formatLootBox = (lootBoxGraphData) => ({
  erc1155Tokens: lootBoxGraphData.erc1155Balances,
  erc721Tokens: lootBoxGraphData.erc721Tokens,
  erc20Tokens: lootBoxGraphData.erc20Balances
    .filter((erc20) => !tokenBlockList.includes(erc20.id))
    .map((erc20) => ({
      ...erc20.erc20Entity,
      address: erc20.erc20Entity.id,
      lootBoxAddress: erc20.erc20Entity.id,
      amountUnformatted: bn(erc20.balance),
      amount: formatUnits(erc20.balance, erc20.erc20Entity.decimals)
    }))
})

/**
 * Gets all erc20 addresses related to a pool
 * @param {*} pools
 * @returns Array of addresses
 */
export const getAllErc20AddressesFromPool = (pool) => {
  const addresses = new Set<string>()
  // Get external erc20s
  pool.prize.externalErc20Awards.forEach((erc20: { address: string }) =>
    addresses.add(erc20.address)
  )
  // Get lootbox erc20s
  pool.prize.lootBox?.erc20Tokens.forEach((erc20: { address: string }) =>
    addresses.add(erc20.address)
  )
  // Get known tokens
  Object.values(pool.tokens).forEach((erc20: { address: string }) => addresses.add(erc20.address))
  return addresses
}

/**
 * Gets all erc20 addresses related to several pools
 * @param {*} pools
 * @returns Array of addresses
 */
export const getAllErc20AddressesFromPools = (pools) => {
  let allAddresses = new Set<string>()
  pools.forEach((pool) => {
    const poolAddresses = getAllErc20AddressesFromPool(pool)
    allAddresses = new Set([...allAddresses, ...poolAddresses])
  })
  return [...allAddresses]
}

/**
 * Mutates a token adding token USD value if we have the USD price per token
 * @param {*} token
 */
export const addTokenTotalUsdValue = (token, tokenPriceData) => {
  const priceData = tokenPriceData[token.address]
  if (priceData) {
    token.usd = tokenPriceData[token.address].usd || 0
    token.derivedETH = tokenPriceData[token.address].derivedETH || '0'
    if (token.amountUnformatted) {
      const usdValueUnformatted = amountMultByUsd(token.amountUnformatted, token.usd)
      token.totalValueUsd = formatUnits(usdValueUnformatted, token.decimals)
      token.totalValueUsdScaled = toScaledUsdBigNumber(token.totalValueUsd)
    }
  } else {
    token.usd = 0
    token.derivedETH = '0'
  }
}

/**
 *
 * @param {*} pool
 * @param {*} lootBoxData
 * @returns
 */
export const combineLootBoxDataWithPool = (pool, lootBoxData) => {
  if (lootBoxData.lootBoxes?.length > 0) {
    if (!pool.prize.lootBox) return
    const lootBoxGraphData = lootBoxData.lootBoxes.find(
      (lootBox) => lootBox.tokenId === pool.prize.lootBox.id
    )
    if (!lootBoxGraphData) return
    const formattedLootBox = formatLootBox(lootBoxGraphData)
    pool.prize.lootBox = {
      ...pool.prize.lootBox,
      ...formattedLootBox
    }
  }
}

/**
 * Adds token price data to pools
 * @param {*} _pools
 * @param {*} tokenPriceData
 */
export const combineTokenPricesData = (_pools, tokenPriceData) => {
  const pools = cloneDeep(_pools)

  pools.forEach((pool) => {
    // Add to all known tokens
    Object.values(pool.tokens).forEach((token) => addTokenTotalUsdValue(token, tokenPriceData))
    // Add to all external erc20 tokens
    Object.values(pool.prize.externalErc20Awards).forEach((token) =>
      addTokenTotalUsdValue(token, tokenPriceData)
    )
    // Add to all lootBox tokens
    pool.prize.lootBox?.erc20Tokens.forEach((token) => addTokenTotalUsdValue(token, tokenPriceData))
    // Add total values for controlled tokens
    const underlyingToken = pool.tokens.underlyingToken
    addTotalValueForControlledTokens(pool.tokens.ticket, underlyingToken)
    addTotalValueForControlledTokens(pool.tokens.sponsorship, underlyingToken)
    // Add total values for reserves
    addTotalValueForReserve(pool)
  })

  return pools
}

/**
 * Format controlled tokens to look like all other tokens
 * Calculates total usd values
 * @param {*} token
 * @param {*} underlyingToken
 */
const addTotalValueForControlledTokens = (token, underlyingToken) => {
  if (token.totalSupplyUnformatted) {
    const totalValueUsdUnformatted = amountMultByUsd(
      token.totalSupplyUnformatted,
      underlyingToken.usd
    )
    token.usd = underlyingToken.usd
    token.derivedETH = underlyingToken.derivedETH
    token.totalValueUsd = formatUnits(totalValueUsdUnformatted, token.decimals)
    token.totalValueUsdScaled = toScaledUsdBigNumber(token.totalValueUsd)
  }
}

/**
 * Mutates and calculates the total value for the reserve
 * @param {*} pool
 */
const addTotalValueForReserve = (pool) => {
  const underlyingToken = pool.tokens.underlyingToken
  const amountUnformatted = pool.reserve.amountUnformatted
  if (amountUnformatted) {
    const totalValueUsdUnformatted = amountMultByUsd(amountUnformatted, underlyingToken.usd)
    pool.reserve.totalValueUsd = formatUnits(totalValueUsdUnformatted, underlyingToken.decimals)
    pool.reserve.totalValueUsdScaled = toScaledUsdBigNumber(pool.reserve.totalValueUsd)
  }
}

/**
 * Standardizes calculated total values
 * @param {*} amountUnformatted Ex. 1000000000000000000
 * @param {*} usdValue Ex. 1.23
 * @param {*} decimals Ex. 6
 */
export const calculateTokenValues = (amountUnformatted, usdValue, decimals) => {
  const amount = formatUnits(amountUnformatted, decimals)
  const totalValueUsdUnformatted = amountMultByUsd(amountUnformatted, usdValue)
  const totalValueUsd = formatUnits(totalValueUsdUnformatted, decimals)
  const totalValueUsdScaled = toScaledUsdBigNumber(totalValueUsd)
  return {
    amount,
    amountUnformatted,
    totalValueUsd,
    totalValueUsdScaled,
    totalValueUsdUnformatted
  }
}

/**
 * Formats prize pool data from The Graph
 * @param {*} prizePool
 * @param {*} chainId
 * @returns
 */
export const formatPoolGraphData = (prizePool, chainId) => {
  const prizeStrategy = prizePool.prizeStrategy.multipleWinners
    ? prizePool.prizeStrategy.multipleWinners
    : prizePool.prizeStrategy.singleRandomWinner
  const ticket = prizeStrategy.ticket
  const sponsorship = prizeStrategy.sponsorship

  // Filter out our PTLootBox erc721
  const externalErc20Awards = prizeStrategy.externalErc20Awards.filter((award) => {
    const lootboxAddress = contractAddresses[chainId]?.lootBox?.toLowerCase()
    if (lootboxAddress) {
      return award.address !== lootboxAddress
    }
    return true
  })

  const formattedData = {
    config: {
      liquidityCap: prizePool.liquidityCap,
      maxExitFeeMantissa: prizePool.maxExitFeeMantissa,
      maxTimelockDurationSeconds: prizePool.maxTimelockDuration,
      timelockTotalSupply: prizePool.timelockTotalSupply,
      numberOfWinners: prizeStrategy?.numberOfWinners || '1',
      prizePeriodSeconds: prizeStrategy.prizePeriodSeconds,
      tokenCreditRates: prizePool.tokenCreditRates
    },
    prizePool: {
      address: prizePool.id
    },
    prizeStrategy: {
      address: prizePool.prizeStrategy.id
    },
    tokens: {
      ticket: {
        address: ticket.id,
        decimals: ticket.decimals,
        name: ticket.name,
        symbol: ticket.symbol,
        totalSupply: formatUnits(ticket.totalSupply, ticket.decimals),
        totalSupplyUnformatted: ethers.BigNumber.from(ticket.totalSupply),
        numberOfHolders: ticket.numberOfHolders
      },
      sponsorship: {
        address: sponsorship.id,
        decimals: sponsorship.decimals,
        name: sponsorship.name,
        symbol: sponsorship.symbol,
        totalSupply: formatUnits(sponsorship.totalSupply, sponsorship.decimals),
        totalSupplyUnformatted: ethers.BigNumber.from(sponsorship.totalSupply),
        numberOfHolders: sponsorship.numberOfHolders
      },
      underlyingToken: {
        address: prizePool.underlyingCollateralToken,
        decimals: prizePool.underlyingCollateralDecimals,
        name: prizePool.underlyingCollateralName,
        symbol: prizePool.underlyingCollateralSymbol
      }
    },
    prize: {
      cumulativePrizeNet: prizePool.cumulativePrizeNet,
      currentPrizeId: prizePool.currentPrizeId,
      currentState: prizePool.currentState,
      externalErc20Awards,
      externalErc721Awards: prizeStrategy.externalErc721Awards,
      sablierStream: {
        id: prizePool.sablierStream?.id
      },
      lootBox: undefined
    },
    reserve: {
      registry: {
        // TODO: Remove. Hardcoded for a bug in the subgraph.
        address:
          prizePool.reserveRegistry === ethers.constants.Zero
            ? '0x3e8b9901dbfe766d3fe44b36c180a1bca2b9a295'
            : prizePool.reserveRegistry
      }
    },
    tokenListener: {
      address: prizeStrategy.tokenListener
    }
  }

  // Add lootbox items to Pool
  prizeStrategy.externalErc721Awards.forEach((erc721) => {
    const lootBoxAddress = contractAddresses[chainId]?.lootBox?.toLowerCase()
    if (erc721.address === lootBoxAddress) {
      if (erc721.tokenIds.length > 1) {
        console.error('Multiple lootboxes in prize')
      }
      const lootBoxId = erc721.tokenIds[0]
      formattedData.prize.lootBox = {
        id: lootBoxId
      }
    }
  })

  if (prizePool.compoundPrizePool) {
    formatCompoundPrizePoolData(prizePool, formattedData)
  } else if (prizePool.yieldSourcePrizePool) {
    formatGenericYieldPrizePoolData(prizePool, formattedData)
  } else {
    formatStakePrizePoolData(prizePool, formattedData)
  }

  return formattedData
}

const formatCompoundPrizePoolData = (prizePool, formattedData) => {
  formattedData.prizePool.type = PRIZE_POOL_TYPES.compound
  formattedData.tokens.cToken = {
    address: prizePool.compoundPrizePool.cToken
  }
}

const formatGenericYieldPrizePoolData = (prizePool, formattedData) => {
  formattedData.prizePool.type = PRIZE_POOL_TYPES.genericYield
  formattedData.prizePool.yieldSource = { address: prizePool.yieldSourcePrizePool.yieldSource }
}

const formatStakePrizePoolData = (prizePool, formattedData) => {
  formattedData.prizePool.type = PRIZE_POOL_TYPES.stake
}
