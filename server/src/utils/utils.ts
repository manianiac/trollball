import { GoogleGenAI } from '@google/genai'
import { player } from './consts'

export const generateNormalRandom = (mean: number, stdDev: number): number => {
  let u1 = Math.random()
  let u2 = Math.random()
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2)
  return Math.round(z0 * stdDev + mean)
}

export const boundedNumber = (
  number: number,
  maxBound: number,
  minNumber: number
) => {
  return Math.min(Math.max(number, minNumber), maxBound)
}

export const selectRandomPlayer = (players: player[]): player => {
  return players[getRandomInt(0, players.length)]
}

export const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min) // Ensure min is an integer
  max = Math.floor(max) // Ensure max is an integer
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const key = 'AIzaSyAzPqjPwm9xdWVekIFp3E2sCA_mONLLOGg'
const ai = new GoogleGenAI({ apiKey: key })
export const generateGemma = async (
  inputString: string
): Promise<string | undefined> => {
  console.log('Input String', inputString)
  const response = await ai.models.generateContent({
    model: 'gemma-3-27b-it',
    contents: inputString
  })
  return response.text
}
