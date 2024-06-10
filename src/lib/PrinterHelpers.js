const filterPrintersByEnvironment = ({ printers = [], environment }) => {
  return printers
    .filter(
      (printer) =>
        !printer.hideInProduction ||
        (printer.hideInProduction && environment !== 'production'),
    )
    .map((printer) => printer.name)
}

export { filterPrintersByEnvironment }
