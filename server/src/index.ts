import { boundedNumber, generateNormalRandom } from './utils/utils'

//boundedNumber(generateNormalRandom(50, 6.5), 80, 20) generates correct values

let store = new Array(100).fill([0, 0]).map((value, index) => {
  value[0] = index
  return [...value]
})
for (let i = 0; i < 1000000; i++) {
  store[boundedNumber(generateNormalRandom(50, 6.5), 80, 20)][1]++
}
console.log(store)
