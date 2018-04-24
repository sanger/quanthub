
import { TriplicateList as Triplicates } from '@/lib/Triplicates'

class Plate {
  constructor (id) {
    this.id = id
    this.triplicates = new Triplicates()
  }
}

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
    this.items[plate.id] = plate
    return this
  }

  addTriplicate (well) {
    this.find(well.plateId).triplicates.add(well)
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

export { SequencescapePlateList, Plate }
