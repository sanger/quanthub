import math from 'mathjs'

Number.prototype.toDecimalPlaces = function(n = 3) {
  return Number(this.toFixed(n))
}

const median = (values) => {

  let sortedValues = [...values].sort()
  let length = sortedValues.length

  if (length % 2 === 0) {
    return (sortedValues[length/2] + sortedValues[length/2 - 1])/2
  } else {
    return sortedValues[(length+1)/2 - 1]
  }
}

const absoluteDeviation = (values, median) => {
  return values.map(item => math.abs(item - median))
}

const mad = (values) => {
  let medianResult = median(values)
  let absoluteDeviations = absoluteDeviation(values, medianResult)

  return median(absoluteDeviations)
}

// modified z scores
// item - median / (magic * mad ) 
const modifiedZScores = (values, consistency_constant = 1.4826) => {
  let medianResult = median(values)
  let madResult = mad(values)

  return values.map(item => {
    let result = (item - medianResult) / (consistency_constant * madResult)
    return result.toDecimalPlaces(10)
  })
}

// Outlier is defined as > 3.5 or < -3.5
const isOutlier = (value, limit = 3.5) => {
  return math.abs(value) > limit
}

// sample: represents whether the average needs to be adjusted if
// it is from a sample. This is important for calculating sample
// standard deviation
const average = (values, {sample = 0, conversionFactor = 1, decimalPlaces = 3} = {}) => {
  let sum = values.reduce(function (a, b) { return a + b })
  return ((sum / (values.length - sample) * conversionFactor)).toDecimalPlaces(decimalPlaces)
}

const standardDeviation = (values, {decimalPlaces}) => {
  let mean = average(values)

  let squareDiffs = values.map(value => {
    let diff = value - mean
    let sqrDiff = diff * diff
    return sqrDiff
  })
  let avgSquareDiff = average(squareDiffs, {sample: 1})
  return math.sqrt(avgSquareDiff).toDecimalPlaces(decimalPlaces)
}

export { median, absoluteDeviation, mad, modifiedZScores, isOutlier, average, standardDeviation }