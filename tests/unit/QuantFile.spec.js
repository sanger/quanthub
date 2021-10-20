import Vue from 'vue'
import QuantFile from '@/components/QuantFile'
import flushPromises from 'flush-promises'
import fs from 'fs'

describe('QuantFile.vue', () => {
  let cmp, quantFile, plate, file

  beforeEach(() => {
    cmp = Vue.extend(QuantFile)
  })

  describe('upload', () => {
    describe('csv', () => {
      beforeEach(async () => {
        quantFile = new cmp({ propsData: { quant: 'libraryPlateReader' } })
        plate = fs.readFileSync('./tests/data/plate_reader.csv', 'ascii')
        file = new File([plate], 'plate1.csv', { type: 'text/csv' })
      })

      it('resolves', async () => {
        expect.assertions(1)
        await expect(quantFile.upload(file)).resolves.toEqual(
          'File successfully uploaded'
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
            quantFile.quantType.parse.delimiter
          )
          let well = quantFile.json.rows[row[0]][row[1]]

          expect(well.row).toBeDefined()
          expect(well.column).toBeDefined()
          expect(well.type).toBeDefined()
          expect(well.id).toBeDefined()
          expect(well.concentration).toBeDefined()

          row = rows[rows.length - (quantFile.quantType.parse.from - 1)].split(
            quantFile.quantType.parse.delimiter
          )
          well = quantFile.json.rows[row[0]][row[1]]
          expect(well.row).toBeDefined()
          expect(well.type).toBeDefined()
          expect(well.id).toBeDefined()
          expect(well.concentration).toBeDefined()
        })

        it('produces some json', () => {
          let json = quantFile.json['rows']
          let row = rows[quantFile.quantType.parse.from].split(
            quantFile.quantType.parse.delimiter
          )
          expect(json[row[0]][row[1]].row).toEqual(row[0])
          expect(json[row[0]][row[1]].column).toEqual(row[1])

          row = rows[rows.length - (quantFile.quantType.parse.from - 1)].split(
            quantFile.quantType.parse.delimiter
          )
          expect(json[row[0]][row[1]].row).toEqual(row[0])
          expect(json[row[0]][row[1]].column).toEqual(row[1])
        })

        it('generates a plate of the expected size', () => {
          expect(Object.keys(quantFile.json.rows).length).toEqual(16)
          expect(quantFile.json.columns.length).toEqual(24)
        })

        it('creates some metadata', () => {
          let metadata = quantFile.metadata
          expect(metadata.User).toEqual('SANGER')
          expect(metadata.ID1).toEqual('DN1234567-QC')
        })

        it('has an id', () => {
          expect(quantFile.id).toEqual('DN1234567')
        })
      })
    })

    describe('csv_with_underscore_id', () => {
      beforeEach(async () => {
        quantFile = new cmp({ propsData: { quant: 'libraryPlateReader' } })
        plate = fs.readFileSync(
          './tests/data/plate_reader_underscore.csv',
          'ascii'
        )
        file = new File([plate], 'plate1_underscore.csv', { type: 'text/csv' })
      })

      it('resolves', async () => {
        expect.assertions(1)
        await expect(quantFile.upload(file)).resolves.toEqual(
          'File successfully uploaded'
        )
      })

      describe('successful', () => {
        beforeEach(async () => {
          quantFile.upload(file)
          await flushPromises()
          await flushPromises()
        })

        it('creates some metadata', () => {
          let metadata = quantFile.metadata
          expect(metadata.User).toEqual('SANGER')
          expect(metadata.ID1).toEqual('DN1234567_QC')
        })

        it('has an id', () => {
          expect(quantFile.id).toEqual('DN1234567')
        })
      })
    })

    describe('text tab delimited', () => {
      beforeEach(async () => {
        quantFile = new cmp({ propsData: { quant: 'libraryQPCR10ul' } })
        plate = fs.readFileSync('./tests/data/qPCR.txt', 'ascii')
        file = new File([plate], 'plate2.txt', { type: 'text/plain' })
      })

      it('resolves', async () => {
        expect.assertions(1)
        await expect(quantFile.upload(file)).resolves.toEqual(
          'File successfully uploaded'
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
            'File successfully uploaded'
          )
        })
      })

      // This type of file errors even though it doesn't seem to have extra columns
      describe('file with extra columns', () => {
        beforeEach(() => {
          plate = fs.readFileSync(
            './tests/data/qPCR_extra_columns.txt',
            'ascii'
          )
          file = new File([plate], 'plate3.txt', { type: 'text/plain' })
        })

        it('resolves', async () => {
          expect.assertions(1)
          await expect(quantFile.upload(file)).resolves.toEqual(
            'File successfully uploaded'
          )
        })
      })
    })
  })

  describe('csv with filename and no metadata', () => {
    beforeEach(async () => {
      quantFile = new cmp({
        propsData: {
          quant: 'libraryQPCR5ul',
          filename: 'DN123456_DN123456-QC_XYZ_results.csv',
        },
      })
      plate = fs.readFileSync(
        './tests/data/DN123456_DN123456-QC_XYZ_results.csv',
        'ascii'
      )
      file = new File([plate], 'DN123456_DN123456-QC_XYZ_results.csv', {
        type: 'text/plain',
      })
    })

    it('will have a filename', () => {
      expect(quantFile.filename).toEqual('DN123456_DN123456-QC_XYZ_results.csv')
    })

    it('will have a parsed filename', () => {
      expect(quantFile.parsedFilename).toEqual('DN123456')
    })

    it('resolves', async () => {
      expect.assertions(1)
      await expect(quantFile.upload(file)).resolves.toEqual(
        'File successfully uploaded'
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
        expect(quantFile.id).toEqual('DN123456')
      })
    })
  })

  describe('csv with filename and no metadata and underscore barcode', () => {
    beforeEach(async () => {
      quantFile = new cmp({
        propsData: {
          quant: 'libraryQPCR5ul',
          filename: 'DN123456_DN123456_QC_XYZ_results.csv',
        },
      })
      plate = fs.readFileSync(
        './tests/data/DN123456_DN123456_QC_XYZ_results.csv',
        'ascii'
      )
      file = new File([plate], 'DN123456_DN123456_QC_XYZ_results.csv', {
        type: 'text/plain',
      })
    })

    it('will have a filename', () => {
      expect(quantFile.filename).toEqual('DN123456_DN123456_QC_XYZ_results.csv')
    })

    it('will have a parsed filename', () => {
      expect(quantFile.parsedFilename).toEqual('DN123456')
    })

    it('resolves', async () => {
      expect.assertions(1)
      await expect(quantFile.upload(file)).resolves.toEqual(
        'File successfully uploaded'
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
        expect(quantFile.id).toEqual('DN123456')
      })

      it('should have some empty cells', () => {
        expect(quantFile.json.rows['B']['1'].type === 'Empty').toBeTruthy()
        expect(quantFile.json.rows['P']['23'].type === 'Empty').toBeTruthy()
      })
    })
  })

  describe('qPCR 5ul quadruplicate', () => {
    beforeEach(async () => {
      quantFile = new cmp({
        propsData: {
          quant: 'libraryQPCR5ulQuadruplicate',
          filename: 'DN601493J_DN601493J-QC_n_4_M4_B5__results.csv',
        },
      })
      plate = fs.readFileSync(
        './tests/data/DN601493J_DN601493J-QC_n_4_M4_B5__results.csv',
        'ascii'
      )
      file = new File(
        [plate],
        'DN601493J_DN601493J-QC_n_4_M4_B5__results.csv',
        { type: 'text/plain' }
      )
    })

    it('will have a filename', () => {
      expect(quantFile.filename).toEqual(
        'DN601493J_DN601493J-QC_n_4_M4_B5__results.csv'
      )
    })

    it('will have a parsed filename', () => {
      expect(quantFile.parsedFilename).toEqual('DN601493J')
    })

    it('resolves', async () => {
      expect.assertions(1)
      await expect(quantFile.upload(file)).resolves.toEqual(
        'File successfully uploaded'
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
        let expectation = Object.values(quantFile.json.rows).every((row) => {
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
        'ascii'
      )
    })

    describe('with a valid filename', () => {
      beforeEach(async () => {
        quantFile = new cmp({
          propsData: {
            quant: 'heronTubeTapeStation',
            filename:
              'DN000000 - 2021-08-25 - 10-54-08-D5000_compactRegionTable.csv',
          },
        })
      })

      it('will have a filename', () => {
        expect(quantFile.filename).toEqual(
          'DN000000 - 2021-08-25 - 10-54-08-D5000_compactRegionTable.csv'
        )
      })

      it('will have a barcode from file name', () => {
        expect(quantFile.barcodeFromFileName).toMatch(
          /210825-105408-[0-9a-f]{6}/
        )
      })

      describe('on upload', () => {
        beforeEach(async () => {
          file = new File(
            [plate],
            'DN000000 - 2021-08-25 - 10-54-08-D5000_compactRegionTable.csv',
            { type: 'text/plain' }
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
        quantFile = new cmp({
          propsData: {
            quant: 'heronTubeTapeStation',
            filename: 'DN000000 - no_date_here.csv',
          },
        })
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
            'Filename must contain date/time, similar to "2021-02-26 - 13-45-00"'
          )
        })
      })
    })
  })
})
