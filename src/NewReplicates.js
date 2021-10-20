/*  Replicates.js
    A library to manage the statistics for a replicate of wells.
    The ultimate aim is to calculate the coefficient of variation (CV),
    a standardized measure of dispersion of a probability distribution or frequency distribution.
    In this case if a concentration in the replicate is above a certain threshold e.g. 20% it is
    considered an outlier and can be removed from the replicate.
*/

import * as Calculations from '@/Calculations'

const NullReplicate = {
  size: 0,
  needsInspection() {
    return false
  },
}

const defaultOptions = {
  key: 'Standard',
  units: 'standard',
  conversionFactor: 1,
  cvThreshold: 1,
  assay: { type: 'Standard', version: '1' },
  outlier: { type: 'cv', threshold: 15 },
  fields: [
    'barcode',
    'well_location',
    'key',
    'value',
    'units',
    'cv',
    'assay_type',
    'assay_version',
  ],
  decimalPlaces: 3,
}

// const Replicate = ({wells = [], options = {}} = { wells: [], options: {}}) => {
const Replicate = ({ wells = [], options = {} }) => {
  options = { ...defaultOptions, ...options }

  const activeWells = () => {
    return wells.filter((well) => well.active && well.concentration !== 'n.a.')
  }

  const concentrations = () => {
    return activeWells().map((well) => parseFloat(well.concentration))
  }

  const average = () =>
    Calculations.average(concentrations()).toDecimalPlaces(
      options.decimalPlaces
    )

  const id = () => {
    return wells[0].id
  }

  const plateBarcode = () => {
    return wells[0].plateBarcode
  }

  const cvThreshold = options.cvThreshold

  const add = (well) => wells.push(well)

  // const average = (() => {
  //   return Calculations.average(this.concentrations).toDecimalPlaces(
  //     this.options.decimalPlaces
  //   )
  // })

  // get id() {
  //   return this.wells[0].id
  // }

  // get plateBarcode() {
  //   return this.wells[0].plateBarcode
  // }

  // get size() {
  //   return this.activeWells.length
  // }

  // // If a well is not active it should not be considered as part of the
  // // statistical calculation
  // // If a well has a concentration of n.a. this throws an error so it needs
  // // to be excluded
  // get activeWells() {
  //   return this.wells.filter(
  //     (well) => well.active && well.concentration !== 'n.a.'
  //   )
  // }

  // get concentrations() {
  //   return this.activeWells.map((well) => parseFloat(well.concentration))
  // }

  // get average() {
  //   return Calculations.average(this.concentrations).toDecimalPlaces(
  //     this.options.decimalPlaces
  //   )
  // }

  const adjustedAverage = () => {
    return Calculations.average(concentrations(), {
      conversionFactor: options.conversionFactor,
    }).toDecimalPlaces(options.decimalPlaces)
  }

  // Should be sample standard deviation i.e. average square difference
  // calculated as N - 1
  const standardDeviation = () => {
    return Calculations.standardDeviation(concentrations()).toDecimalPlaces(
      options.decimalPlaces
    )
  }

  const cv = () => {
    return Calculations.cv(concentrations()).toDecimalPlaces(
      options.decimalPlaces
    )
  }

  const needsInspection = () => {
    return cv() >= cvThreshold
  }

  const json = {
    barcode: plateBarcode,
    well_location: id,
    key: options.key,
    value: adjustedAverage(),
    units: options.units,
    cv: cv(),
    assay_type: options.assay.type,
    assay_version: options.assay.version,
  }

  // get stats() {
  //   return (({ average, standardDeviation, cv }) => ({
  //     average,
  //     standardDeviation,
  //     cv,
  //   }))(this)
  // }

  // get json() {
  //   const standardFields = {
  //     barcode: this.plateBarcode,
  //     well_location: this.id,
  //     key: this.options.key,
  //     value: this.adjustedAverage,
  //     units: this.options.units,
  //     cv: this.cv,
  //     assay_type: this.options.assay.type,
  //     assay_version: this.options.assay.version,
  //   }
  //   return this.options.fields.reduce((result, field) => {
  //     result[field] = standardFields[field]
  //     return result
  //   }, {})
  // }

  // get cvThreshold() {
  //   return this.options.cvThreshold
  // }

  // add(well) {
  //   this.wells.push(well)
  // }

  // needsInspection() {
  //   return this.cv >= this.cvThreshold
  // }

  // outliers() {
  //   let self = this
  //   self.wells.map((well) => {
  //     Vue.set(well, 'outlier', false)
  //   })
  //   if (self.options.outlier.type === 'cv') {
  //     if (self.cv >= self.options.outlier.threshold) {
  //       self.activeWells.map((well) => {
  //         Vue.set(well, 'outlier', true)
  //       })
  //     }
  //   }

  //   if (self.options.outlier.type === 'mad') {
  //     let median = Calculations.median(self.concentrations)
  //     let mad = Calculations.mad(self.concentrations)
  //     self.activeWells.map((well) => {
  //       let zscore = Calculations.modifiedZScores(
  //         well.concentration,
  //         median,
  //         mad
  //       )
  //       if (Calculations.isOutlier(zscore, self.options.outlier.threshold)) {
  //         Vue.set(well, 'outlier', true)
  //       }
  //     })
  //   }
  // }

  return {
    wells,
    options,
    average,
    id,
    activeWells,
    concentrations,
    standardDeviation,
    plateBarcode,
    cvThreshold,
    cv,
    needsInspection,
    json,
    adjustedAverage,
    add,
  }
}

// A JSON object to store the list of replicates
// The key is the well location

class ReplicateList {
  constructor(options = {}) {
    this.items = new Map()
    this.options = options
  }

  get keys() {
    return this.items.keys()
  }

  get size() {
    return this.items.size
  }

  get values() {
    return Array.from(this.items.values())
  }

  // Try and find the well id in the list.
  // If it is found add the well as a new replicate
  // If not create a new key.
  add(well) {
    let replicate
    replicate = this.find(well.id)
    if (replicate === undefined) {
      replicate = Replicate({ wells: [well], options: this.options })
      this.items.set(well.id, replicate)
    } else {
      replicate.add(well)
    }
    well.replicate = replicate
    return this
  }

  find(key) {
    return this.items.get(key)
  }

  first() {
    return this.items.values().next().value
  }
}

export { defaultOptions, ReplicateList, Replicate, NullReplicate }
