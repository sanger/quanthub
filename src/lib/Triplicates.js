/*  Triplicates.js
    A library to manage the statistics for a triplicate of wells.
    The ultimate aim is to calculate the coefficient of variation (CV),
    a standardized measure of dispersion of a probability distribution or frequency distribution.
    In this case if a concentration in the triplicate is above a certain threshold e.g. 20% it is
    considered an outlier and can be removed from the triplicate.
*/

class Triplicate {
  constructor (wells = []) {
    this.wells = wells
  }

  get id () {
    if (this.empty()) return ''
    return this.wells[0].id
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

  // PCR WGS Av. lib. size bp = 585 bp
  get nM () {
    if (this.empty()) return '0'
    return ((this.average) * ((1000000 / 660) * (1 / 585))).toFixed(3)
  }

  // Should be sample standard deviation i.e. average square difference
  // calculated as N - 1
  get standardDeviation () {
    if (this.empty()) return '0'
    let average = this.average

    let squareDiffs = this.activeWells.map(function (well) {
      let diff = well.concentration - average
      let sqrDiff = diff * diff
      return sqrDiff
    })
    let avgSquareDiff = this.calculateAverage(squareDiffs, 1)
    let stdDev = Math.sqrt(avgSquareDiff)
    return stdDev.toFixed(3)
  }

  get cv () {
    if (this.empty()) return '0'
    return ((this.standardDeviation / this.average) * 100).toFixed(3)
  }

  get json () {
    return { well_location: this.id, key: 'Molarity', value: this.nM, units: 'nM', cv: this.cv }
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
  constructor () {
    this.items = {}
  }

  get keys () {
    return Object.keys(this.items)
  }

  get length () {
    return this.keys.length
  }

  // Try and find the well id in the list.
  // If it is found add the well as a new triplicate
  // If not create a new key.
  add (well) {
    let triplicate
    triplicate = this.find(well.id)
    if (triplicate === undefined) {
      triplicate = new Triplicate([well])
      this.items[well.id] = triplicate
    } else {
      triplicate.add(well)
    }
    well.triplicate = triplicate
    return this
  }

  find (key) {
    return this.items[key]
  }

  first () {
    return this.items[this.keys[0]]
  }
}

export { TriplicateList, Triplicate }
