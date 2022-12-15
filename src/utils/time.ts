import { BigNumber, ethers } from 'ethers'
import {
  MINUTES_PER_DAY,
  SECONDS_PER_DAY,
  SECONDS_PER_HOUR,
  SECONDS_PER_MINUTE,
  SECONDS_PER_YEAR
} from '../data/time'
import { TimeUnit } from '../types'

/**
 * Breaks down a number of seconds into years, months, days, hours, minutes, seconds
 * @param totalSeconds
 * @returns
 */
export const getTimeBreakdown = (totalSeconds: number | string) => {
  let diff = Number(totalSeconds)

  let years = 0
  if (diff >= SECONDS_PER_YEAR) {
    years = Math.floor(diff / SECONDS_PER_YEAR)
    diff -= years * SECONDS_PER_YEAR
  }

  let days = 0
  if (diff >= SECONDS_PER_DAY) {
    days = Math.floor(diff / SECONDS_PER_DAY)
    diff -= days * SECONDS_PER_DAY
  }

  let hours = 0
  if (days || diff >= SECONDS_PER_HOUR) {
    hours = Math.floor(diff / SECONDS_PER_HOUR)
    diff -= hours * SECONDS_PER_HOUR
  }

  let minutes = 0
  if (hours || diff >= 60) {
    minutes = Math.floor(diff / 60)
    diff -= minutes * 60
  }

  let seconds = 0
  if (minutes || diff >= 1) {
    seconds = diff
  }

  return {
    years,
    days,
    hours,
    minutes,
    seconds
  }
}

/**
 * Simple math to calculate how many seconds are remaining until the prize can be awarded
 * @param prizePeriodSeconds
 * @param prizePeriodStartedAt
 * @returns
 */
export const getSecondsRemainingInPrizePeriod = (
  prizePeriodSeconds: BigNumber,
  prizePeriodStartedAt: BigNumber
) => {
  const prizePeriodDurationInSeconds = prizePeriodSeconds.toNumber()
  const prizePeriodStartedAtInSeconds = prizePeriodStartedAt.toNumber()
  const currentTimeInSeconds = getSecondsSinceEpoch()
  const secondsSinceStartOfPrizePeriod = currentTimeInSeconds - prizePeriodStartedAtInSeconds
  return prizePeriodDurationInSeconds - secondsSinceStartOfPrizePeriod
}

/**
 * Converts milliseconds to seconds
 * @param milliseconds milliseconds as a number
 * @returns
 */
export const msToS = (milliseconds: number) => {
  if (!milliseconds) {
    return 0
  }
  return milliseconds / 1000
}

/**
 * Converts seconds to milliseconds
 * @param seconds seconds as a number
 * @returns
 */
export const sToMs = (seconds: number) => {
  if (!seconds) {
    return 0
  }
  return seconds * 1000
}

/**
 * Converts days to milliseconds
 * @param days days as a number
 * @returns
 */
export const dToMs = (days: number) => {
  if (!days) {
    return 0
  }
  return days * SECONDS_PER_DAY * 1000
}

/**
 * Converts milliseconds to days
 * @param days days as a number
 * @returns
 */
export const msToD = (ms: number) => {
  if (!ms) {
    return 0
  }
  return ms / 1000 / SECONDS_PER_DAY
}

/**
 * Converts days to seconds
 * @param days days as a number
 * @returns
 */
export const dToS = (days: number) => {
  if (!days) {
    return 0
  }
  return days * SECONDS_PER_DAY
}

/**
 * Converts seconds to days
 * @param s seconds as a number
 * @returns
 */
export const sToD = (s: number) => {
  if (!s) {
    return 0
  }
  return s / SECONDS_PER_DAY
}

/**
 * Converts seconds to minutes
 * @param s seconds as a number
 * @returns
 */
export const sToM = (s: number) => {
  if (!s) {
    return 0
  }
  return s / SECONDS_PER_MINUTE
}

/**
 * Converts days to minutes
 * @param days days as a number
 * @returns
 */
export const dToM = (days: number) => {
  if (!days) {
    return 0
  }
  return days * MINUTES_PER_DAY
}

/**
 * Finds the difference between two date objects
 * @param dateA DateTime JS object (ie. new Date(Date.now()))
 * @param dateB DateTime JS object (ie. new Date(Date.now()))
 * @returns Object with difference split into keys with days, hours, minutes, and seconds
 */
export const subtractDates = (dateA, dateB) => {
  let msA = dateA.getTime()
  let msB = dateB.getTime()

  let diff = msA - msB

  let days = 0
  if (diff >= 86400000) {
    days = diff / 86400000
    diff -= days * 86400000
  }

  let hours = 0
  if (days || diff >= 3600000) {
    hours = diff / 3600000
    diff -= hours * 3600000
  }

  let minutes = 0
  if (hours || diff >= 60000) {
    minutes = diff / 60000
    diff -= minutes * 60000
  }

  let seconds = 0
  if (minutes || diff >= 1000) {
    seconds = diff / 1000
  }

  return {
    days,
    hours,
    minutes,
    seconds
  }
}

/**
 * Converts milliseconds to seconds using bigNum math
 * @param ms Number Milliseconds to convert
 * @returns Number Seconds converted from milliseconds
 */
export function msToSeconds(ms) {
  if (!ms) {
    return 0
  }
  return ethers.BigNumber.from(ms)
    .div(1000)
    .toNumber()
}

/**
 * Return seconds since Epoch as a number
 * @returns Number Seconds since the Unix Epoch
 */
export const getSecondsSinceEpoch = () => Number((Date.now() / 1000).toFixed(0))

/**
 * Converts a daily probability into an estimated frequency.
 * @param dailyFrequency Number probability of an event taking place in a day.
 * 0 means an event is never possible.
 * 1 means it happens once a day.
 * 2 means it happens twice a day, etc.
 * @returns Object with estimated frequency and unit of time specified.
 */
export const formatEstimatedFrequency = (dailyFrequency: number) => {
  const estimatedFrequency: { frequency: number; unit: TimeUnit } = {
    frequency: 0,
    unit: TimeUnit.day
  }

  if (dailyFrequency > 0) {
    const days = 1 / dailyFrequency
    const weeks = days / 7
    const months = days / (365 / 12)
    const years = days / 365

    if (weeks < 1.5) {
      estimatedFrequency.frequency = days
    } else if (months < 1.5) {
      estimatedFrequency.frequency = weeks
      estimatedFrequency.unit = TimeUnit.week
    } else if (years < 1.5) {
      estimatedFrequency.frequency = months
      estimatedFrequency.unit = TimeUnit.month
    } else {
      estimatedFrequency.frequency = years
      estimatedFrequency.unit = TimeUnit.year
    }
  }

  return estimatedFrequency
}
