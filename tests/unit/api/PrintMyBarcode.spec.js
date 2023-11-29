import PrintJob from '@/api/PrintMyBarcode'
import { describe, expect, it, beforeEach } from 'vitest'

describe('PrintMyBarcode.js', () => {
  let printJob, date, json

  beforeEach(() => {
    date = new Date()
    json = {
      labelTemplateId: '175',
      printerName: 'f225bc',
      labels: {
        body: [
          {
            main_label: {
              top_left: date.getDate(),
              bottom_left: 'DN1234567',
              barcode: 'DN1234567',
            },
          },
        ],
      },
    }
    printJob = new PrintJob(json)
  })

  it('has a label template id', () => {
    expect(printJob.labelTemplateId).toEqual(json.labelTemplateId)
  })

  it('has a printer name', () => {
    expect(printJob.printerName).toEqual(json.printerName)
  })

  it('has some labels', () => {
    expect(printJob.labels).toEqual(json.labels)
  })
})
