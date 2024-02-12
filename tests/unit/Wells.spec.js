import { mount, createContainer } from './testHelper'
import Wells from '@/components/wells'
import Store from '@/Store'
import { Store as newStore } from '@/Store'
import Plate from '@/components/Plate.vue'
import WellProperties from '@/mixins/WellProperties'
import { components } from '@/mixins/WellTypes'
import { describe, expect, it, beforeEach, afterEach } from 'vitest'

describe('Wells', () => {
  let cmp, well, data, plateBarcode

  beforeEach(() => {
    plateBarcode = 'DN1234567'
  })

  describe('Well mixin', () => {
    beforeEach(() => {
      data = {
        row: 'B',
        column: '8',
        concentration: '25.12',
        plateBarcode: plateBarcode,
        defaultFields: {
          row: 'row',
          column: 'column',
          concentration: 'concentration',
        },
        extraFields: { type: 'type' },
      }
      cmp = mount(Wells, {
        mixins: [WellProperties],
        props: data,
      })
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

    it('has a type', () => {
      expect(well.type).toEqual('Base')
    })

    it('has some default fields', () => {})

    it('has some json', () => {
      expect(well.json).toEqual({
        row: data.row,
        column: data.column,
        concentration: data.concentration,
        type: well.type,
      })
    })
  })

  describe('Well Type mixin', () => {
    it('has the correct number of types', () => {
      expect(Object.keys(components()).length).toEqual(
        Object.keys(Wells).length,
      )
    })
  })

  describe('Blank.vue', () => {
    beforeEach(() => {
      data = {
        row: '',
        column: '',
        concentration: '',
        plateBarcode: plateBarcode,
      }
      cmp = mount(Wells.Blank, {
        props: data,
        attachTo: createContainer(),
      })
      well = cmp.vm
    })

    afterEach(() => {
      cmp.unmount()
    })

    it('has a type', () => {
      expect(well.type).toEqual('Blank')
    })

    it('has the correct class', () => {
      expect(well.$el.className).toMatch('blank')
    })
  })

  describe('Empty.vue', () => {
    beforeEach(() => {
      data = {
        row: '',
        column: '',
        concentration: '',
        plateBarcode: plateBarcode,
      }
      cmp = mount(Wells.Empty, {
        props: data,
        attachTo: createContainer(),
      })
      well = cmp.vm
    })

    afterEach(() => {
      cmp.unmount()
    })

    it('has a type', () => {
      expect(well.type).toEqual('Empty')
    })

    it('has the correct class', () => {
      expect(well.$el.className).toMatch('empty')
    })
  })

  describe('Control.vue', () => {
    beforeEach(() => {
      data = {
        row: 'B',
        column: '8',
        concentration: '25.12',
        plateBarcode: plateBarcode,
      }
      cmp = mount(Wells.Control, {
        props: data,
        attachTo: createContainer(),
      })
      well = cmp.vm
    })

    afterEach(() => {
      cmp.unmount()
    })

    it('outputs concentration', () => {
      expect(well.$el.textContent).toMatch(new RegExp(well.concentration))
    })

    it('has a type', () => {
      expect(well.type).toEqual('Control')
    })

    it('has the correct class', () => {
      expect(well.$el.className).toMatch('control')
    })
  })

  describe('Standard.vue', () => {
    beforeEach(() => {
      data = {
        row: 'B',
        column: '4',
        concentration: '26.101',
        plateBarcode: plateBarcode,
      }
      cmp = mount(Wells.Standard, {
        props: data,
        attachTo: createContainer(),
      })
      well = cmp.vm
    })

    afterEach(() => {
      cmp.unmount()
    })

    it('outputs concentration', () => {
      expect(well.$el.textContent).toMatch(new RegExp(well.concentration))
    })

    it('has the correct class', () => {
      expect(well.$el.className).toMatch('standard')
    })

    it('has a type', () => {
      expect(well.type).toEqual('Standard')
    })
  })

  describe('Sample.vue', () => {
    let $Store, plate, cmpPlate

    beforeEach(() => {
      cmpPlate = mount(Plate, {
        mocks: { $Store },
        props: { barcode: plateBarcode },
      })
      plate = cmpPlate.vm
      $Store = Store
      $Store.qcAssayList.add(plate)

      data = {
        row: 'B',
        column: '4',
        concentration: '26.101',
        id: 'A1',
        plateBarcode: plateBarcode,
      }
      cmp = mount(Wells.Sample, {
        global:{mocks: { $Store }},
        props: data,
        attachTo: createContainer(),
      })
      well = cmp.vm
    })

    afterEach(() => {
      cmp.unmount()
    })

    it('has an id', () => {
      expect(well.id).toEqual(data.id)
    })

    it('has a type', () => {
      expect(well.type).toEqual('Sample')
    })

    it('outputs concentration', () => {
      expect(well.$el.textContent).toMatch(new RegExp(well.concentration))
    })

    describe('parsed concentration', () => {
      it('when the concentration is a string float', () => {
        expect(well.parsedConcentration).toEqual(26.101)
      })

      it('when the concentration is a float', () => {
        data = {
          row: 'B',
          column: '4',
          concentration: 26.101,
          id: 'A1',
          plateBarcode: plateBarcode,
        }
        cmp = mount(Wells.Sample, {
          global:{mocks: { $Store }},
          props: data,
          attachTo: createContainer(),
        })
        expect(cmp.vm.parsedConcentration).toEqual(26.101)
      })

      it('when the concentration is a number', () => {
        data = {
          row: 'B',
          column: '4',
          concentration: 1000,
          id: 'A1',
          plateBarcode: plateBarcode,
        }
        cmp = mount(Wells.Sample, {
          global:{mocks: { $Store }},
          props: data,
          attachTo: createContainer(),
        })
        expect(cmp.vm.parsedConcentration).toEqual(1000)
      })

      it('when the concentration is empty', () => {
        data = {
          row: 'B',
          column: '4',
          concentration: '',
          id: 'A1',
          plateBarcode: plateBarcode,
        }
        cmp = mount(Wells.Sample, {
          global:{mocks: { $Store }},
          props: data,
          attachTo: createContainer(),
        })
        expect(cmp.vm.parsedConcentration).toBe(NaN)
      })

      it('when the concentration is n.a.', () => {
        data = {
          row: 'B',
          column: '4',
          concentration: 'n.a.',
          id: 'A1',
          plateBarcode: plateBarcode,
        }
        cmp = mount(Wells.Sample, {
          global: {
          mocks: { $Store }
        },
          props: data,
          attachTo: createContainer(),
        })
        expect(cmp.vm.parsedConcentration).toBe(NaN)
      })
    })

    it('outputs id', () => {
      expect(well.$el.textContent).toMatch(data.id)
    })

    it('produces some json', () => {
      expect(well.json).toEqual({
        row: data.row,
        column: data.column,
        type: 'Sample',
        concentration: data.concentration,
        id: data.id,
        active: true,
      })
      well.active = false
      expect(well.json).toEqual({
        row: data.row,
        column: data.column,
        type: 'Sample',
        concentration: data.concentration,
        id: data.id,
        active: false,
      })
    })

    it('has the correct class', () => {
      expect(well.$el.className).toMatch('sample')
    })

    it('on clicking renders it inactive', async () => {
      await cmp.trigger('click')
      expect(well.active).toBeFalsy()
      expect(well.$el.className).toMatch('inactive')

      await cmp.trigger('click')
      expect(well.active).toBeTruthy()
      expect(well.$el.className).not.toMatch('inactive')
      expect(well.$el.className).toMatch('sample')
    })

    it('will create a replicate', () => {
      const replicate = well.store.qcAssayList
        .find(plateBarcode)
        .replicates.find(well.id)
      expect(replicate).toBeTruthy()
      expect(well.replicate).toEqual(replicate)
    })

    describe('Outlier', () => {
      let well1, well2, well3

      beforeEach(() => {
        $Store = new newStore()
        $Store.qcAssayList.add(plate)
        well1 = mount(Wells.Sample, { 
          global:{mocks: { $Store }},
          props: {
            row: 'A',
            column: '13',
            id: 'A7',
            concentration: '0.69',
            type: 'Sample',
            plateBarcode: plateBarcode,
          },
          attachTo: createContainer(),
        })
        well2 = mount(Wells.Sample, {
          global:{mocks: { $Store }},
          props: {
            row: 'A',
            column: '14',
            id: 'A7',
            concentration: '2.677',
            type: 'Sample',
            plateBarcode: plateBarcode,
          },
          attachTo: createContainer(),
        })
        well3 = mount(Wells.Sample, {
          global:{mocks: { $Store }},
          props: {
            row: 'B',
            column: '13',
            id: 'A7',
            concentration: '0.665',
            type: 'Sample',
            plateBarcode: plateBarcode,
          },
          attachTo: createContainer(),
        })
        // TODO: transparency is key. This is not it.
        well1.vm.replicate.options.cvThreshold = 15
        well1.vm.replicate.options.outlier = { type: 'cv', threshold: 15 }
        well1.vm.replicate.outliers()
      })

      afterEach(() => {
        cmp.unmount()
      })

      // this would be better to check class but this is brittle
      it('has the correct class', () => {
        expect(well1.vm.outlier).toBeTruthy()
        expect(well2.vm.outlier).toBeTruthy()
        expect(well3.vm.outlier).toBeTruthy()
      })

      // this would be better to check class but this is brittle
      it('removing outlier will be reflected in all wells', async () => {
        await well2.trigger('click')
        expect(well2.vm.$el.className).toMatch('inactive')
        expect(well1.vm.outlier).toBeFalsy()
        expect(well3.vm.outlier).toBeFalsy()
      })
    })

    it('has the expected warning defaults', () => {
      expect(well.warning.message).toBeFalsy
      expect(well.$el.textContent).not.toMatch(new RegExp('brief'))
    })

    describe('Warning', () => {
      beforeEach(() => {
        data = {
          row: 'B',
          column: '4',
          concentration: '2.0', // below the threshold
          id: 'A1',
          plateBarcode: plateBarcode,
        }

        cmp = mount(Wells.Sample, {
          global:{mocks: { $Store }},
          props: data,
          attachTo: createContainer(),
        })
        well = cmp.vm
      })

      afterEach(() => {
        cmp.unmount()
      })

      it('sets the correct values when the concentration is under the threshold', () => {
        expect(well.warning.message).toBeTruthy
        expect(well.warning.message).toBe('Warning: This is a test warning.')
        expect(well.warning.shortMessage).toBe('brief')
        expect(well.$el.textContent).toMatch(new RegExp('brief'))
      })
    })
  })
})
