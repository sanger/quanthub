import math from 'mathjs'

Number.prototype.toDecimalPlaces = function(n = 3) {
  return Number(this.toFixed(n))
}

// to find median first we need to sort values in ascending order
// if the number of values are even we need to find the average of
// the two middle values otherwise we can just return the middle
// value
const median = (values) => {

  let sortedValues = [...values].sort((a,b) => a - b)
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
const modifiedZScores = (value, median, mad, consistencyConstant = 1.4826) => {
  return ((value - median) / (consistencyConstant * mad))
}

// Outlier is defined as > 3.5 or < -3.5
const isOutlier = (value, limit = 3.5) => {
  return math.abs(value) > limit
}

// sample: represents whether the average needs to be adjusted if
// it is from a sample. This is important for calculating sample
// standard deviation
// will return 0 if array is empty
const average = (values, { sample = 0, conversionFactor = 1 } = {}) => {
  let sum = values.reduce(function (a, b) { return a + b }, 0)
  return ((sum / (values.length - sample)) || 0 ) * conversionFactor
}

const standardDeviation = (values) => {
  let mean = average(values)

  let squareDiffs = values.map(value => {
    let diff = value - mean
    let sqrDiff = diff * diff
    return sqrDiff
  })
  let avgSquareDiff = average(squareDiffs, {sample: 1})
  return math.sqrt(avgSquareDiff)
}

const cv = (values) => {
  return (standardDeviation(values) / average(values) || 0) * 100
}

export { median, absoluteDeviation, mad, modifiedZScores, isOutlier, average, standardDeviation, cv }