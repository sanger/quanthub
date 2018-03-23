import Vue from 'vue'
import { mount } from '@vue/test-utils'
import CsvFile from '@/components/CsvFile'
import flushPromises from 'flush-promises'
import fs from 'fs'
import config from '../jest.conf'

describe('CsvFile.vue', () => {

  let cmp, csvFile, csv, file, options

  beforeEach(() => {
    
    options = {rowDelimiter: '\n', from: 12, metadataRows: 7, columns: ['row', 'column', 'content', 'id', 'concentration']}
    cmp = Vue.extend(CsvFile)
    csvFile = new cmp({propsData: { opts: options}})
  })

  it('has some default options', () => {
    expect(csvFile.options.rowDelimiter).toBeDefined()
    expect(csvFile.options.from).toBeDefined()
    expect(csvFile.options.metadataRows).toBeDefined()
    expect(csvFile.options.columns).toBeDefined()
  })

  describe('upload', () => {

    beforeEach(async () => {
      csv = fs.readFileSync(config.rootDir + '/test/data/plate1.csv', 'ascii')
      file = new File([csv], 'plate1.csv', { type: 'text/csv'})
    })

    it('resolves', async () => {
      expect.assertions(1)
      await expect(csvFile.upload(file)).resolves.toEqual('File successfully uploaded')
    })

    describe('successful', () => {

      let rows

      beforeEach(async () => {
        csvFile.upload(file)
        rows = csv.split('\n')
        await flushPromises()
        await flushPromises()
      })

      it('will have some csv', () => {
        expect(csvFile.csv).toEqual(csv)
      })

      it('will have some options', () => {
        expect(csvFile.options).toEqual(options)
      })

      it('transforms wells into correct format', () => {
        let row = rows[12].split(',')
        let well = csvFile.grid.rows[row[0]][row[1]]

        expect(well.row).toBeDefined()
        expect(well.column).toBeDefined()
        expect(well.content).toBeDefined()
        expect(well.id).toBeDefined()
        expect(well.concentration).toBeDefined()

        row = rows[rows.length - (csvFile.options.from - 1)].split(',')
        well = csvFile.grid.rows[row[0]][row[1]]
        expect(well.row).toBeDefined()
        expect(well.column).toBeDefined()
        expect(well.content).toBeDefined()
        expect(well.id).toBeDefined()
        expect(well.concentration).toBeDefined()
      })

      it('produces some json', () => {
        let json = csvFile.json['rows']
        let row = rows[12].split(',')
        expect(json[row[0]][row[1]].row).toEqual(row[0])
        expect(json[row[0]][row[1]].column).toEqual(row[1])

        row = rows[rows.length - (csvFile.options.from - 1)].split(',')
        expect(json[row[0]][row[1]].row).toEqual(row[0])
        expect(json[row[0]][row[1]].column).toEqual(row[1])
      })

      it('creates some metadata', () => {
        let metadata = csvFile.metadata
        expect(metadata.User).toEqual('DNAP OPS TEAM')
        expect(metadata.ID1).toEqual('QNTE_A_2411')
      })

    })

  })
  
})