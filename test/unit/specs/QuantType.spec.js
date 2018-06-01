import Vue from 'vue'
import { mount } from '@vue/test-utils'
import QuantType from '@/components/QuantType'
import * as Cells from '@/lib/QuantTypes'

describe('CsvFile.vue', () => {

  let cmp, quantType, options

  beforeEach(() => {
    options = { 
                _cell: 'PlateReader',
                conversion: { 
                  factors: { 
                    dilution: 500, standardInsertSize: 452, libraryInsertSize: 573
                  },
                  expression: "(dilution*standardInsertSize)/libraryInsertSize"
                }
              }
    cmp = Vue.extend(QuantType)
    quantType = new cmp({ propsData: options })
  })

  it('provides a conversion factor', () => {
    expect(quantType.conversionFactor).toEqual("394.415")
  })

  it('provides a cell type', () => {
    expect(quantType.cell).toEqual(Cells.PlateReader)
  })
  
})