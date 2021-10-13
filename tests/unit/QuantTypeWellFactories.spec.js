import * as WellFactories from '@/QuantTypeWellFactories'

describe('QuantTypeWellFactories.js', () => {
  describe('PlateReader Factory', () => {
    describe('Sample well', () => {
      const options = {
        row: 'A',
        column: '1',
        content: 'Sample X1',
        id: 'A1',
        concentration: 1.345,
      }

      it('produces some json', () => {
        expect(WellFactories.PlateReader(options)).toEqual({
          row: 'A',
          column: '1',
          type: 'Sample',
          id: 'A1',
          concentration: 1.345,
        })
      })
    })

    describe('Empty well', () => {
      const options = {
        row: '',
        column: '',
        content: '',
        type: '',
        id: '',
        concentration: '',
      }

      it('produces some json', () => {
        expect(WellFactories.PlateReader(options)).toEqual({
          row: '',
          column: '',
          type: 'Empty',
          id: '',
          concentration: '',
        })
      })
    })
  })

  describe('QPCRWellFactory - 10ul', () => {
    describe('Sample', () => {
      const options = {
        include: 'TRUE',
        color: '128',
        pos: 'N1',
        name: 'A1',
        cp: '24.21',
        concentration: '5.61E+01',
        standard: '0.0002',
        status: 'red',
      }

      it('produces some json', () => {
        expect(WellFactories.QPCR10ul(options)).toEqual({
          row: 'N',
          column: '1',
          type: 'Sample',
          id: 'A1',
          concentration: 56.1,
        })
      })
    })

    describe('bugfix - column is 10 or above', () => {
      const options = {
        include: 'TRUE',
        color: '128',
        pos: 'D23',
        name: 'B6',
        cp: '24.21',
        concentration: '5.61E+01',
        standard: '0.0002',
        status: 'red',
      }

      it('has the correct row and column', () => {
        expect(WellFactories.QPCR10ul(options)).toEqual({
          row: 'D',
          column: '23',
          type: 'Sample',
          id: 'B6',
          concentration: 56.1,
        })
      })
    })

    describe('standard', () => {
      const options = {
        include: 'TRUE',
        color: '128',
        pos: 'N1',
        name: '0.0002pM',
        cp: '24.21',
        concentration: '2.66E-04',
        standard: '0.0002',
        status: 'red',
      }

      it('produces some json', () => {
        expect(WellFactories.QPCR10ul(options)).toEqual({
          row: 'N',
          column: '1',
          type: 'Standard',
          id: '',
          concentration: 0.000266,
        })
      })
    })
  })

  describe('QPCRWellFactory - 5ul', () => {
    describe('sample', () => {
      const options = {
        well: 'A1',
        copyNumber: '48909000',
        replicateError: '2445450',
        totalError: '10082849',
        shapeZScore: '0.695615245',
        comments:
          'This well was disregarded due to abnormally low background fluorescence.',
      }
      const wellMap = { A1: 'Z234', A2: 'X456' }

      it('produces some json', () => {
        expect(WellFactories.QPCR5ul(options, wellMap)).toEqual({
          row: 'A',
          column: '1',
          type: 'Sample',
          id: 'Z234',
          concentration: 48909000,
        })
      })
    })

    describe('Empty', () => {
      const options = {
        well: 'Z1',
        copyNumber: '123',
        replicateError: '456',
        totalError: '789',
        shapeZScore: '0.00',
        comments: '',
      }

      it('must have a type of Empty', () => {
        expect(WellFactories.QPCR5ul(options).type).toEqual('Empty')
      })
    })
  })

  describe('TubeTapeStation Factory', () => {
    // I'm including all the columns from the file here, although in practice
    // we only rely on an handful.
    const options = {
      fileName: 'DNXXXXXX - 2019-11-05 - 16.32.56.D5001',
      wellId: 'A1',
      sampleDescription: 'NT12345',
      from: '100',
      to: '1000',
      averageSize: '456',
      conc: '128',
      regionMolarity: '502',
      percentageOfTotal: '1.345',
      regionComment: '',
    }

    it('produces some json', () => {
      expect(WellFactories.TubeTapeStation(options)).toEqual({
        row: 'A',
        column: '1',
        type: 'Sample',
        id: 'NT12345',
        concentration: '502',
      })
    })
  })
})
