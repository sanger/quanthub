import * as WellFactories from '@/QuantTypeWellFactories'

describe('QuantTypeWellFactories.js', () => {

  let options, well

  describe('PlateReader Factory', () => {

    beforeEach(() => {
      options = {row: 'A', column: '1', content: 'Sample X1', id: 'A1', concentration: 1.345}
      well = new WellFactories.PlateReader(options)
    })

    it('must have a row', () => {
      expect(well.row).toEqual(options.row)
    })

    it('must have a column', () => {
      expect(well.column).toEqual(options.column)
    })

    it('must have some content', () => {
      expect(well.content).toEqual(options.content)
    })

    it('must have an id', () => {
      expect(well.column).toEqual(options.column)
    })

    it('must have a concentration', () => {
      expect(well.concentration).toEqual(options.concentration)
    })

    it('must have a type', () => {
      expect(well.type).toEqual('Sample')
    })

    it('produces some json', () => {
      expect(well.json).toEqual({row: 'A', column: '1', type: 'Sample', id: 'A1', concentration: 1.345})
    })

    describe('Empty well', () => {
      beforeEach(() => {
        well = new WellFactories.PlateReader({row: '', column: '', content: '', type: '', id: '', concentration: ''})
      })

      it('must have a type', () => {
        expect(well.type).toEqual('Empty')
      })

      it('will be empty apart from the type', () => {
        expect(well.row).toEqual('')
        expect(well.column).toEqual('')
        expect(well.content).toEqual('')
        expect(well.id).toEqual('')
        expect(well.concentration).toEqual('')
      })
    })

  })

  describe('QPCRWellFactory - 10ul', () => {

    describe('sample', () => {

      beforeEach(() => {
        options = {include: 'TRUE', color: '128', pos: 'N1', name: 'A1', cp: '24.21', concentration: '5.61E+01', standard: '0.0002', status: 'red'}
        well = new WellFactories.QPCR10ul(options)
      })

      it('must have an include', () => {
        expect(well.include).toEqual(options.include)
      })

      it('must have a color', () => {
        expect(well.color).toEqual(options.color)
      })

      it('must have a pos', () => {
        expect(well.pos).toEqual(options.pos)
      })

      it('must have an name', () => {
        expect(well.name).toEqual(options.name)
      })

      it('must have a cp', () => {
        expect(well.cp).toEqual(options.cp)
      })

      it('must have a concentration', () => {
        expect(well.concentration).toEqual(56.1)
      })

      it('must have a standard', () => {
        expect(well.standard).toEqual(options.standard)
      })

      it('must have a status', () => {
        expect(well.status).toEqual(options.status)
      })

      it('must have a row', () => {
        expect(well.row).toEqual('N')
      })

      it('must have a column', () => {
        expect(well.column).toEqual('1')
      })

      it('will have an id', () => {
        expect(well.id).toEqual('A1')
      })

      it('will have a type', () => {
        expect(well.type).toEqual('Sample')
      })

      it('must be a sample', () => {
        expect(well.isSample()).toBeTruthy()
      })

      it('produces some json', () => {
        expect(well.json).toEqual({row: 'N', column: '1', type: 'Sample', id: 'A1', concentration: 56.1})
      })

    })

    describe('bugfix - column is 10 or above', () => {
      beforeEach(() => {
        options = {include: 'TRUE', color: '128', pos: 'D23', name: 'B6', cp: '24.21', concentration: '5.61E+01', standard: '0.0002', status: 'red'}
        well = new WellFactories.QPCR10ul(options)
      })

      it('will have the correct row', () => {
        expect(well.row).toEqual('D')
      })

      it('will have the correct column', () => {
        expect(well.column).toEqual('23')
      })

    })

    describe('standard', () => {

      beforeEach(() => {
        options = {include: 'TRUE', color: '128', pos: 'N1', name: '0.0002pM', cp: '24.21', concentration: '2.66E-04', standard: '0.0002', status: 'red'}
        well = new WellFactories.QPCR10ul(options)
      })

      it('will have a name', () => {
        expect(well.name).toEqual('0.0002pM')
      })

      it('will not have an id', () => {
        expect(well.id).toEqual('')
      })

      it('will have a type', () => {
        expect(well.type).toEqual('Standard')
      })

      it('must not be a sample', () => {
        expect(well.isSample()).toBeFalsy()
      })

      it('will have a concentration', () => {
        expect(well.concentration).toEqual(0.000266)
      })

    })

  })

  describe('QPCRWellFactory - 5ul', () => {

    let wellMap

    describe('sample', () => {
      beforeEach(() => {
        wellMap = {A1: 'Z234', A2: 'X456'}
        options = {well: 'A1', copyNumber: '48909000', replicateError: '2445450', totalError: '10082849', shapeZScore: '0.695615245', comments: 'This well was disregarded due to abnormally low background fluorescence.'}
        well = new WellFactories.QPCR5ul(options, wellMap)
      })

      it('must have a well', () => {
        expect(well.well).toEqual(options.well)
      })

      it('must have a copy number', () => {
        expect(well.copyNumber).toEqual(options.copyNumber)
      })

      it('must have a replicate error', () => {
        expect(well.replicateError).toEqual(options.replicateError)
      })

      it('must have a total error', () => {
        expect(well.totalError).toEqual(options.totalError)
      })

      it('must have a shape Z score', () => {
        expect(well.shapeZScore).toEqual(options.shapeZScore)
      })

      it('must have a comments', () => {
        expect(well.comments).toEqual(options.comments)
      })

      it('must have a row', () => {
        expect(well.row).toEqual('A')
      })

      it('must have a column', () => {
        expect(well.column).toEqual('1')
      })

      it('must have an id', () => {
        expect(well.id).toEqual('Z234')
      })

      it('must have a type', () => {
        expect(well.type).toEqual('Sample')
      })

      it('produces some json', () => {
        expect(well.json).toEqual({row: 'A', column: '1', type: 'Sample', id: 'Z234', concentration: 48909000})
      })

    })

    describe('Empty', () => {
      beforeEach(() => {
        well = new WellFactories.QPCR5ul({well: 'Z1', copyNumber: '123', replicateError: '456', totalError: '789', shapeZScore: '0.00', comments: ''})
      })

      it('must have a type', () => {
        expect(well.type).toEqual('Empty')
      })

    })

  })

})
