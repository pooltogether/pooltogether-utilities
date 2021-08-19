import cloneDeep from 'lodash.clonedeep'
import { ethers } from 'ethers'
import { formatUnits, parseUnits } from '@ethersproject/units'
import { PRIZE_POOL_TYPES, contractAddresses } from '@pooltogether/current-pool-data'

import { stringWithPrecision } from './formatNumber'

const CONTRACT_ADDRESSES = Object.freeze(contractAddresses)

const bn = ethers.BigNumber.from

// TODO: Use the block list everywhere!
export const ERC20_BLOCK_LIST = ['0x6ca105d2af7095b1bceeb6a2113d168dddcd57cf']

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
 * Formats the data returned from the graph for a lootBox
 * @param {*} lootBoxGraphData
 * @returns
 */
export const formatLootBox = (lootBoxGraphData) => ({
  erc1155Tokens: lootBoxGraphData.erc1155Balances,
  erc721Tokens: lootBoxGraphData.erc721Tokens,
  erc20Tokens: lootBoxGraphData.erc20Balances
    .filter((erc20) => !ERC20_BLOCK_LIST.includes(erc20.id))
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
export const getAllErc20Addresses = (pools) => {
  const addresses = new Set()
  pools.forEach((pool) => {
    // Get external erc20s
    pool.prize.externalErc20Awards.forEach((erc20) => addresses.add(erc20.address))
    // Get lootbox erc20s
    pool.prize.lootBox?.erc20Tokens.forEach((erc20) => addresses.add(erc20.address))
    // Get known tokens
    const tokens: any = Object.values(pool.tokens)
    tokens.forEach((erc20) => addresses.add(erc20.address))
  })
  return [...addresses]
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
 * Adds token USD value if we have the USD price per token
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
 * Need to mult & div by 100 since BigNumber doesn't support decimals
 * @param {*} amount as a BigNumber
 * @param {*} usd as a Number
 * @returns a BigNumber
 */
export const amountMultByUsd = (amount, usd) => amount.mul(Math.round(usd * 100)).div(100)

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
 * Adds a list of BigNumbers
 * @param {*} totals an array of scaled BigNumbers
 * @returns
 */
export const addBigNumbers = (totals) =>
  totals.reduce((total, bn) => {
    return bn.add(total)
  }, ethers.constants.Zero)

/**
 * Converts a USD string to a scaled up big number to account for cents
 * @param {*} usdValue a String ex. "100.23"
 * @returns a BigNumber ex. 10023
 */
export const toScaledUsdBigNumber = (usdValue) =>
  parseUnits(stringWithPrecision(usdValue, { precision: 2 }), 2)

/**
 * Standardizes calculated total values
 * @param {BigNumber} amountUnformatted Ex. BigNumber 1000000000000000000
 * @param {string} usdValue Ex. 1.23
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
    const lootboxAddress = CONTRACT_ADDRESSES[chainId]?.lootBox?.toLowerCase()
    if (lootboxAddress) {
      return award.address !== lootboxAddress
    }
    return true
  })

  const formattedData = {
    chainId,
    config: {
      liquidityCap: prizePool.liquidityCap,
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
      lootBox: undefined,
      cumulativePrizeNet: prizePool.cumulativePrizeNet,
      currentPrizeId: prizePool.currentPrizeId,
      currentState: prizePool.currentState,
      externalErc20Awards,
      externalErc721Awards: prizeStrategy.externalErc721Awards,
      sablierStream: {
        id: prizePool.sablierStream?.id
      }
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
    const lootBoxAddress = CONTRACT_ADDRESSES[chainId]?.lootBox?.toLowerCase()
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

export const getLootBoxBatchName = (lootBoxAddress, lootBoxId) =>
  `lootBox-${lootBoxAddress}-${lootBoxId}`
