const createLabels = (barcodes) => {
  const date = new Date()
  const dateString = date
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .replace(/ /g, '-')
    .toUpperCase()

  return barcodes.map((barcode) => ({
    label_name: 'main_label',
    top_left: dateString,
    bottom_left: barcode,
    barcode: barcode,
  }))
}

/**
 * Creates a print job with the provided printer and barcodes.
 *
 * @param {Object} options - The options for the print job.
 * @param {Object} options.printer - The printer to use for the print job.
 * @param {Array} options.barcodes - The barcodes to print.
 * @throws {Error} Will throw an error if the printer or barcodes are not provided.
 * @returns {Promise} A promise that resolves with the response from the print job API.
 */
const createPrintJob = async ({ printer, barcodes }) => {
  const errorMessages = []
  const toSentence = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() + '.'
  }

  if (!printer) {
    errorMessages.push('the printer must be provided')
  }

  if (!barcodes) {
    errorMessages.push('there must be at least one barcode')
  }

  if (errorMessages.length > 0) {
    throw new Error(toSentence(errorMessages.join(', ')))
  }

  const labels = createLabels(barcodes)
  const data = {
    printer_name: printer,
    label_template_name: 'sqsc_96plate_label_template_code128',
    labels,
    copies: '1',
  }
  return fetch(
    `${import.meta.env.VITE_PRINT_MY_BARCODE_BASE_URL}/v2/print_jobs`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        Accept: 'application/vnd.api+json',
      },
      body: JSON.stringify(data),
    },
  )
}

export { createPrintJob, createLabels }
