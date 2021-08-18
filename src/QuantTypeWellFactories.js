// TODO: abstract out common behaviour, maybe turn into a DSL.
class PlateReader {
  constructor (cell = {}) {
    this.row = cell.row
    this.column = cell.column
    this.content = cell.content
    this.id = cell.id
    this.concentration = cell.concentration
  }
  get type () {
    return this.content.split(' ')[0] || 'Empty'
  }
  get json () {
    return {
      row: this.row,
      column: this.column,
      type: this.type,
      id: this.id,
      concentration: this.concentration
    }
  }
}

class QPCR10ul {
  constructor (cell = {}) {
    this.include = cell.include
    this.color = cell.color
    this.pos = cell.pos
    this.name = cell.name
    this.cp = cell.cp
    this.concentration = Number(cell.concentration)
    this.standard = cell.standard
    this.status = cell.status
  }
  get row () {
    return this.pos.match(/[a-zA-Z]+/g).toString()
  }
  get column () {
    return this.pos.match(/[0-9]+/g).toString()
  }
  isSample () {
    return /^[A-P]\d{1,2}$/.test(this.name)
  }
  get type () {
    return this.isSample() ? 'Sample' : 'Standard'
  }
  get id () {
    return this.isSample() ? this.name : ''
  }
  get json () {
    return {
      row: this.row,
      column: this.column,
      type: this.type,
      id: this.id,
      concentration: this.concentration
    }
  }
}

class QPCR5ul {
  constructor (cell = {}, wellMap = {}) {
    this.well = cell.well
    this.copyNumber = cell.copyNumber
    this.replicateError = cell.replicateError
    this.totalError = cell.totalError
    this.shapeZScore = cell.shapeZScore
    this.comments = cell.comments
    this.wellMap = wellMap
  }
  get row () {
    return this.well.match(/[a-zA-Z]+/g).toString()
  }
  get column () {
    return this.well.match(/[0-9]+/g).toString()
  }
  get id () {
    return this.wellMap[this.well]
  }
  get type () {
    return this.id ? 'Sample' : 'Empty'
  }
  get json () {
    return {
      row: this.row,
      column: this.column,
      type: this.type,
      id: this.id,
      concentration: Number(this.copyNumber)
    }
  }
}

class TS10XVDJ {
  constructor (cell = {}) {
    this.filename = cell.filename
    this.wellId = cell.wellId
    this.sampleDescription = cell.sampleDescription
    this.fromBasePair = cell.fromBasePair
    this.toBasePair = cell.toBasePair
    this.averageSizeBasePairs = cell.averageSizeBasePairs
    this.concentration = cell.concentration
    this.regionMolarity = cell.regionMolarity
    this.percentageOfTotal = cell.percentageOfTotal
    this.regionComment = cell.regionComment
  }
  get row () {
    return this.wellId.match(/^[A-P]/).toString()
  }
  get column () {
    return this.wellId.match(/[0-9]+$/).toString()
  }
  hasSample () {
    return /^[0-9.]+$/.test(this.regionMolarity)
  }
  get type () {
    return this.hasSample() ? 'Sample' : 'Empty'
  }
  get id () {
    return this.hasSample() ? this.wellId : ''
  }
  get json () {
    return {
      row: this.row,
      column: this.column,
      type: this.type,
      id: this.id,
      concentration: Number(this.regionMolarity)
    }
  }
}

export { PlateReader, QPCR10ul, QPCR5ul, TS10XVDJ }
