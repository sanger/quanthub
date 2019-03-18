
import { TriplicateList as Triplicates } from '@/Triplicates'

class Plate {
  constructor (barcode) {
    this.barcode = barcode
    this.triplicates = new Triplicates()
  }
}

// TODO: turn into a map
class SequencescapePlateList {
  constructor () {
    this.items = {}
  }

  get keys () {
    return Object.keys(this.items)
  }

  get length () {
    return this.keys.length
  }

  add (plate) {
    this.items[plate.barcode] = plate
    return this
  }

  addTriplicate (well) {
    this.find(well.plateBarcode).triplicates.add(well)
  }

  find (key) {
    let plate = this.items[key]
    if (plate === undefined) {
      return new Plate('empty')
    } else {
      return this.items[key]
    }
  }
}

export { SequencescapePlateList }
