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
  // return an error that can be consumed by a vue component for display to the user
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
          label_template_name: import.meta.env.VITE_LABEL_TEMPLATE_NAME_SQUIX,
          label_template_id: import.meta.env.VITE_LABEL_TEMPLATE_ID_TOSHIBA,
          labels,
        },
      },
    },
  )
  console.log(response)
}

export { createPrintJob, createLabels }
