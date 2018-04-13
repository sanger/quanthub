
import { TriplicateList as Triplicates } from '@/lib/Triplicates'
import axios from 'axios'

class Plate {
  constructor (id) {
    this.id = id
    this.triplicates = new Triplicates()
  }

  // TODO: I can't seem to get this to work with catching errors and I don't know why!!!!
  get uuid () {
    return axios.get(`${process.env.QUANTESSENTIAL_BASE_URL}/quants/${this.id}/input.txt`).then(response => response.data)
  }

  get metadata () {
    return {uuid: this.uuid, assay_type: 'Plate Reader', assay_version: 'v1.0'}
  }

  get json () {
    return this.triplicates.keys.map(key => Object.assign(this.triplicates.find(key).json, this.metadata))
  }

  export () {
    return axios({
      url: '/qc_results',
      method: 'post',
      headers: {'content-type': 'application/vnd.api+json'},
      data: {
        data: {
          attributes: this.json
        }
      }
    }).then(response => response)
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
