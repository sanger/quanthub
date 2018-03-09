import Vue from 'vue'
import Upload from '@/components/Upload'
import { mount } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import fs from 'fs'
import config from '../jest.conf'

describe('Upload.vue', () => {

  let cmp, csv, upload, options, file, blob

  describe('blank', () => {

    beforeEach(() => {
      cmp = mount(Upload, { } )
      upload = cmp.vm
    })

    it('has some default options', () => {
      expect(upload.options.rowDelimiter).toBeDefined()
      expect(upload.options.from).toBeDefined()
      expect(upload.options.metadataRows).toBeDefined()
      expect(upload.options.columns).toBeDefined()
    }) 
  })

  describe('filled', () => {
    beforeEach(() => {
      csv = fs.readFileSync(config.rootDir + '/test/data/plate1.csv', 'ascii')
      file = new File([csv], 'plate1.csv', { type: 'text/csv'})
      options = {rowDelimiter: '\n', from: 12, metadataRows: 7, columns: ['row', 'column', 'content', 'id', 'concentration', 'inspect']}
      cmp = mount(Upload, { propsData: { csv: csv, opts: options } })
      cmp.setData({file: file})
      upload = cmp.vm
      upload.uploadFile()
    })

    it('will have some csv', async () => {
      await flushPromises()
      await flushPromises()
      expect(upload.csv).toEqual(csv)
    })

    it('will have some options', () => {
      expect(upload.options).toEqual(options)
    })

    it('creates the right number of wells', async () => {
      await flushPromises()
      await flushPromises()
      expect(upload.wells.length).toEqual(csv.split("\n").length - (upload.options.from - 1))
    })

    it('transforms wells into correct format', async () => {
      await flushPromises()
      await flushPromises()
      let well = upload.wells[0]
      expect(well.type).toBeDefined()
      expect(well.location).toBeDefined()

      well = upload.wells[upload.wells.length - (upload.options.from - 1)]
      expect(well.type).toBeDefined()
      expect(well.location).toBeDefined()
    })

    it('sorts wells', async () => {
      await flushPromises()
      await flushPromises()
      let sorted = upload.sort()
      expect(sorted[0].location).toEqual('A1')
      expect(sorted[upload.wells.length - 1].location).toEqual('P23')
    })

    it('produces json', async () => {
      await flushPromises()
      await flushPromises()
      let json = upload.toJson()
      expect(json['wells'][0].row).toEqual('A')
      expect(json['wells'][0].column).toEqual('1')
      expect(json['wells'][upload.wells.length - 1].row).toEqual('P')
      expect(json['wells'][upload.wells.length - 1].column).toEqual('23')
    })

    it('creates some metadata', async () => {
      await flushPromises()
      await flushPromises()
      let metadata = upload.metadata
      expect(metadata.User).toEqual('DNAP OPS TEAM')
      expect(metadata.ID1).toEqual('QNTE_A_2411')
    })

  })
})
