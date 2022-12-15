import { TimeUnit } from '../src/types'
import { getEstimatedFrequency, getTimeBreakdown } from '../src/utils/time'

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

  it('calculates estimated frequency', () => {
    expect(getEstimatedFrequency(1)).toEqual({ frequency: 1, unit: TimeUnit.day })
    expect(getEstimatedFrequency(0.2)).toEqual({ frequency: 5, unit: TimeUnit.day })
    expect(getEstimatedFrequency(0.05)).toEqual({ frequency: 2.857142857142857, unit: TimeUnit.week })
    expect(getEstimatedFrequency(0.010)).toEqual({ frequency: 3.287671232876712, unit: TimeUnit.month })
    expect(getEstimatedFrequency(0.0015)).toEqual({ frequency: 1.82648401826484, unit: TimeUnit.year })
  })
})
