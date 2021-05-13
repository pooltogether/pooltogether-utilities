import { getKnownYieldSourceContract } from '../yieldSources'
import { YIELD_SOURCE_NAMES } from '../data/knownYieldSources'

describe('getKnownYieldSourceContract', () => {
  it('returns a KnownYieldSourceContract if matches', () => {
    const knownContract = getKnownYieldSourceContract(
      1,
      '0x39AA39c021dfbaE8faC545936693aC917d5E7563'
    )
    expect(knownContract).toEqual({
      option: {
        image: '/tokens/usdc-new-transparent.png',
        label: '$USDC - Compound Yield',
        value: '0x39AA39c021dfbaE8faC545936693aC917d5E7563'
      },
      type: 'compound',
      yieldSourceName: YIELD_SOURCE_NAMES.compound
    })
  })

  it('supports any case sensitivity', () => {
    const knownContract = getKnownYieldSourceContract(
      1,
      '0xF8445C529D363CE114148662387EBA5E62016E20'
    )
    expect(knownContract).toEqual({
      option: {
        image: '/tokens/rai-small.png',
        label: '$RAI - CREAM Yield',
        value: '0xf8445C529D363cE114148662387eba5E62016e20'
      },
      type: 'compound',
      yieldSourceName: YIELD_SOURCE_NAMES.cream
    })
  })

  it('supports other networks', () => {
    const knownContract = getKnownYieldSourceContract(
      56,
      '0xC17C8C5B8BB9456C624F8534FDE6CBDA2451488C'
    )
    expect(knownContract).toEqual({
      option: {
        image: '/tokens/iotx-small.svg',
        label: '$IOTX - CREAM Yield',
        value: '0xc17C8C5b8bB9456c624f8534FdE6cBda2451488C'
      },
      type: 'compound',
      yieldSourceName: YIELD_SOURCE_NAMES.cream
    })
  })

  it('returns undefined if no matches', () => {
    const knownContract = getKnownYieldSourceContract(
      1,
      '0x6b175474e89094c44da98b954eedeac495271d0f'
    )
    expect(knownContract).toEqual(undefined)
  })

  it('throws with bad params', () => {
    expect(() => {
      getKnownYieldSourceContract()
    }).toThrow()
  })

  it('throws with bad eth address', () => {
    expect(() => {
      const knownContract = getKnownYieldSourceContract(1, '0xface')
    }).toThrow()
  })
})
