import Vue from 'vue'
import Upload from '@/components/Upload'
// import csv from '../../data/plate1'
import { mount } from '@vue/test-utils'
import fs from 'fs'
import config from '../jest.conf'

describe('Upload.vue', () => {

  let cmp, csv, upload, options

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
      options = {rowDelimiter: '\n', from: 12, metadataRows: 7, columns: ['row', 'column', 'content', 'id', 'concentration', 'inspect']}
      cmp = mount(Upload, { propsData: { csv: csv, opts: options } })
      upload = cmp.vm
    })

    it('will have some csv', () => {
      expect(upload.csv).toEqual(csv)
    })

    it('will have some options', () => {
      expect(upload.options).toEqual(options)
    })

    it('creates the right number of wells', () => {
      upload.parseData()
      expect(upload.wells.length).toEqual(csv.split("\n").length - (upload.options.from - 1))
    })

    it('transforms wells into correct format', () => {
      upload.parseData()
      let well = upload.wells[0]
      expect(well.type).toBeDefined()
      expect(well.location).toBeDefined()

      well = upload.wells[upload.wells.length - (upload.options.from - 1)]
      expect(well.type).toBeDefined()
      expect(well.location).toBeDefined()
    })

    it('sorts wells', () => {
      upload.parseData()
      let sorted = upload.sort()
      expect(sorted[0].location).toEqual('A1')
      expect(sorted[upload.wells.length - 1].location).toEqual('P23')
    })

    it('produces json', () => {
      upload.parseData()
      let json = upload.toJson()
      expect(json['wells'][0].row).toEqual('A')
      expect(json['wells'][0].column).toEqual('1')
      expect(json['wells'][upload.wells.length - 1].row).toEqual('P')
      expect(json['wells'][upload.wells.length - 1].column).toEqual('23')
    })

    it('creates some metadata', () => {
      let metadata = upload.metadata
      expect(metadata.User).toEqual('DNAP OPS TEAM')
      expect(metadata.ID1).toEqual('QNTE_A_2411')
    })

    it('has a path', () => {
      expect(upload.path).toMatch(upload.metadata.ID1)
    })

    it('creates a file', () => {
      upload.parseData()
      upload.toFile()
      expect(fs.existsSync(upload.path)).toBeTruthy()
      fs.unlinkSync(upload.path) 
    })

    // it('uploads a file', () => {
    //   console.log(config.rootDir)
    //   console.log(fs.readFileSync(config.rootDir + '/test/data/plate1.csv', 'ascii'))
    // })
  })
})
