import { getTimeBreakdown } from '../src/time'

describe('time', () => {
  it('works years from now', () => {
    expect(getTimeBreakdown(143451289)).toEqual({
      days: 200,
      hours: 7,
      minutes: 34,
      seconds: 49,
      years: 4
    })
  })

  it('works weeks from now', () => {
    expect(getTimeBreakdown(1434512)).toEqual({
      days: 16,
      hours: 14,
      minutes: 28,
      seconds: 32,
      years: 0
    })
  })

  it('works days from now', () => {
    expect(getTimeBreakdown(534512)).toEqual({
      days: 6,
      hours: 4,
      minutes: 28,
      seconds: 32,
      years: 0
    })
  })

  it('works hours from now', () => {
    expect(getTimeBreakdown(66512)).toEqual({
      days: 0,
      hours: 18,
      minutes: 28,
      seconds: 32,
      years: 0
    })
  })

  it('works minutes from now', () => {
    expect(getTimeBreakdown(599)).toEqual({ days: 0, hours: 0, minutes: 9, seconds: 59, years: 0 })
  })

  it('works seconds from now', () => {
    expect(getTimeBreakdown(44)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 44, years: 0 })
  })
})
