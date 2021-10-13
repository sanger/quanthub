const PlateReader = ({ row, content, column, id, concentration }) => {
  const type = content.split(' ')[0] || 'Empty'

  return {
    row,
    column,
    type,
    id,
    concentration,
  }
}

const QPCR10ul = ({ pos, name, concentration }) => {
  const row = pos.match(/[a-zA-Z]+/g).toString()
  const column = pos.match(/[0-9]+/g).toString()
  const isSample = /^[A-P]\d{1,2}$/.test(name)
  const type = isSample ? 'Sample' : 'Standard'
  const id = isSample ? name : ''

  return {
    row,
    column,
    type,
    id,
    concentration: Number(concentration),
  }
}

const QPCR5ul = ({ well, copyNumber }, wellMap = {}) => {
  const row = well.match(/[a-zA-Z]+/g).toString()
  const column = well.match(/[0-9]+/g).toString()
  const id = wellMap[well]
  const type = id ? 'Sample' : 'Empty'

  return {
    row,
    column,
    type,
    id,
    concentration: Number(copyNumber),
  }
}

const TubeTapeStation = ({ wellId, sampleDescription, regionMolarity }) => {
  const well = wellId
  const id = sampleDescription
  const concentration = regionMolarity
  const row = well.match(/[a-zA-Z]+/g).toString()
  const column = well.match(/[0-9]+/g).toString()
  const type = 'Sample'

  return {
    row,
    column,
    type,
    id,
    concentration,
  }
}

export { PlateReader, QPCR10ul, QPCR5ul, TubeTapeStation }
