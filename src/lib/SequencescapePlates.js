
import { TriplicateList as Triplicates } from '@/lib/Triplicates'
import axios from 'axios'

class Plate {
  constructor (id) {
    this.id = id
    this.triplicates = new Triplicates()
  }

  get uuid () {
    return axios.get(`${process.env.QUANTESSENTIAL_BASE_URL}/quants/${this.id}/input.txt`).then(resp => resp.data)
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

  add (id) {
    let plate = new Plate(id)
    this.items[id] = plate
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
