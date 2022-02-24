/*  Replicates.js
    A library to manage the statistics for a replicate of wells.
    The ultimate aim is to calculate the coefficient of variation (CV),
    a standardized measure of dispersion of a probability distribution or frequency distribution.
    In this case if a concentration in the replicate is above a certain threshold e.g. 20% it is
    considered an outlier and can be removed from the replicate.
*/

import Vue from 'vue'
import * as Calculations from '@/Calculations'

/**
 * @return {object} NullReplicate - place holder for a real Replicate
 * Ensures that when a well is created it will respond to whether it needs inspecting.
 **/
const NullReplicate = {
  needsInspection() {
    return false
  },
}

// The default options are a list of standard options for a replicate
// This will ensure that any replicate will have all of the options
const defaultOptions = {
  key: 'Standard',
  units: 'standard',
  conversionFactor: 1,
  cvThreshold: 1,
  assay: { type: 'Standard', version: '1' },
  outlier: { type: 'cv', threshold: 15 },
  barcodeSource: 'plateBarcode',
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

/**
 * @param {Array} wells - The wells which are part of this replicate each of which is a Vue component
 * @param {Object} options - Options which will be related to the type of assay and contain certain statistical parameters
 * @return {Object} Replicate
 **/
const Replicate = ({ wells, options } = { wells: [], options: {} }) => {
  // we need to merge the default options to ensure consistency
  options = { ...defaultOptions, ...options }

  /**
   * An active well is one which the property active is true and the concentration is not n.a.
   * @return {Array} wells which are active
   **/
  const activeWells = () =>
    wells.filter((well) => well.active && well.concentration !== 'n.a.')

  /**
   * @return {Array} of concentrations from the wells in the replicate parsed to a float.
   **/
  const concentrations = () =>
    activeWells().map((well) => parseFloat(well.concentration))

  /**
   * @return {Float} the average of the concentrations in the well set to n decimal places
   * where n is the decimalPlaces of the options
   **/
  const average = () =>
    Calculations.mean(concentrations()).toDecimalPlaces(options.decimalPlaces)

  /**
   * @return {String} the id of the first well. The id will be the value which binds the replicates e.g. Well location
   **/
  const id = () => wells[0].id

  /**
   * @return {String} the plate barcode of the first well
   **/
  const plateBarcode = () => wells[0].plateBarcode

  // make cvThreshold first class
  const cvThreshold = options.cvThreshold

  /**
   * @param {Object} well - the well to add
   **/
  const add = (well) => wells.push(well)

  /**
   * @return {Float} adjusted average.
   * The standard average adjusted using the conversionFactor of the options
   * returned with the number of decimal places as determined by the decimalPlaces of the options
   **/
  const adjustedAverage = () => {
    return Calculations.mean(concentrations(), {
      conversionFactor: options.conversionFactor,
    }).toDecimalPlaces(options.decimalPlaces)
  }

  /**
   * @return {Float} standard deviation
   * Should be sample standard deviation i.e. average square difference. calculated as N - 1
   **/
  const standardDeviation = () => {
    return Calculations.standardDeviation(concentrations()).toDecimalPlaces(
      options.decimalPlaces
    )
  }

  /**
   * @return {Float} cv (see above) converted to correct number of decimal places
   **/
  const cv = () => {
    return Calculations.cv(concentrations()).toDecimalPlaces(
      options.decimalPlaces
    )
  }

  /**
   * @return {Boolean} if the actual cv is above the threshold then this is a well that needs to be checked
   **/
  const needsInspection = () => cv() >= cvThreshold

  /**
   * @return {Object} json which will be sent to the api to be saved as a qc result
   **/
  const json = () => {
    const standardFields = {
      barcode: barcode(),
      well_location: id(),
      key: options.key,
      value: adjustedAverage(),
      units: options.units,
      cv: cv(),
      assay_type: options.assay.type,
      assay_version: options.assay.version,
    }
    return options.fields.reduce((result, field) => {
      result[field] = standardFields[field]
      return result
    }, {})
  }

  /**
   * @return {String} either a plate or a tube barcode
   **/
  const barcode = () => wells[0][options.barcodeSource]

  /**
   * This will calculate whether each well is an outlier based on cv or mad calculations
   * It will either set the outlier value in each well to true or false
   **/
  const outliers = () => {
    wells.map((well) => {
      Vue.set(well, 'outlier', false)
    })
    if (options.outlier.type === 'cv') {
      if (cv() >= options.outlier.threshold) {
        activeWells().map((well) => {
          Vue.set(well, 'outlier', true)
        })
      }
    }

    if (options.outlier.type === 'mad') {
      let median = Calculations.median(concentrations())
      let mad = Calculations.mad(concentrations())
      activeWells().map((well) => {
        let zscore = Calculations.modifiedZScores(
          well.concentration,
          median,
          mad
        )
        if (Calculations.isOutlier(zscore, options.outlier.threshold)) {
          Vue.set(well, 'outlier', true)
        }
      })
    }
  }

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
    barcode,
    outliers,
  }
}

// A JSON object to store the list of replicates
// The key is the well location

/**
 * @param {Object} options - Options which will be related to the type of assay and contain certain statistical parameters
 * @return {Object} list of Replicates
 * The key is the well location or the tube barcode
 **/
const ReplicateList = (options) => {
  // A map to provide easier access
  const items = new Map()

  /**
   * @return {Array} of all of the keys
   **/
  const keys = () => items.keys()

  /**
   * @return {Array} of all of the replicates
   **/
  const values = () => Array.from(items.values())

  /**
   * @param {String} key - The key of the replicate
   * @return {Array} of all of the keys
   **/
  const find = (key) => items.get(key)

  const size = () => items.size

  /**
   * @param {Object} well - The well to add
   * If the replicate with the key (id) of the well doesn't exist create it with the well added
   * If the replicate does exist add it
   **/
  const add = (well) => {
    let replicate
    replicate = find(well.id)
    if (replicate === undefined) {
      replicate = Replicate({ wells: [well], options })
      items.set(well.id, replicate)
    } else {
      replicate.add(well)
    }
    well.replicate = replicate
  }

  return {
    items,
    find,
    add,
    keys,
    values,
    size,
  }
}

export { defaultOptions, ReplicateList, Replicate, NullReplicate }
