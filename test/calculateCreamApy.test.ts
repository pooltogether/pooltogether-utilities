import { BigNumber } from 'ethers';
import { calculateCreamBorrowApy, calculateCreamSupplyApy } from '../src/math';

describe('happy path - borrow', () => {
  it('Calculates borrow apy correctly', () => {
    const baseUnformatted = BigNumber.from('0x00');
    const multiplierUnformatted = BigNumber.from('0x13ef232c54');
    const utilizationRateUnformatted = BigNumber.from('0x0644242098114ac3');
    const kink1Unformatted = BigNumber.from('0x0b1a2bc2ec500000');
    const kink2Unformatted = BigNumber.from('0x0c7d713b49da0000');
    const jumpMultiplierUnformatted = BigNumber.from('0x0375f61b4063');
    const blocksPerYearBN = BigNumber.from('0x201480');

    const borrowApy = calculateCreamBorrowApy(
      baseUnformatted,
      multiplierUnformatted,
      utilizationRateUnformatted,
      kink1Unformatted,
      kink2Unformatted,
      jumpMultiplierUnformatted,
      blocksPerYearBN
    );
    console.log(`Borrow apy: ${borrowApy}`);
    expect(borrowApy).toEqual(0.08466870959297257);
  });
});

describe('happy path - supply', () => {
  it('Calculates supply apy correctly', () => {
    const reserveFactorUnformatted = BigNumber.from('0x016345785d8a0000');
    const utilizationRateUnformatted = BigNumber.from('0x0644242098114ac3');
    const blocksPerYearBN = BigNumber.from('0x201480');
    const borrowApy = 0.08466870959297257;

    const supplyApy = calculateCreamSupplyApy(
      borrowApy,
      reserveFactorUnformatted,
      utilizationRateUnformatted,
      blocksPerYearBN
    );

    console.log(`Supply apy: ${supplyApy}`);
    expect(supplyApy).toEqual(0.03357927947589978);
  });
});
