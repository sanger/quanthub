import Vue from 'vue'
import { mount } from '@vue/test-utils'
import CsvFile from '@/components/CsvFile'
import flushPromises from 'flush-promises'
import fs from 'fs'
import config from '../jest.conf'

describe('CsvFile.vue', () => {

  let cmp, csvFile, csv, file, options

  beforeEach(() => {
    
    options = {rowDelimiter: '\n', from: 12, metadataRows: 7, columns: ['row', 'column', 'content', 'id', 'concentration', 'inspect']}
    cmp = Vue.extend(CsvFile)
    csvFile = new cmp({})
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
      beforeEach(async () => {
        csvFile.upload(file)
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
        let well = csvFile.wells[0]
        expect(well.type).toBeDefined()
        expect(well.location).toBeDefined()

        well = csvFile.wells[csvFile.wells.length - (csvFile.options.from - 1)]
        expect(well.type).toBeDefined()
        expect(well.location).toBeDefined()
      })

      it('sorts the wells', () => {
        let sorted = csvFile.sorted
        expect(sorted[0].location).toEqual('A1')
        expect(sorted[csvFile.wells.length - 1].location).toEqual('P23')
      })

      it('produces some json', () => {
        let json = csvFile.json
        expect(json['wells'][0].row).toEqual('A')
        expect(json['wells'][0].column).toEqual('1')
        expect(json['wells'][csvFile.wells.length - 1].row).toEqual('P')
        expect(json['wells'][csvFile.wells.length - 1].column).toEqual('23')
      })

      it('creates some metadata', () => {
        let metadata = csvFile.metadata
        expect(metadata.User).toEqual('DNAP OPS TEAM')
        expect(metadata.ID1).toEqual('QNTE_A_2411')
      })

    })

  })
  
})