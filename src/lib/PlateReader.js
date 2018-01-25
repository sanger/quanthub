class Well {
  constructor(row, column, content, id, concentration, active=true) {
    this.row = row
    this.column = parseInt(column)
    this.content = content
    this.id = id
    this.concentration = parseFloat(concentration)
    this._active = active
  }

  get location() {
    return this.row.concat(this.column)
  }

  get type() {
    return this.content.split(' ')[0]
  }

  get active() {
    return this._active
  }

  set active(active) {
    this._active = active
  }
}

class Triplicate {
  constructor(well1, well2, well3) {
    this.wells = [well1, well2, well3]
  }

  get average() {
    return this.calculateAverage(this.activeWells().map(well => well.concentration))
  }

  get standardDeviation() {

    let average = this.average

    let squareDiffs = this.activeWells().map(function (well) {
      let diff = well.concentration - average
      let sqrDiff = diff * diff
      return sqrDiff
    })
    let avgSquareDiff = this.calculateAverage(squareDiffs)
    let stdDev = Math.sqrt(avgSquareDiff)
    return stdDev.toFixed(3)
  }

  get cv() {
    return ((this.standardDeviation / this.average) * 100).toFixed(3)
  }

  calculateAverage(values) {
    let sum = values.reduce(function (a, b) { return a + b })
    return (sum / values.length).toFixed(3)
  }

  activeWells() {
    return this.wells.filter(well => well.active)
  }

}

class Plate {
  constructor(wells) {
    this.wells = this.createWells(wells)
  }

  createWells(wells) {
    let _wells = []

    for (var well of wells) {
      _wells.push(new Well(well.row, well.column, well.content, well.id, well.concentration, well.active))
    }

    return _wells
  }

}

export  { Well, Triplicate, Plate };