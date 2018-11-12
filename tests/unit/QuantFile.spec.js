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
        quantFile = new cmp({propsData: { quant: 'libraryPlateReader'}})
        plate = fs.readFileSync('./tests/data/plate_reader.csv', 'ascii')
        file = new File([plate], 'plate1.csv', { type: 'text/csv'})
      })

      it('resolves', async () => {
        expect.assertions(1)
        await expect(quantFile.upload(file)).resolves.toEqual('File successfully uploaded')
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
          let row = rows[quantFile.quantType.parse.from].split(quantFile.quantType.parse.delimiter)
          let well = quantFile.grid.rows[row[0]][row[1]]

          expect(well.row).toBeDefined()
          expect(well.column).toBeDefined()
          expect(well.type).toBeDefined()
          expect(well.id).toBeDefined()
          expect(well.concentration).toBeDefined()

          row = rows[rows.length - (quantFile.quantType.parse.from - 1)].split(quantFile.quantType.parse.delimiter)
          well = quantFile.grid.rows[row[0]][row[1]]
          expect(well.row).toBeDefined()
          expect(well.type).toBeDefined()
          expect(well.id).toBeDefined()
          expect(well.concentration).toBeDefined()
        })

        it('produces some json', () => {
          let json = quantFile.json['rows']
          let row = rows[quantFile.quantType.parse.from].split(quantFile.quantType.parse.delimiter)
          expect(json[row[0]][row[1]].row).toEqual(row[0])
          expect(json[row[0]][row[1]].column).toEqual(row[1])

          row = rows[rows.length - (quantFile.quantType.parse.from - 1)].split(quantFile.quantType.parse.delimiter)
          expect(json[row[0]][row[1]].row).toEqual(row[0])
          expect(json[row[0]][row[1]].column).toEqual(row[1])
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

    describe('text tab delimited', () => {

      beforeEach(async () => {
        quantFile = new cmp({propsData: { quant: 'libraryQPCR'}})
        plate = fs.readFileSync('./tests/data/qPCR.txt', 'ascii')
        file = new File([plate], 'plate2.txt', { type: 'text/plain'})
      })

      it('resolves', async () => {
        expect.assertions(1)
        await expect(quantFile.upload(file)).resolves.toEqual('File successfully uploaded')
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
          file = new File([plate], 'plate2.txt', { type: 'text/plain'})
        })

        it('resolves', async () => {
          expect.assertions(1)
          await expect(quantFile.upload(file)).resolves.toEqual('File successfully uploaded')
        })
        
      })

      // This type of file errors even though it doesn't seem to have extra columns
      describe('file with extra columns', () => {

        beforeEach(() => {
          plate = fs.readFileSync('./tests/data/qPCR_extra_columns.txt', 'ascii')
          file = new File([plate], 'plate3.txt', { type: 'text/plain'})
        })

        it('resolves', async () => {
          expect.assertions(1)
          await expect(quantFile.upload(file)).resolves.toEqual('File successfully uploaded')
        })
        
      })

    })
  })
  
})