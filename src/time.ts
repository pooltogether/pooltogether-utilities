import {
  SECONDS_PER_YEAR,
  SECONDS_PER_WEEK,
  SECONDS_PER_DAY,
  SECONDS_PER_HOUR
} from '@pooltogether/current-pool-data'
import { ethers } from 'ethers'

/**
 * Breaks down a number of seconds into years, weeks, days, hours, minutes, seconds
 * @param totalSeconds
 * @returns
 */
export const getTimeBreakdown = (totalSeconds: number | string) => {
  let diff = Number(totalSeconds)

  let years = 0
  if (diff >= SECONDS_PER_YEAR) {
    years = Math.round(diff / SECONDS_PER_YEAR)
    diff -= years * SECONDS_PER_YEAR
  }

  let weeks = 0
  if (diff >= SECONDS_PER_WEEK) {
    weeks = Math.round(diff / SECONDS_PER_WEEK)
    diff -= weeks * SECONDS_PER_WEEK
  }

  let days = 0
  if (diff >= SECONDS_PER_DAY) {
    days = Math.round(diff / SECONDS_PER_DAY)
    diff -= days * SECONDS_PER_DAY
  }

  let hours = 0
  if (days || diff >= SECONDS_PER_HOUR) {
    hours = Math.round(diff / SECONDS_PER_HOUR)
    diff -= hours * SECONDS_PER_HOUR
  }

  let minutes = 0
  if (hours || diff >= 60) {
    minutes = Math.round(diff / 60)
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
