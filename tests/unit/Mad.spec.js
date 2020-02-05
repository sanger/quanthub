import  * as Mad from '@/Mad'
import { calculateAverage, adjustedAverage } from '../../src/Mad'

describe('Mad.vue', () => {

  it('has a median method', () => {

    let values = [2,4,1,5]
    expect(Mad.median(values)).toEqual(3)

    values = [5,3,1,4,2]
    expect(Mad.median(values)).toEqual(3)

    values = [1,2,3,4]
    expect(Mad.median(values)).toEqual(2.5)

    values = [15074400,15443900,15510200,15916700]
    expect(Mad.median(values)).toEqual(15477050)
  })

  it('has an absolute deviation method', () => {
    let values = [2,4,1,5]
    let median = 3
    expect(Mad.absoluteDeviation(values, median)).toEqual([1,1,2,2])

    values = [15074400,15443900,15510200,15916700]
    median = 15477050
    expect(Mad.absoluteDeviation(values,median)).toEqual([402650,33150,33150,439650])
  })

  it('has a mad calculation', () => {
    let values = [2,4,1,5]
    expect(Mad.calculation(values)).toEqual(1.5)

    values = [15074400,15443900,15510200,15916700]
    expect(Mad.calculation(values)).toEqual(217900)
  })

  // item - median / (magic * mad ) 
  it('has another unknown function #methodTwo', () => {
    let values = [2, 4, 1, 5]
    let expected = [-0.4496605063, 0.4496605063, -0.8993210126, 0.8993210126]
    expect(Mad.methodTwo(values)).toEqual(expected)

    values = [15074400, 15443900, 15510200, 15916700]
    expected = [-1.2463685374, -0.1026129815, 0.1026129815, 1.3608988637]
    expect(Mad.methodTwo(values)).toEqual(expected)
  })

  it('has an isOutlier function', () => {
    expect(Mad.isOutlier(1)).toBeFalsy()
    expect(Mad.isOutlier(-1)).toBeFalsy()
    expect(Mad.isOutlier(3.5)).toBeFalsy()
    expect(Mad.isOutlier(-3.5)).toBeFalsy()

    expect(Mad.isOutlier(3.6)).toBeTruthy()
    expect(Mad.isOutlier(-3.6)).toBeTruthy()
    expect(Mad.isOutlier(8)).toBeTruthy()
    expect(Mad.isOutlier(-8)).toBeTruthy()
  })

 it('#calculateAverage', () => {
    //  When calculating the avergae for a normal average
    let values = [3.014, 3.163, 2.836]
    expect(calculateAverage(values)).toEqual("3.004")

    // When calculating the average for standard deviation
    values = [3.014, 3.163, 2.836]
    expect(calculateAverage(values, 1)).toEqual("4.506")
  })

  it('#adjustedAverage', () => {
    let average = 3.004
    let conversionFactor = ((1000000 / 660) * (1 / 585))
    let decimalPlaces = 3

    expect(adjustedAverage(average, conversionFactor, decimalPlaces)).toEqual("7.780")
  })
})