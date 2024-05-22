const createLabels = ({ printer, barcodes }) => {
  const date = new Date()
  const dateString = date
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .replace(/ /g, '-')
    .toUpperCase()

  if (printer.name === 'toshiba') {
    return barcodes.map((barcode) => ({
      main_label: {
        top_left: dateString,
        bottom_left: barcode,
        barcode,
      },
    }))
  } else if (printer.name === 'squix') {
    const barcode = 'TEST'
    return {
      // TODO
      main_label: {
        top_left: dateString,
        bottom_left: barcode,
        barcode,
      },
    }
  } else return []
}

const createPrintJob = async ({ printer, barcodes }) => {
  if (!printer || !barcodes) {
    // TODO: Return an error here once we figure out the error handling
    return false
  }
  const labels = createLabels({ printer, barcodes })
  const response = await fetch(
    `${import.meta.env.VITE_PRINT_MY_BARCODE_BASE_URL}/v2`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        Accept: 'application/vnd.api+json',
      },
      body: {
        print_job: {
          printer_name: printer.name,
          // Template name is needed for squix and template id is needed for toshiba
          label_template_name: import.meta.env.VITE_LABEL_TEMPLATE_NAME,
          label_template_id: import.meta.env.VITE_LABEL_TEMPLATE_ID,
          labels,
        },
      },
    },
  )
  console.log(response)
}

export { createPrintJob, createLabels }
