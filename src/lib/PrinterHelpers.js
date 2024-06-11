/**
 * Filters a list of printers based on their `nonProductionPrinter` property and the `hideNonProductionPrinters` flag.
 *
 * @param {Object} params - The function parameters.
 * @param {Array} params.printers - The list of printers to filter. Each printer is an object with a `name` property and a `nonProductionPrinter` property.
 * @param {boolean} params.hideNonProductionPrinters - A flag indicating whether to hide printers that are not for production.
 *
 * @returns {Array} An array of printer names that meet the filter criteria.
 */
const filterPrintersByEnvironment = ({
  printers = [],
  hideNonProductionPrinters,
}) => {
  return printers
    .filter(
      (printer) =>
        !printer.nonProductionPrinter ||
        (printer.nonProductionPrinter && !hideNonProductionPrinters),
    )
    .map((printer) => printer.name)
}
export { filterPrintersByEnvironment }
