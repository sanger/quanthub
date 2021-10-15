/**
 * I'm currently in the place of refactoring QuantType into a plain JS object
 * This is where it will be housed. Currently this is simply wrapping the vue
 * component so that we can refactor gradually.
 */

import { evaluate } from 'mathjs'
import * as WellFactories from '@/QuantTypeWellFactories'
import quantTypes from '@/config/quantTypes'

const defaults = {
  key: 'quantType',
  name: 'Quant Type',
  wellType: 'QuantType',
  parse: {
    delimiter: ',',
    from: 16,
    rowDelimiter: ['\r\n', '\r', '\n'],
    columns: ['column1', 'column2', 'column3', 'column4', 'column5'],
    relax_column_count: true,
  },
  metadata: { rows: 1, idColumn: 'id', delimiter: ',' },
  conversion: { factors: {}, expression: 1, decimalPlaces: 3 },
  qcResults: {
    key: 'Concentration',
    units: 'ng',
    assay: { type: 'Quant Type', version: 'v1.0' },
    outlier: { type: 'standard', threshold: '1' },
    fields: ['a', 'b', 'c', 'd', 'e', 'f'],
  },
  grid: {},
}

const calculateConversionFactor = ({ factors, expression }) => {
  return evaluate(
    Object.keys(factors).reduce((factor, key) => {
      return factor.replace(key, factors[key])
    }, expression)
  )
}

const quantType = (quantType, data = {}) => {
  const config = { ...defaults, ...(quantTypes[quantType] || {}), ...data }
  const conversionFactor = calculateConversionFactor(config.conversion)
  const WellFactory = WellFactories[config.wellType]

  return {
    ...config,
    hasMetadata: Object.keys(config.metadata).length > 0,
    conversionFactor,
    replicateOptions: {
      conversionFactor,
      decimalPlaces: config.conversion.decimalPlaces,
      ...config.qcResults,
    },
    WellFactory,
  }
}

export default quantType
