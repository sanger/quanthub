import  * as Calculations from '@/Calculations'

describe('Calculations.vue', () => {

  let values

  describe('#median', () => {

    it('even unsorted list of values', () => {
      expect(Calculations.median([2,4,1,5])).toEqual(3)
    })

    it('odd unsorted list of values', () => {
      expect(Calculations.median([5,3,1,4,2])).toEqual(3)
    })

    it('odd unsorted list where median is not a whole number', () => {
      expect(Calculations.median([1,2,3,4])).toEqual(2.5)
    })

    it('even unsorted list of big numbers', () => {
      expect(Calculations.median([15074400,15443900,15510200,15916700])).toEqual(15477050)
    })
  })

  describe('#absoluteDeviation', () => {

    it('unordered even list of small numbers', () => {
      expect(Calculations.absoluteDeviation([2,4,1,5], 3)).toEqual([1,1,2,2])
    })

    it('unordered even list of big numbers', () => {
      expect(Calculations.absoluteDeviation([15074400,15443900,15510200,15916700], 15477050)).toEqual([402650,33150,33150,439650])
    })
  })

  describe('#mad', () => {

    it('small numbers', () => {
      expect(Calculations.mad([2,4,1,5])).toEqual(1.5)
    })

    it('big numbers', () => {
      expect(Calculations.mad([15074400,15443900,15510200,15916700])).toEqual(217900)
    })

  })

  // item - median / (consistency_constant * mad ) 
  describe('#modifiedZScores', () => {

    let expected

    it('small numbers', () => {
      values = [2, 4, 1, 5]
      expected = [-0.4496605063, 0.4496605063, -0.8993210126, 0.8993210126]
      expect(Calculations.modifiedZScores(values)).toEqual(expected)
    })

    it('big numbers', () => {
      values = [15074400, 15443900, 15510200, 15916700]
      expected = [-1.2463685374, -0.1026129815, 0.1026129815, 1.3608988637]
      expect(Calculations.modifiedZScores(values)).toEqual(expected)
    })
  })

  describe('#isOutlier', () => {

    it('when the value is within the permitted number of standard deviations', () => {
      expect(Calculations.isOutlier(1, 4.5)).toBeFalsy()
      expect(Calculations.isOutlier(-1, 4.5)).toBeFalsy()
      expect(Calculations.isOutlier(4.5, 4.5)).toBeFalsy()
      expect(Calculations.isOutlier(-4.5, 4.5)).toBeFalsy()
    })

    it('when the value is outside the permitted number of standard deviations', () => {
      expect(Calculations.isOutlier(4.6,4.5)).toBeTruthy()
      expect(Calculations.isOutlier(-4.6,4.5)).toBeTruthy()
      expect(Calculations.isOutlier(8,4.5)).toBeTruthy()
      expect(Calculations.isOutlier(-8,4.5)).toBeTruthy()
    })
  })

  describe('#toDecimalPlaces', () => {

    it('should produce the correct result', () => {
      expect((2).toDecimalPlaces(5)).toEqual(2.00000)
      expect(5.678945345322.toDecimalPlaces(5)).toEqual(5.67895)
      expect(1.87667834567.toDecimalPlaces(3)).toEqual(1.877)
      expect(934.56.toDecimalPlaces(6)).toEqual(934.560000)
      expect(-4.3634597236525723975279.toDecimalPlaces(4)).toEqual(-4.3635)
      expect(9.9999999.toDecimalPlaces(3)).toEqual(10.000)
    })
  })

  describe('#average', () => {

    beforeEach(() => {
      values = [3.014, 3.163, 2.836]
    })

    it('should calculate the correct result', () => {
      expect(Calculations.average(values)).toEqual(3.004)
      expect(Calculations.average([5,6,7,8,9,10])).toEqual(7.500)
    })

    // When calculating the average for standard deviation
    it('can calculate a sample average', () => {
      expect(Calculations.average(values, { sample: 1})).toEqual(4.506)
    })

    it('can calculate an adjusted average', () => {
      let conversionFactor = ((1000000 / 660) * (1 / 585))
      expect(Calculations.average(values, {conversionFactor: conversionFactor})).toEqual(7.781)
    })

    it('can modify the number of decimal places', () => {
      expect(Calculations.average(values, { decimalPlaces: 5 })).toEqual(3.00433)
      expect(Calculations.average(values, { decimalPlaces: 10 })).toEqual(3.0043333333)
    })
  })

  describe('#standardDeviation', () => {

    beforeEach(() => {
      values = [3.014, 3.163, 2.836]
    })

    it('will provide the correct value', () => {
      // average = 3.004
      // (3.014 - 3.004)squared = 0.0001
      // (3.163 - 3.004)squared = 0.025281
      // (2.836 - 3.004)squared = 0.028224
      // (0.0001 + 0.025281 + 0.028224) / 3 = 0.027
      // sqrt (0.018) = 0.163714690849661

      expect(Calculations.standardDeviation(values)).toEqual(0.164)

    })

    it('can set the number of decimal places', () => {
      expect(Calculations.standardDeviation(values, {decimalPlaces: 10})).toEqual(0.1637146908)
    })
  })

})