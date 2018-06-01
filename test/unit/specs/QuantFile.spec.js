import Vue from 'vue'
import { mount } from '@vue/test-utils'
import QuantFile from '@/components/QuantFile'
import flushPromises from 'flush-promises'
import fs from 'fs'
import config from '../jest.conf'
import parse from 'csv-parse/lib/sync'

describe('QuantFile.vue', () => {

  let cmp, quantFile, plate, file, options

  beforeEach(() => {
    cmp = Vue.extend(QuantFile)
  })

  it('has some default options', () => {
    quantFile = new cmp()
    expect(quantFile.options.rowDelimiter).toBeDefined()
    expect(quantFile.options.from).toBeDefined()
    expect(quantFile.options.metadata.rows).toBeDefined()
    expect(quantFile.options.metadata.delimiter).toBeDefined()
    expect(quantFile.options.metadata.idColumn).toBeDefined()
    expect(quantFile.options.columns).toBeDefined()
    expect(quantFile.options.delimiter).toBeDefined()
  })

  describe('upload', () => {

    describe('csv', () => {

      beforeEach(async () => {
        options = {rowDelimiter: ['\r\n', '\n', '\r'], from: 16, metadata: { rows: 3, idColumn: 'ID1', delimiter: ','}, columns: ['row', 'column', 'content', 'id', 'concentration'], delimiter: ','}
        quantFile = new cmp({propsData: { opts: options}})
        plate = fs.readFileSync(config.rootDir + '/test/data/plate1.csv', 'ascii')
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

        it('will have some options', () => {
          expect(quantFile.options).toEqual(options)
        })

        it('transforms wells into correct format', () => {
          let row = rows[options.from].split(',')
          let well = quantFile.grid.rows[row[0]][row[1]]

          expect(well.row).toBeDefined()
          expect(well.column).toBeDefined()
          expect(well.content).toBeDefined()
          expect(well.id).toBeDefined()
          expect(well.concentration).toBeDefined()

          row = rows[rows.length - (quantFile.options.from - 1)].split(',')
          well = quantFile.grid.rows[row[0]][row[1]]
          expect(well.row).toBeDefined()
          expect(well.column).toBeDefined()
          expect(well.content).toBeDefined()
          expect(well.id).toBeDefined()
          expect(well.concentration).toBeDefined()
        })

        it('produces some json', () => {
          let json = quantFile.json['rows']
          let row = rows[options.from].split(',')
          expect(json[row[0]][row[1]].row).toEqual(row[0])
          expect(json[row[0]][row[1]].column).toEqual(row[1])

          row = rows[rows.length - (quantFile.options.from - 1)].split(',')
          expect(json[row[0]][row[1]].row).toEqual(row[0])
          expect(json[row[0]][row[1]].column).toEqual(row[1])
        })

        it('creates some metadata', () => {
          let metadata = quantFile.metadata
          expect(metadata.User).toEqual('SANGER')
          expect(metadata.ID1).toEqual('test_RaD')
        })

      })

    })

    describe('text tab delimited', () => {

      beforeEach(async () => {
        
        options = {rowDelimiter: ['\r\n', '\n', '\r'], from: 3, metadata: {rows: 1, delimiter: ' ', idColumn: 'Experiment'}, columns: ['include','color','pos','name','cp','concentration','standard','status'], delimiter: '\t'}
        quantFile = new cmp({propsData: { opts: options}})
        plate = fs.readFileSync(config.rootDir + '/test/data/plate2.txt', 'ascii')
        file = new File([plate], 'plate2.txt', { type: 'text/plain'})
      })

      it.skip('resolves', async () => {
        expect.assertions(1)
        await expect(quantFile.upload(file)).resolves.toEqual('File successfully uploaded')
      })

    })
  })
  
})