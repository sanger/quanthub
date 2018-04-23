
import { TriplicateList as Triplicates } from '@/lib/Triplicates'

class Plate {
  constructor (id) {
    this.id = id
    this._uuid = ''
    this.triplicates = new Triplicates()
  }

  get uuid () {
    return this._uuid
  }

  set uuid (uuid) {
    this._uuid = uuid
  }

  get metadata () {
    return {uuid: this.uuid, assay_type: 'Plate Reader', assay_version: 'v1.0'}
  }

  get json () {
    return this.triplicates.keys.map(key => Object.assign(this.triplicates.find(key).json, this.metadata))
  }

  get jsonApiData () {
    return {data: {attributes: this.json}}
  }

  get requestOptions () {
    return {url: '/qc_results', method: 'post', headers: {'Content-Type': 'application/vnd.api+json'}, baseURL: process.env.SEQUENCESCAPE_BASE_URL}
  }

  get request () {
    return Object.assign(this.requestOptions, this.jsonApiData)
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
