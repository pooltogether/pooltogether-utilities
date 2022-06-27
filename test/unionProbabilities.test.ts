import { unionProbabilities } from '../src/odds'

describe('unionProbabilities', () => {
  it('Handles 0 cases gracefully', () => {
    const a = unionProbabilities(0)
    const b = unionProbabilities(0, 0)
    const c = unionProbabilities(0, 0, 0)

    expect(a).toEqual(0)
    expect(b).toEqual(0)
    expect(c).toEqual(0)
  })

  it('Handles happy path (0.5)', () => {
    const a = unionProbabilities(0.5)
    const b = unionProbabilities(0.5, 0.5)
    const c = unionProbabilities(0.5, 0.5, 0.5)
    const d = unionProbabilities(0.5, 0.5, 0.5, 0.5)

    expect(a).toEqual(0.5)
    expect(b).toEqual(0.75)
    expect(c).toEqual(0.875)
    expect(d).toEqual(0.9375)
  })

  it('Handles happy path (random)', () => {
    const a = unionProbabilities(0.2)
    const b = unionProbabilities(0.2, 0.001)
    const c = unionProbabilities(0.2, 0.001, 0.000001)
    const d = unionProbabilities(0.2, 0.001, 0.000001, 0.5)

    expect(a).toEqual(0.2)
    expect(b).toEqual(0.2008)
    expect(c).toEqual(0.20080079920000002)
    expect(d).toEqual(0.6004003996)
  })
})
