class Triplicate {
  constructor (wells = []) {
    this.wells = wells
  }

  get activeWells () {
    return this.wells.filter(well => well.active)
  }

  get average () {
    if (this.empty()) return '0'
    return this.calculateAverage(this.activeWells.map(well => parseFloat(well.concentration)))
  }

  get standardDeviation () {
    if (this.empty()) return '0'
    let average = this.average

    let squareDiffs = this.activeWells.map(function (well) {
      let diff = well.concentration - average
      let sqrDiff = diff * diff
      return sqrDiff
    })
    let avgSquareDiff = this.calculateAverage(squareDiffs)
    let stdDev = Math.sqrt(avgSquareDiff)
    return stdDev.toFixed(3)
  }

  get cv () {
    if (this.empty()) return '0'
    return ((this.standardDeviation / this.average) * 100).toFixed(3)
  }

  calculateAverage (values) {
    let sum = values.reduce(function (a, b) { return a + b })
    return (sum / values.length).toFixed(3)
  }

  add (well) {
    this.wells.push(well)
  }

  empty () {
    return (this.wells.length === 0)
  }
}

class List {
  constructor () {
    this.items = {}
  }

  get keys () {
    return Object.keys(this.items)
  }

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

export { List, Triplicate }
