import Vue from 'vue'
import { mount } from '@vue/test-utils'
import Well from '@/components/Well'
import Store from '@/Store'
import { Store as newStore } from '@/Store'
import Plate from '@/components/Plate'

describe('Well.vue', () => {

  let cmp, well, data, $Store, plateId, plate, cmpPlate

  beforeEach(() => {
    plateId = 'DN1234567'
    cmpPlate = Vue.extend(Plate)
    plate = new cmpPlate({propsData: { id: plateId}})
  })

  describe('Basic', () => {
    beforeEach(() => {
      data = {row: 'A',column: '1', type: 'Basic', id: 'A1', concentration:'3.014', plateId: plateId}
      cmp = mount(Well, { propsData: data })
      well = cmp.vm
    })

    it('will have an id', () => {
      expect(well.id).toEqual(data.id)
    })

    it('will have a concentration', () => {
      expect(well.concentration).toEqual(data.concentration)
    })

    it('can be active or inactive', () => {
      expect(well.isActive).toBeTruthy()
      well.isActive = false
      expect(well.isActive).toBeFalsy()
    })

    it ('has a type', () => {
      expect(well.type).toEqual("Basic")
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

    it('produces json', () => {
      expect(well.json).toEqual({row: 'A', column: '1', type: 'Basic', id: 'A1', concentration: '3.014', active: true})
      well.isActive = false
      expect(well.json).toEqual({row: 'A', column: '1', type: 'Basic', id: 'A1', concentration: '3.014', active: false})
    })

    it('can have a Plate Id', () => {
      expect(well.plateId).toEqual(plateId)
    })
  })

  describe('Sample', () => {
    beforeEach(() => {
      $Store = Store
      $Store.sequencescapePlates.add(plate)
      data = {row: 'A',column: '1', type: 'Sample', id: 'A1', concentration:'3.014', plateId: plateId}
      cmp = mount(Well, { mocks: { $Store }, propsData: data})
      well = cmp.vm
    })

    it ('has the correct class', () => {
      expect(well.$el.className).toMatch('sample')
    })

    it('has a location', () => {
      expect(well.location).toEqual('A1')
    })

    it('on clicking renders it inactive', () => {
      cmp.trigger('click')
      expect(well.isActive).toBeFalsy()
      expect(well.$el.className).toMatch('inactive')
    })

    it('will create a triplicate', () => {
      let triplicate = well.store.sequencescapePlates.find(plateId).triplicates.find(well.id)
      expect(triplicate).toBeTruthy()
      expect(well.triplicate).toEqual(triplicate)
    })
  })

  describe('Standard', () => {
    beforeEach(() => {
      $Store = Store
      data = { row: 'B', column: '4', id: 'Std 1', concentration: '26.101', type: 'Standard', plateId: plateId }
      cmp = mount(Well, { mocks: { $Store }, propsData: data})
      well = cmp.vm
    })

    it('has the correct class', () => {
      expect(well.$el.className).toMatch('standard')
      cmp.trigger('click')
      expect(well.$el.className).toMatch('standard')
    })

    it('will create an empty triplicate', () => {
      expect(well.triplicate.size).toEqual(0)
    })
  })

  describe('Outlier', () => {

    let well1, well2, well3

    beforeEach(() => {
      $Store = new newStore
      $Store.sequencescapePlates.add(plate)
      well1 = mount(Well, { mocks: { $Store }, propsData: { row: 'A', column: '13', id: 'A7', concentration: '0.69', type: 'Sample', plateId: plateId}})
      well2 = mount(Well, { mocks: { $Store }, propsData: { row: 'A', column: '14', id: 'A7', concentration: '2.677', type: 'Sample', plateId: plateId }})
      well3 = mount(Well, { mocks: { $Store }, propsData: { row: 'B', column: '13', id: 'A7', concentration: '0.665', type: 'Sample', plateId: plateId }})
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

  describe('Control', () => {
    beforeEach(() => {
      $Store = Store
      data = { row: 'B', column: '8', id: 'Ctrl 1', concentration: '25.12', type: 'Control', plateId: plateId }
      cmp = mount(Well, { mocks: { $Store }, propsData: data})
      well = cmp.vm
    })

    it('has the correct class', () => {
      expect(well.$el.className).toMatch('control')
      cmp.trigger('click')
      expect(well.$el.className).toMatch('control')
    })

    it('will create an empty triplicate', () => {
      expect(well.triplicate.size).toEqual(0)
    })
  })

  describe('Empty', () => {
    beforeEach(() => {
      $Store = Store
      data = {id: '', concentration: '', type: '' }
      cmp = mount(Well, { mocks: { $Store }, propsData: data})
      well = cmp.vm
    })

    it('has the correct class', () => {
      cmp.trigger('click')
      expect(well.$el.className).not.toMatch('inactive')
    })
  })
})