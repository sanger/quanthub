const createLabels = ({ printer, barcodes }) => {
  const date = new Date()
  const months = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ]
  const date_string = `${date.getDate().toString().padStart(2, '0')}-${
    months[date.getMonth()]
  }-${date.getFullYear()}`

  if (printer.name === 'toshiba') {
    barcodes.map((barcode) => {
      return {
        main_label: {
          top_left: date_string,
          bottom_left: barcode.concat('-QC'),
          barcode: barcode.concat('-QC'),
        },
      }
    })
  } else if (printer.name === 'squix') {
    return {
      // TODO
    }
  } else return []
}

const createPrintJob = async ({ printer, barcodes }) => {
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

export default createPrintJob
