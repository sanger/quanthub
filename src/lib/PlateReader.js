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
  constructor(wells = []) {
    this.wells = wells
  }

  get average() {
    if(this.empty()) return '0'
    return this.calculateAverage(this.activeWells().map(well => well.concentration))
  }

  get standardDeviation() {
    if(this.empty()) return '0'
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
    if(this.empty()) return '0'
    return ((this.standardDeviation / this.average) * 100).toFixed(3)
  }

  calculateAverage(values) {
    let sum = values.reduce(function (a, b) { return a + b })
    return (sum / values.length).toFixed(3)
  }

  activeWells() {
    return this.wells.filter(well => well.active)
  }

  add(well) {
    this.wells.push(well)
  }

  empty() {
    return (this.wells.length == 0)
  }

}

class Triplicates {
  constructor() {
    this.items = {}
  }

  keys() {
    return Object.keys(this.items)
  }

  add(well) {
    let triplicate = this.find(well.id)
    if (triplicate === undefined) {
      this.items[well.id] = new Triplicate([well])
    } else {
      triplicate.add(well)
    }
    return this
  }

  find(key) {
    return this.items[key]
  }

  first() {
    return this.items[this.keys()[0]]
  }
}

class Plate {
  constructor(wells) {
    this.wells = this.createWells(wells)
    this.triplicates = this.createTriplicates()
  }

  createWells(wells) {
    let _wells = []

    for (var well of wells) {
      _wells.push(new Well(well.row, well.column, well.content, well.id, well.concentration, well.active))
    }

    return _wells
  }

  createTriplicates() {
    let triplicates = new Triplicates()
    for (let well of this.wells) {
      if (well.type == "Sample") {
        triplicates.add(well)
      }
    }
    return triplicates
  }

}

// expects data to contain objects with id property which should be a string.
// Empty strings are filtered out
function uniqueIds(data) {
  return  data.filter( function(obj) { return obj.id.length > 0})
                    .map( function(obj) { return obj.id})
                    .filter( function(value, index, self) { return self.indexOf(value) === index })
}

export  { Well, Triplicate, Plate, uniqueIds, Triplicates };