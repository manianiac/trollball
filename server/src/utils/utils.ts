export const generateNormalRandom = (mean: number, stdDev: number): number => {
  let u1 = Math.random()
  let u2 = Math.random()
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2)
  return Math.round(z0 * stdDev + mean)
}

export const boundedNumber = (number:number, maxBound: number, minNumber: number) => {
    return Math.min(Math.max(number, minNumber), maxBound)
}