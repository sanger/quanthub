const SAMPLE_TYPE = 'Sample'
const STANDARD_TYPE = 'Standard'
const EMPTY_TYPE = 'Empty'

const splitWellName = (name) => {
  return {
    row: name.match(/[a-zA-Z]+/g).toString(),
    column: name.match(/[0-9]+/g).toString(),
  }
}

const PlateReader = ({ row, content, column, id, concentration }) => {
  const type = content.split(' ')[0] || EMPTY_TYPE

  return { row, column, type, id, concentration }
}

const QPCR10ul = ({ pos, name, concentration }) => {
  const isSample = /^[A-P]\d{1,2}$/.test(name)
  const type = isSample ? SAMPLE_TYPE : STANDARD_TYPE
  const id = isSample ? name : ''

  return {
    ...splitWellName(pos),
    type,
    id,
    concentration: Number(concentration),
  }
}

const QPCR5ul = ({ well, copyNumber }, wellMap = {}) => {
  const id = wellMap[well]
  const type = id ? SAMPLE_TYPE : EMPTY_TYPE

  return {
    ...splitWellName(well),
    type,
    id,
    concentration: Number(copyNumber),
  }
}

const TubeTapeStation = ({
  wellId,
  sampleDescription: id,
  regionMolarity: concentration,
}) => {
  return {
    ...splitWellName(wellId),
    type: SAMPLE_TYPE,
    id,
    concentration,
  }
}

export { PlateReader, QPCR10ul, QPCR5ul, TubeTapeStation }
