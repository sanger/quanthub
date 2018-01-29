import Vue from 'vue'
import Well from '@/components/Well'

describe('Well.vue', () => {

  let cmp, well, data

  beforeEach(() => {
    cmp = Vue.extend(Well)
  })

  describe('with valid data', () => {
    beforeEach(() => {
      data = {row: 'A',column: '1',type: 'Sample', id: 'A1',concentration:'3.014'}
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
      expect(well.type).toEqual(data.type)
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

    // it('on clicking renders it inactive', () => {
    //   well.$el.click()
    //   expect(well.active).toBeFalsy()
    //   expect(well.$el.className).toMatch('inactive')
    // })
  })

  describe('with missing data', () => {
    beforeEach(() => {
      data = {type: '', id: '',concentration:''}
      cmp = Vue.extend(Well)
      well = new cmp({ propsData: data}).$mount()
    })

    it('will have an id', () => {
      expect(well.id).toEqual(data.id)
    })

    it('will have a concentration', () => {
      expect(well.concentration).toEqual(data.concentration)
    })

    it ('has a type', () => {
      expect(well.type).toEqual(data.type)
    })

    it('has a location', () => {
      expect(well.location).toEqual('')
    }) 
  })
})