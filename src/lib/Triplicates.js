/*  Triplicates.js
    A library to manage the statistics for a triplicate of wells.
    The ultimate aim is to calculate the coefficient of variation (CV),
    a standardized measure of dispersion of a probability distribution or frequency distribution.
    In this case if a concentration in the triplicate is above a certain threshold e.g. 20% it is
    considered an outlier and can be removed from the triplicate.
*/

class Triplicate {
  constructor (wells = [], options = {}) {
    this.wells = wells
    this.options = Object.assign({
      key: 'Standard',
      units: 'standard',
      conversionFactor: 1,
      assay: {type: 'Standard', version: '1'}}, options)
    this.decimalPlaces = 3
  }

  get id () {
    if (this.empty()) return ''
    return this.wells[0].id
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
    return (this.average * this.options.conversionFactor).toFixed(this.decimalPlaces)
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
    return stdDev.toFixed(this.decimalPlaces)
  }

  get cv () {
    if (this.empty() || this.size === 1) return '0'
    return ((this.standardDeviation / this.average) * 100).toFixed(this.decimalPlaces)
  }

  get json () {
    return {
      well_location: this.id,
      key: this.options.key,
      value: this.adjustedAverage,
      units: this.options.units,
      cv: this.cv,
      assay_type: this.options.assay.type,
      assay_version: this.options.assay.version
    }
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
    return (this.wells.length === 0)
  }
}

// A JSON object to store the list of triplicates
// The key is the well location

class TriplicateList {
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
  // If it is found add the well as a new triplicate
  // If not create a new key.
  add (well) {
    let triplicate
    triplicate = this.find(well.id)
    if (triplicate === undefined) {
      triplicate = new Triplicate([well], this.options)
      this.items.set(well.id, triplicate)
    } else {
      triplicate.add(well)
    }
    well.triplicate = triplicate
    return this
  }

  find (key) {
    return this.items.get(key)
  }

  first () {
    return this.items.values().next().value
  }
}

export { TriplicateList, Triplicate }
