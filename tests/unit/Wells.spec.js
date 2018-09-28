import Vue from 'vue'
import { mount } from '@vue/test-utils'
import Wells from '@/components/wells'
import Store from '@/Store'
import { Store as newStore } from '@/Store'
import Plate from '@/components/Plate'
import Well from '@/mixins/Well'

describe('Wells', () => {

  let cmp, well, data, plateBarcode

  beforeEach(() => {
    plateBarcode = 'DN1234567'
  })

  describe('Well mixin', () => {

    beforeEach(() => {
      data = { row: 'B', column: '8', concentration: '25.12', plateBarcode: plateBarcode }
      cmp = Vue.extend({mixins: [Well]})
      well = new cmp({propsData: data})
    })

    it('has a row', () => {
      expect(well.row).toEqual(data.row)
    })

    it('has a column', () => {
      expect(well.column).toEqual(data.column)
    })

    it('has a concentration', () => {
      expect(well.concentration).toEqual(data.concentration)
    })

    it('has a plateBarcode', () => {
      expect(well.plateBarcode).toEqual(data.plateBarcode)
    })

    it('has a location', () => {
      expect(well.location).toEqual(well.row.concat(well.column))
    })
  })

  describe('Control.vue', () => {

    beforeEach(() => {
      data = { row: 'B', column: '8', concentration: '25.12', plateBarcode: plateBarcode }
      cmp = mount(Wells.Control, { propsData: data })
      well = cmp.vm
    })

    it('has a row', () => {
      expect(well.row).toEqual(data.row)
    })

    it('has a column', () => {
      expect(well.column).toEqual(data.column)
    })

    it('has a concentration', () => {
      expect(well.concentration).toEqual(data.concentration)
    })

    it('has a plateBarcode', () => {
      expect(well.plateBarcode).toEqual(data.plateBarcode)
    })

    it('has a location', () => {
      expect(well.location).toEqual(well.row.concat(well.column))
    })

    it('outputs concentration', () => {
      expect(well.$el.textContent).toMatch(new RegExp(well.concentration))
    })

    it('produces some json', () => {
      expect(well.json).toEqual({row: data.row, column: data.column, type: 'Control', concentration: data.concentration})
    })

    it('has the correct class', () => {
      expect(well.$el.className).toMatch('control')
    })

  })

  describe('Standard.vue', () => {
    beforeEach(() => {
      data = { row: 'B', column: '4', concentration: '26.101', plateBarcode: plateBarcode }
      cmp = mount(Wells.Standard, { propsData: data})
      well = cmp.vm
    })

    it('has a row', () => {
      expect(well.row).toEqual(data.row)
    })

    it('has a column', () => {
      expect(well.column).toEqual(data.column)
    })

    it('has a concentration', () => {
      expect(well.concentration).toEqual(data.concentration)
    })

    it('has a plateBarcode', () => {
      expect(well.plateBarcode).toEqual(data.plateBarcode)
    })

    it('has a location', () => {
      expect(well.location).toEqual(well.row.concat(well.column))
    })

    it('outputs concentration', () => {
      expect(well.$el.textContent).toMatch(new RegExp(well.concentration))
    })

    it('produces some json', () => {
      expect(well.json).toEqual({row: data.row, column: data.column, type: 'Standard', concentration: data.concentration})
    })

    it('has the correct class', () => {
      expect(well.$el.className).toMatch('standard')
    })

  })

  describe('Sample.vue', () => {

    let $Store, plate, cmpPlate

    beforeEach(() => {
      cmpPlate = Vue.extend(Plate)
      plate = new cmpPlate({mocks: { $Store }, propsData: { barcode: plateBarcode}})

      $Store = Store
      $Store.sequencescapePlates.add(plate)

      data = { row: 'B', column: '4', concentration: '26.101', id: 'A1', plateBarcode: plateBarcode }
      cmp = mount(Wells.Sample, { mocks: { $Store }, propsData: data})
      well = cmp.vm
    })

    it('has a row', () => {
      expect(well.row).toEqual(data.row)
    })

    it('has a column', () => {
      expect(well.column).toEqual(data.column)
    })

    it('has a concentration', () => {
      expect(well.concentration).toEqual(data.concentration)
    })

    it('has a plateBarcode', () => {
      expect(well.plateBarcode).toEqual(data.plateBarcode)
    })

    it('has a location', () => {
      expect(well.location).toEqual(well.row.concat(well.column))
    })

    it('has an id', () => {
      expect(well.id).toEqual(data.id)
    })

    it('outputs concentration', () => {
      expect(well.$el.textContent).toMatch(new RegExp(well.concentration))
    })

    it('outputs id', () => {
      expect(well.$el.textContent).toMatch(data.id)
    })

    it('produces some json', () => {
      expect(well.json).toEqual({row: data.row, column: data.column, type: 'Sample', concentration: data.concentration, active: true, id: data.id})
      well.isActive = false
      expect(well.json).toEqual({row: data.row, column: data.column, type: 'Sample', concentration: data.concentration, active: false, id: data.id})
    })

    it('has the correct class', () => {
      expect(well.$el.className).toMatch('sample')
    })

    it('on clicking renders it inactive', () => {
      cmp.trigger('click')
      expect(well.isActive).toBeFalsy()
      expect(well.$el.className).toMatch('inactive')

      cmp.trigger('click')
      expect(well.isActive).toBeTruthy()
      expect(well.$el.className).not.toMatch('inactive')
      expect(well.$el.className).toMatch('sample')
    })

    it('will create a triplicate', () => {
      let triplicate = well.store.sequencescapePlates.find(plateBarcode).triplicates.find(well.id)
      expect(triplicate).toBeTruthy()
      expect(well.triplicate).toEqual(triplicate)
    })

    describe('Outlier', () => {

      let well1, well2, well3

      beforeEach(() => {
        $Store = new newStore
        $Store.sequencescapePlates.add(plate)
        well1 = mount(Wells.Sample, { mocks: { $Store }, propsData: { row: 'A', column: '13', id: 'A7', concentration: '0.69', type: 'Sample', plateBarcode: plateBarcode}})
        well2 = mount(Wells.Sample, { mocks: { $Store }, propsData: { row: 'A', column: '14', id: 'A7', concentration: '2.677', type: 'Sample', plateBarcode: plateBarcode }})
        well3 = mount(Wells.Sample, { mocks: { $Store }, propsData: { row: 'B', column: '13', id: 'A7', concentration: '0.665', type: 'Sample', plateBarcode: plateBarcode }})
      })

      // this would be better to check class but this is brittle
      it('has the correct class', () => {
        expect(well1.vm.needsInspection()).toBeTruthy()
        expect(well2.vm.needsInspection()).toBeTruthy()
        expect(well3.vm.needsInspection()).toBeTruthy()
      })

      // this would be better to check class but this is brittle
      it('removing outlier will be reflected in all wells', () => {
        well2.trigger('click')
        expect(well2.vm.$el.className).toMatch('inactive')
        expect(well1.vm.needsInspection()).toBeFalsy()
        expect(well3.vm.needsInspection()).toBeFalsy()
      })

    })

  })

})