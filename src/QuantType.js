import * as WellFactories from '@/QuantTypeWellFactories'
import quantTypes from '@/config/quantTypes'

const defaults = {
  key: 'quantType',
  name: 'Quant Type',
  wellType: 'QuantType',
  fileNameSpecs: {},
  parse: {
    delimiter: ',',
    from: 16,
    rowDelimiter: ['\r\n', '\r', '\n'],
    columns: ['column1', 'column2', 'column3', 'column4', 'column5'],
    relax_column_count: true,
  },
  metadata: { rows: 1, idColumn: 'id', delimiter: ',' },
  conversion: { factors: {}, expression: '(ORIGINAL_VALUE)', decimalPlaces: 3 },
  qcResults: {
    key: 'Concentration',
    units: 'ng',
    assay: { type: 'Quant Type', version: 'v1.0' },
    outlier: { type: 'standard', threshold: '1' },
    fields: ['a', 'b', 'c', 'd', 'e', 'f'],
    warningThreshold: {
      value: 5,
      shortMessage: 'brief',
      message: 'Warning: This is a test warning.',
    },
  },
  grid: {},
}

/**
 * Given an expression eg. "(ORIGINAL_VALUE * factorA*factorB*factorC)"
 * and factors { factorA: 2, factorB: 3, factorC: 10 }
 * generates and return the calculation (ORIGINAL_VALUE * 2*3*10)
 *
 * Note that it is expected that the factor ORIGINAL_VALUE will exist in the
 * expression.
 *
 * @param {Object} obj - Usually the value of conversion in quantTypes.json.
 * @param {Object} obj.factors - Key value pair of factors and their values
 * @param {string} obj.expression - The expression for the conversion.
 * @return {number} The result of the evaluated expression
 */
const insertFactorsForConversion = ({ factors, expression }) =>
  Object.entries(factors).reduce(
    (calculation, [factor, value]) => calculation.replace(factor, value),
    expression
  )

const quantType = (quantType, data = {}) => {
  const config = { ...defaults, ...(quantTypes[quantType] || {}), ...data }
  const conversionExpression = insertFactorsForConversion(config.conversion)
  const WellFactory = WellFactories[config.wellType]

  return {
    ...config,
    hasMetadata: Object.keys(config.metadata).length > 0,
    hasFileNameSpecs: Object.keys(config.fileNameSpecs).length > 0,
    replicateOptions: {
      conversionExpression,
      decimalPlaces: config.conversion.decimalPlaces,
      ...config.qcResults,
    },
    WellFactory,
  }
}

export default quantType
