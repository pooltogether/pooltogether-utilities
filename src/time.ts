import {
  SECONDS_PER_YEAR,
  SECONDS_PER_WEEK,
  SECONDS_PER_DAY,
  SECONDS_PER_HOUR
} from '@pooltogether/current-pool-data'
import { BigNumber, ethers } from 'ethers'

/**
 * Breaks down a number of seconds into years, weeks, days, hours, minutes, seconds
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

  let weeks = 0
  if (diff >= SECONDS_PER_WEEK) {
    weeks = Math.floor(diff / SECONDS_PER_WEEK)
    diff -= weeks * SECONDS_PER_WEEK
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
    weeks,
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
  return ethers.BigNumber.from(ms).div(1000).toNumber()
}

/**
 * Return seconds since Epoch as a number
 * @returns Number Seconds since the Unix Epoch
 */
export const getSecondsSinceEpoch = () => Number((Date.now() / 1000).toFixed(0))
