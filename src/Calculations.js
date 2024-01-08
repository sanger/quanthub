import { abs, evaluate, sqrt } from 'mathjs'

const originalValue = 'ORIGINAL_VALUE'

Number.prototype.toDecimalPlaces = function (n = 3) {
  return Number(this.toFixed(n))
}

// to find median first we need to sort values in ascending order
// if the number of values are even we need to find the average of
// the two middle values otherwise we can just return the middle
// value
const median = (values) => {
  const sortedValues = [...values].sort((a, b) => a - b)
  const length = sortedValues.length

  if (length % 2 === 0) {
    return (sortedValues[length / 2] + sortedValues[length / 2 - 1]) / 2
  } else {
    return sortedValues[(length + 1) / 2 - 1]
  }
}

const absoluteDeviation = (values, median) => {
  return values.map((item) => abs(item - median))
}

const mad = (values) => {
  const medianResult = median(values)
  const absoluteDeviations = absoluteDeviation(values, medianResult)

  return median(absoluteDeviations)
}

// modified z scores
// item - median / (magic * mad )
const modifiedZScores = (value, median, mad, consistencyConstant = 1.4826) => {
  return (value - median) / (consistencyConstant * mad)
}

// Outlier is defined as > 3.5 or < -3.5
const isOutlier = (value, limit = 3.5) => {
  return abs(value) > limit
}

// sample: represents whether the mean needs to be adjusted if
// it is from a sample. This is important for calculating sample
// standard deviation
// will return 0 if array is empty
const mean = (
  values,
  { sample = 0, conversionExpression = `(${originalValue})` } = {},
) => {
  if (conversionExpression.indexOf(originalValue) === -1) {
    return NaN
  }

  const sum = values.reduce(function (a, b) {
    return a + b
  }, 0)
  const mean = sum / (values.length - sample) || 0

  return evaluate(conversionExpression.replaceAll(originalValue, mean))
}

const standardDeviation = (values) => {
  const average = mean(values)

  const squareDiffs = values.map((value) => {
    const diff = value - average
    const sqrDiff = diff * diff
    return sqrDiff
  })
  const avgSquareDiff = mean(squareDiffs, { sample: 1 })
  return sqrt(avgSquareDiff)
}

const cv = (values) => {
  return (standardDeviation(values) / mean(values) || 0) * 100
}

export {
  median,
  absoluteDeviation,
  mad,
  modifiedZScores,
  isOutlier,
  mean,
  standardDeviation,
  cv,
}
