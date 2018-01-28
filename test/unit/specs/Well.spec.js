import Vue from 'vue'
import Well from '@/components/Well'

describe('Well.vue', () => {

  let cmp, well, data

  beforeEach(() => {
    data = {row: 'A',column: '1',content: 'Sample X1',id: 'A1',concentration:'3.014'}
    cmp = Vue.extend(Well)
    well = new cmp({ propsData: data}).$mount()
  })

  it('will have an id', () => {
    expect(well.id).toEqual(data.id)
  })

  it('will have a concentration', () => {
    expect(well.concentration).toEqual(data.concentration)
  })

  it('can be active or inactive', () => {
    expect(well.active).toBeTruthy()
    well.active = false
    expect(well.active).toBeFalsy()
  })

  it ('has a type', () => {
    expect(well.type).toEqual('Sample')
  })

  it('has a location', () => {
    expect(well.location).toEqual('A1')
  })

   it('outputs concentration', () => {
    expect(well.$el.textContent).toMatch(new RegExp(well.concentration))
  })

  it('outputs location', () => {
    expect(well.$el.textContent).toMatch(well.location)
  })
})

