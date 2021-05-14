import { YIELD_SOURCE_NAMES } from '../data/knownYieldSources'
import { getKnownYieldSourceContract } from '../yieldSources'
import {
  getChainIdByAlias,
  getNetworkNameAliasByChainId,
  getNetworkNiceNameByChainId
} from '../networks'

describe('getChainIdByAlias', () => {
  it('returns a known chain id', () => {
    let chainId = getChainIdByAlias('mainnet')
    expect(chainId).toEqual(1)
    chainId = getChainIdByAlias('rinkeby')
    expect(chainId).toEqual(4)
    chainId = getChainIdByAlias('matic')
    expect(chainId).toEqual(137)
    chainId = getChainIdByAlias('polygon')
    expect(chainId).toEqual(137)
  })

  it('returns undefined for an unknown alias', () => {
    let chainId = getChainIdByAlias('quack')
    expect(chainId).toEqual(undefined)
  })
})

describe('getNetworkNameAliasByChainId', () => {
  it('returns a known alais', () => {
    let alias = getNetworkNameAliasByChainId(1)
    expect(alias).toEqual('mainnet')
    alias = getNetworkNameAliasByChainId(4)
    expect(alias).toEqual('rinkeby')
    alias = getNetworkNameAliasByChainId(137)
    expect(alias).toEqual('polygon')
  })

  it('returns undefined for an unknown chain id', () => {
    let chainId = getNetworkNameAliasByChainId(123123123)
    expect(chainId).toEqual(undefined)
  })
})

describe('getNetworkNiceNameByChainId', () => {
  it('returns a hardcoded chain id', () => {
    let niceName = getNetworkNiceNameByChainId(1)
    expect(niceName).toEqual('Ethereum')
    niceName = getNetworkNiceNameByChainId(137)
    expect(niceName).toEqual('Polygon')
    niceName = getNetworkNiceNameByChainId(56)
    expect(niceName).toEqual('Binance Smart Chain')
    niceName = getNetworkNiceNameByChainId(100)
    expect(niceName).toEqual('xDai')
  })

  it('returns a known nice named chain id', () => {
    let niceName = getNetworkNiceNameByChainId(4)
    expect(niceName).toEqual('Rinkeby')
    niceName = getNetworkNiceNameByChainId(42)
    expect(niceName).toEqual('Kovan')
    niceName = getNetworkNiceNameByChainId(80001)
    expect(niceName).toEqual('Mumbai')
  })

  it('returns undefined for an unknown chain id', () => {
    let chainId = getNetworkNameAliasByChainId(123123123)
    expect(chainId).toEqual(undefined)
  })
})
