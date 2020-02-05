import math from 'mathjs'

const CONSISTENCY_CONSTANT = 1.4826

const median = (values) => {
  let mutableValues = [...values]

  let sortedValues = mutableValues.sort()
  let length = mutableValues.length

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

// modified z scores
// item - median / (magic * mad ) 
const methodTwo = (values) => {
  let medianResult = median(values)
  let madResult = calculation(values)
  return values.map(item => {
    let result = (item - medianResult) / (CONSISTENCY_CONSTANT * madResult)
    let fixedResultString = result.toFixed(10)
    return Number(fixedResultString)
  })
}

// Outlyer is defined as > 3.5 or < -3.5
const isOutlier = (value) =>{
  return math.abs(value) > 3.5
}

export { median, absoluteDeviation, calculation, methodTwo, isOutlier }