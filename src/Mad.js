
import math from 'mathjs'

const median = (values) => {
  let sortedValues = values.sort()
  let length = values.length

  if (length % 2 === 0) {
    return (sortedValues[length/2] + sortedValues[length/2 - 1])/2
  } else {
    return sortedValues[(length+1)/2 - 1]
  }
}

const absoluteDeviation = (values, median) => {
  return values.map(item => math.abs(item - median))
}

const calculation = (values) => {
  let medianResult = median(values)
  let absoluteDeviations = absoluteDeviation(values, medianResult)
  return median(absoluteDeviations)
}

export { median, absoluteDeviation, calculation }