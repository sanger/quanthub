import Vue from 'vue'
import { mount } from '@vue/test-utils'
import QuantType from '@/components/QuantType'

describe('CsvFile.vue', () => {

  let cmp, quantType, options

  beforeEach(() => {
    options = { conversion: { 
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
  
})