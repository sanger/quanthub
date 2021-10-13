import { ReplicateList as Replicates } from '@/Replicates'

class Plate {
  constructor(barcode) {
    this.barcode = barcode
    this.replicates = new Replicates()
  }
}

// TODO: turn into a map
class SequencescapePlateList {
  constructor() {
    this.items = {}
  }

  get keys() {
    return Object.keys(this.items)
  }

  get length() {
    return this.keys.length
  }

  add(plate) {
    this.items[plate.barcode] = plate
    return this
  }

  addReplicate(well) {
    this.find(well.plateBarcode).replicates.add(well)
  }

  find(key) {
    let plate = this.items[key]
    if (plate === undefined) {
      return new Plate('empty')
    } else {
      return this.items[key]
    }
  }
}

export { SequencescapePlateList }
