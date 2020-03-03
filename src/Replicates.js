/*  Replicates.js
    A library to manage the statistics for a replicate of wells.
    The ultimate aim is to calculate the coefficient of variation (CV),
    a standardized measure of dispersion of a probability distribution or frequency distribution.
    In this case if a concentration in the replicate is above a certain threshold e.g. 20% it is
    considered an outlier and can be removed from the replicate.
*/

const NullReplicate = {
  size: 0,
  needsInspection () { return false }
}

class Replicate {
  constructor (wells = [], options = {}) {
    this.wells = wells
    this.options = Object.assign({
      key: 'Standard',
      units: 'standard',
      conversionFactor: 1,
      cvThreshold: 1,
      assay: {type: 'Standard', version: '1'},
      decimalPlaces: 3}, options)
  }

  get id () {
    return this.wells[0].id
  }

  get plateBarcode () {
    return this.wells[0].plateBarcode
  }

  get size () {
    return this.activeWells.length
  }

  // If a well is not active it should not be considered as part of the
  // statistical calculation
  // If a well has a concentration of n.a. this throws an error so it needs
  // to be excluded
  get activeWells () {
    return this.wells.filter(well => (well.isActive && well.concentration !== 'n.a.'))
  }

  get average () {
    if (this.empty()) return '0'
    return this.calculateAverage(this.activeWells.map(well => parseFloat(well.concentration)))
  }

  get adjustedAverage () {
    if (this.empty()) return '0'
    return (this.average * this.options.conversionFactor).toFixed(this.options.decimalPlaces)
  }

  // Should be sample standard deviation i.e. average square difference
  // calculated as N - 1
  get standardDeviation () {
    if (this.empty() || this.size === 1) return '0'

    let average = this.average

    let squareDiffs = this.activeWells.map(function (well) {
      let diff = well.concentration - average
      let sqrDiff = diff * diff
      return sqrDiff
    })
    let avgSquareDiff = this.calculateAverage(squareDiffs, 1)
    let stdDev = Math.sqrt(avgSquareDiff)
    return stdDev.toFixed(this.options.decimalPlaces)
  }

  get cv () {
    if (this.empty() || this.size === 1 || Number(this.standardDeviation) === 0) return '0'
    return ((this.standardDeviation / this.average) * 100).toFixed(this.options.decimalPlaces)
  }

  get json () {
    return {
      barcode: this.plateBarcode,
      well_location: this.id,
      key: this.options.key,
      value: this.adjustedAverage,
      units: this.options.units,
      cv: this.cv,
      assay_type: this.options.assay.type,
      assay_version: this.options.assay.version
    }
  }

  get cvThreshold () {
    return this.options.cvThreshold
  }

  // sample represents whether the average needs to be adjusted if
  // it is from a sample. This is important for calculating sample
  // standard deviation
  calculateAverage (values, sample = 0) {
    let sum = values.reduce(function (a, b) { return a + b })
    return (sum / (values.length - sample)).toFixed(3)
  }

  add (well) {
    this.wells.push(well)
  }

  empty () {
    return (this.wells.length === 0 || this.size === 0)
  }

  needsInspection () {
    return this.cv >= this.cvThreshold
  }
}

// A JSON object to store the list of replicates
// The key is the well location

class ReplicateList {
  constructor (options = {}) {
    this.items = new Map()
    this.options = options
  }

  get keys () {
    return this.items.keys()
  }

  get size () {
    return this.items.size
  }

  get values () {
    return Array.from(this.items.values())
  }

  // Try and find the well id in the list.
  // If it is found add the well as a new replicate
  // If not create a new key.
  add (well) {
    let replicate
    replicate = this.find(well.id)
    if (replicate === undefined) {
      replicate = new Replicate([well], this.options)
      this.items.set(well.id, replicate)
    } else {
      replicate.add(well)
    }
    well.replicate = replicate
    return this
  }

  find (key) {
    return this.items.get(key)
  }

  first () {
    return this.items.values().next().value
  }
}

export { ReplicateList, Replicate, NullReplicate }
