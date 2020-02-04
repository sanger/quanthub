import  * as Mad from '@/Mad'
// import { mount, localVue } from './testHelper'

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

})