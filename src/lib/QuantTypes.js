class PlateReader {
  constructor(cell = {}) {
    this.row = cell.row
    this.column = cell.column
    this.content = cell.content
    this.id = cell.id
    this.concentration = cell.concentration
  }

  get type () {
    return this.content.split(' ')[0]
  }

}

class QPCR {
  constructor(cell = {}) {
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
    return this.pos[0]
  }

  get column () {
    return this.pos[1]
  }

  get type () {
    return this.isSample() ? 'Sample' : 'Standard'
  }

  isSample () {
    return /^[A-P]\d{1,2}$/.test(this.name)
  }

  get id () {
    return this.isSample() ? this.name : ''
  }

}

export { PlateReader, QPCR }