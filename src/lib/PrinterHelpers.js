/**
 * Given a comma-separated string of printer names, returns an array of printer names.
 *
 * @param {string} printers - A comma-separated string of printer names.
 * @returns {Array} An array of printer names.
 */
const parseCustomPrinters = (printers = '') => {
  return printers
    .split(',')
    .map((printer) => printer.trim())
    .filter((printer) => printer.length > 0)
}

export { parseCustomPrinters }
