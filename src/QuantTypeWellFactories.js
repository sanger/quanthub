/**
 * Indicates a well containing a sample which will be subject to QC
 * Will use: src/components/wells/Sample.vue
 * @constant {string} */
const SAMPLE_TYPE = 'Sample'

/**
 * Indicates a well containing a standard, used to calibrate the curve
 * Will use: src/components/wells/Standard.vue
 * @constant {string} */
const STANDARD_TYPE = 'Standard'

/**
 * Indicates an empty well
 * Will use: src/components/wells/Empty.vue
 * @constant {string} */
const EMPTY_TYPE = 'Empty'

/**
 * A location
 * @typedef {{column: string, row: string}} WellLocation
 */

/**
 * Splits a well name (eg. A12) into its column and row components
 *
 * @param {string} name - The name of the well (eg. 'A12')
 * @return {WellLocation} The {@link WellLocation} of the well (eg. { row: 'A', column: '1' })
 */
const splitWellName = (name) =>
  name.match(/(?<row>[a-zA-Z]+)(?<column>\d+)/).groups

/**
 * Collects the information extracted for a well
 *
 * @typedef {Object} Well
 * @property {string} row - The well's row (eg. 'A')
 * @property {string} column - The well's column (eg. '1')
 * @property {string} type - The partial to yse for the well (eg. 'Sample')
 * @property {string} id - Identifies the original well or tube this well maps back to
 * @property {number} concentration - The qc reading for the well
 */

/**
 * Processes the results of parsing a Plate reader CSV and returns a {@link Well}
 *
 * @param {Object} obj - Object extracted from a CSV row.
 * @param {string} obj.row - The well's row (eg. 'A')
 * @param {string} obj.column - The well's column (eg. '1')
 * @param {string} obj.content - Contents of the Content column (used to work out
 *                              if we have a control or sample)
 * @param {string} obj.id - Identifies the original well or tube this well maps back to
 * @param {number} obj.concentration - The qc reading for the well
 * @return {Well} The {@link Well} extracted from the csv data
 */
const PlateReader = ({ row, column, content, id, concentration }) => {
  const type = content.split(' ')[0] || EMPTY_TYPE

  return { row, column, type, id, concentration }
}

/**
 * Processes the results of parsing a 10ul QPCR CSV and returns a {@link Well}
 *
 * @param {Object} obj - Object extracted from a CSV row.
 * @param {string} obj.name - The well's name (eg. 'A1')
 * @param {string} obj.concentration - The qc reading for the well
 * @return {Well} The {@link Well} extracted from the csv data
 */
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

/**
 * Processes the results of parsing a 5ul QPCR CSV and returns a {@link Well}
 *
 * @param {Object} obj - Object extracted from a CSV row.
 * @param {string} obj.well - The well's name (eg. 'A1')
 * @param {string} obj.copyNumber - The qc reading for the well
 * @param {Object} wellMap - Object mapping wells on the assay plate back to the
 *                           original
 * @return {Well} The {@link Well} extracted from the csv data
 */
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

/**
 * Processes the results of parsing a TapeStation CSV and returns a {@link Well}
 *
 * @param {Object} obj - Object extracted from a CSV row.
 * @param {string} obj.wellId - The well's name (eg. 'A1')
 * @param {string} obj.sampleDescription - The barcode of the tube corresponding
 *                                         to the well
 * @param {string} obj.regionMolarity - The qc reading for the well
 * @return {Well} The {@link Well} extracted from the csv data
 */
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
