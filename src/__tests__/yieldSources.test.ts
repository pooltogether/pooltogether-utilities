import { getKnownYieldSourceContract } from '../yieldSources'
import { YIELD_SOURCE_NAMES } from '../data/knownYieldSources'

describe('getKnownYieldSourceContract', () => {
  it('returns a KnownYieldSourceContract if matches and works with COMPOUND', () => {
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

  it('supports any case sensitivity and works with CREAM', () => {
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

  it('supports other networks and works with CREAM', () => {
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

  it('works with RARI FUSE', () => {
    const knownContract = getKnownYieldSourceContract(
      1,
      '0x8f0861e0e8ca979109ce462fd4a23131d56ede00'
    )
    expect(knownContract).toEqual({
      option: {
        image: '/tokens/dai-new-transparent.png',
        label: '$DAI - Rari Fuse Pool #0 Yield',
        value: '0x8f0861e0e8ca979109ce462fd4a23131d56ede00'
      },
      type: 'compound',
      yieldSourceName: YIELD_SOURCE_NAMES.rari
    })
  })

  it('works with AAVE as generic custom yield source', () => {
    const knownContract = getKnownYieldSourceContract(
      137,
      '0xEbED994f97396106f7B3d55C287A6A51128cDBB1'
    )
    expect(knownContract).toEqual({
      option: {
        image: '/tokens/aave-small.png',
        label: '$AAVE - Aave Yield',
        value: '0xEbED994f97396106f7B3d55C287A6A51128cDBB1'
      },
      type: 'genericYield',
      yieldSourceName: YIELD_SOURCE_NAMES.aave
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
      getKnownYieldSourceContract(undefined as any, undefined as any)
    }).toThrow()
  })

  it('throws with bad eth address', () => {
    expect(() => {
      const knownContract = getKnownYieldSourceContract(1, '0xface')
    }).toThrow()
  })
})
