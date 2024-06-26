import QuantFile from '@/components/QuantFile.vue'
import { mount } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import fs from 'fs'
import { beforeEach, describe, expect, it } from 'vitest'

describe('QuantFile.vue', () => {
  let cmp, quantFile, plate, file

  describe('upload', () => {
    describe('csv', () => {
      beforeEach(async () => {
        cmp = mount(QuantFile, {
          props: {
            quant: 'libraryPlateReader',
          },
        })
        quantFile = cmp.vm
        plate = fs.readFileSync('./tests/data/plate_reader.csv', 'ascii')
        file = new File([plate], 'plate1.csv', { type: 'text/csv' })
      })

      it('resolves', async () => {
        expect.assertions(1)
        await expect(quantFile.upload(file)).resolves.toEqual(
          'File successfully uploaded',
        )
      })

      describe('successful', () => {
        let rows

        beforeEach(async () => {
          quantFile.upload(file)
          rows = plate.split('\n')
          await flushPromises()
          await flushPromises()
        })

        it('will have some csv', () => {
          expect(quantFile.raw).toEqual(plate)
        })

        it('transforms wells into correct format', () => {
          let row = rows[quantFile.quantType.parse.from].split(
            quantFile.quantType.parse.delimiter,
          )
          let well = quantFile.json.rows[row[0]][row[1]]

          expect(well.row).toBeDefined()
          expect(well.column).toBeDefined()
          expect(well.type).toBeDefined()
          expect(well.id).toBeDefined()
          expect(well.concentration).toBeDefined()

          row = rows[rows.length - (quantFile.quantType.parse.from - 1)].split(
            quantFile.quantType.parse.delimiter,
          )
          well = quantFile.json.rows[row[0]][row[1]]
          expect(well.row).toBeDefined()
          expect(well.type).toBeDefined()
          expect(well.id).toBeDefined()
          expect(well.concentration).toBeDefined()
        })

        it('produces some json', () => {
          const json = quantFile.json['rows']
          let row = rows[quantFile.quantType.parse.from].split(
            quantFile.quantType.parse.delimiter,
          )
          expect(json[row[0]][row[1]].row).toEqual(row[0])
          expect(json[row[0]][row[1]].column).toEqual(row[1])

          row = rows[rows.length - (quantFile.quantType.parse.from - 1)].split(
            quantFile.quantType.parse.delimiter,
          )
          expect(json[row[0]][row[1]].row).toEqual(row[0])
          expect(json[row[0]][row[1]].column).toEqual(row[1])
        })

        it('generates a plate of the expected size', () => {
          expect(Object.keys(quantFile.json.rows).length).toEqual(16)
          expect(quantFile.json.columns.length).toEqual(24)
        })

        it('creates some metadata', () => {
          const metadata = quantFile.metadata
          expect(metadata.User).toEqual('SANGER')
          expect(metadata.ID1).toEqual('SQPU-570-15-B-QC')
        })

        it('has an id', () => {
          expect(quantFile.id).toEqual('SQPU-570-15-B')
        })
      })
    })

    describe('csv_with_underscore_id', () => {
      beforeEach(async () => {
        cmp = mount(QuantFile, {
          props: {
            quant: 'libraryPlateReader',
          },
        })
        quantFile = cmp.vm

        plate = fs.readFileSync(
          './tests/data/plate_reader_underscore.csv',
          'ascii',
        )
        file = new File([plate], 'plate1_underscore.csv', { type: 'text/csv' })
      })

      it('resolves', async () => {
        expect.assertions(1)
        await expect(quantFile.upload(file)).resolves.toEqual(
          'File successfully uploaded',
        )
      })

      describe('successful', () => {
        beforeEach(async () => {
          quantFile.upload(file)
          await flushPromises()
          await flushPromises()
        })

        it('creates some metadata', () => {
          const metadata = quantFile.metadata
          expect(metadata.User).toEqual('SANGER')
          expect(metadata.ID1).toEqual('SQPU-570-15-B_QC')
        })

        it('has an id', () => {
          expect(quantFile.id).toEqual('SQPU-570-15-B')
        })
      })
    })

    describe('text tab delimited', () => {
      beforeEach(async () => {
        cmp = mount(QuantFile, {
          props: {
            quant: 'libraryQPCR10ul',
          },
        })
        quantFile = cmp.vm
        plate = fs.readFileSync('./tests/data/qPCR.txt', 'ascii')
        file = new File([plate], 'plate2.txt', { type: 'text/plain' })
      })

      it('resolves', async () => {
        expect.assertions(1)
        await expect(quantFile.upload(file)).resolves.toEqual(
          'File successfully uploaded',
        )
      })

      describe('successful', () => {
        beforeEach(async () => {
          quantFile.upload(file)
          await flushPromises()
          await flushPromises()
        })

        it('will have some text', () => {
          expect(quantFile.raw).toEqual(plate)
        })

        it('has an id', () => {
          expect(quantFile.id).toEqual('DN1234567')
        })
      })

      describe('file with windows line feeds i.e \r\n\n', () => {
        beforeEach(async () => {
          plate = fs.readFileSync('./tests/data/qPCR_blank_lines.txt', 'ascii')
          file = new File([plate], 'plate2.txt', { type: 'text/plain' })
        })

        it('resolves', async () => {
          expect.assertions(1)
          await expect(quantFile.upload(file)).resolves.toEqual(
            'File successfully uploaded',
          )
        })
      })

      // This type of file errors even though it doesn't seem to have extra columns
      describe('file with extra columns', () => {
        beforeEach(() => {
          plate = fs.readFileSync(
            './tests/data/qPCR_extra_columns.txt',
            'ascii',
          )
          file = new File([plate], 'plate3.txt', { type: 'text/plain' })
        })

        it('resolves', async () => {
          expect.assertions(1)
          await expect(quantFile.upload(file)).resolves.toEqual(
            'File successfully uploaded',
          )
        })
      })
    })
  })

  describe.each([
    ['DN123456', 'DN123456_DN123456-QC_XYZ_results.csv'],
    ['DN123456', 'DN123456_DN123456_QC_XYZ_results.csv'],
    ['TEST-1234-56-W', 'TEST-1234-56-W_TEST-1234-56-W-QC_XYZ_results.csv'],
  ])(
    'csv with filename and no metadata with barcode %s',
    (barcode, filename) => {
      beforeEach(async () => {
        cmp = mount(QuantFile, {
          props: {
            quant: 'libraryQPCR5ul',
            filename: filename,
          },
        })
        quantFile = cmp.vm
        plate = fs.readFileSync(`./tests/data/${filename}`, 'ascii')
        file = new File([plate], filename, {
          type: 'text/plain',
        })
      })

      it('will have a filename', () => {
        expect(quantFile.filename).toEqual(filename)
      })

      it('will have a parsed filename', () => {
        expect(quantFile.parsedFilename).toEqual(barcode)
      })

      it('resolves', async () => {
        expect.assertions(1)
        await expect(quantFile.upload(file)).resolves.toEqual(
          'File successfully uploaded',
        )
      })

      describe('successful', () => {
        beforeEach(async () => {
          quantFile.upload(file)
          await flushPromises()
          await flushPromises()
        })

        it('will have some text', () => {
          expect(quantFile.raw).toEqual(plate)
        })

        it('has an id', () => {
          expect(quantFile.id).toEqual(barcode)
        })

        it('should have some empty cells', () => {
          expect(quantFile.json.rows['B']['1'].type === 'Empty').toBeTruthy()
          expect(quantFile.json.rows['P']['23'].type === 'Empty').toBeTruthy()
        })
      })
    },
  )

  describe('qPCR 5ul quadruplicate', () => {
    beforeEach(async () => {
      cmp = mount(QuantFile, {
        props: {
          quant: 'libraryQPCR5ulQuadruplicate',
          filename: 'DN601493J_DN601493J-QC_n_4_M4_B5__results.csv',
        },
      })
      quantFile = cmp.vm
      plate = fs.readFileSync(
        './tests/data/DN601493J_DN601493J-QC_n_4_M4_B5__results.csv',
        'ascii',
      )
      file = new File(
        [plate],
        'DN601493J_DN601493J-QC_n_4_M4_B5__results.csv',
        { type: 'text/plain' },
      )
    })

    it('will have a filename', () => {
      expect(quantFile.filename).toEqual(
        'DN601493J_DN601493J-QC_n_4_M4_B5__results.csv',
      )
    })

    it('will have a parsed filename', () => {
      expect(quantFile.parsedFilename).toEqual('DN601493J')
    })

    it('resolves', async () => {
      expect.assertions(1)
      await expect(quantFile.upload(file)).resolves.toEqual(
        'File successfully uploaded',
      )
    })

    describe('successful', () => {
      beforeEach(async () => {
        quantFile.upload(file)
        await flushPromises()
        await flushPromises()
      })

      it('will have some text', () => {
        expect(quantFile.raw).toEqual(plate)
      })

      it('has an id', () => {
        expect(quantFile.id).toEqual('DN601493J')
      })

      it('should fill all of the cells correctly', () => {
        const expectation = Object.values(quantFile.json.rows).every((row) => {
          return Object.values(row).every((well) => well.type === 'Sample')
        })
        expect(expectation).toBeTruthy()
      })
    })
  })

  describe('Heron TapeStation Tubes', () => {
    beforeEach(async () => {
      plate = fs.readFileSync(
        './tests/data/DN000000  - 2021-08-25 - 10-54-08-D5000_compactRegionTable - DN000000 - 2021-08-25 - 10-54-08-D5000_compactRegionTable.csv',
        'ascii',
      )
    })

    describe('with a valid filename', () => {
      beforeEach(async () => {
        cmp = mount(QuantFile, {
          props: {
            quant: 'heronTubeTapeStation',
            filename:
              'DN000000 - 2021-08-25 - 10-54-08-D5000_compactRegionTable.csv',
          },
        })
        quantFile = cmp.vm
      })

      it('will have a filename', () => {
        expect(quantFile.filename).toEqual(
          'DN000000 - 2021-08-25 - 10-54-08-D5000_compactRegionTable.csv',
        )
      })

      it('will have a barcode from file name', () => {
        expect(quantFile.barcodeFromFileName).toMatch(
          /210825-105408-[0-9a-f]{6}/,
        )
      })

      describe('on upload', () => {
        beforeEach(async () => {
          file = new File(
            [plate],
            'DN000000 - 2021-08-25 - 10-54-08-D5000_compactRegionTable.csv',
            { type: 'text/plain' },
          )

          quantFile.upload(file)
          await flushPromises()
          await flushPromises()
        })

        it('generates an id equal to the barcode from file name', () => {
          expect(quantFile.id).toEqual(quantFile.barcodeFromFileName)
        })

        it('generates a plate of the expected size', () => {
          expect(Object.keys(quantFile.json.rows)).toHaveLength(8)
          Object.values(quantFile.json.rows).forEach((row) => {
            expect(Object.keys(row)).toHaveLength(12)
          })
        })
      })
    })

    describe('with an invalid filename', () => {
      beforeEach(async () => {
        cmp = mount(QuantFile, {
          props: {
            quant: 'heronTubeTapeStation',
            filename: 'DN000000 - no_date_here.csv',
          },
        })
        quantFile = cmp.vm
      })

      it('will have a filename', () => {
        expect(quantFile.filename).toEqual('DN000000 - no_date_here.csv')
      })

      it('will not generate a barcode from the filename', () => {
        expect(quantFile.barcodeFromFileName).toBeNull()
      })

      describe('on upload', () => {
        let uploadError

        beforeEach(async () => {
          file = new File([plate], 'DN000000 - no_date_here.csv', {
            type: 'text/plain',
          })

          quantFile.upload(file).catch((error) => {
            uploadError = error
          })
          await flushPromises()
          await flushPromises()
        })

        it('rejects the file', () => {
          expect(uploadError).toEqual(
            'Filename must contain date/time, similar to "2021-02-26 - 13-45-00"',
          )
        })
      })
    })
  })
})
