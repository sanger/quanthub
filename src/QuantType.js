/**
 * I'm currently in the place of refactoring QuantType into a plain JS object
 * This is where it will be housed. Currently this is simply wrapping the vue
 * component so that we can refactor gradually.
 */

import Vue from 'vue'
import QuantType from '@/components/QuantType'

const component = Vue.extend(QuantType)
const quantType = (quantType, data = {}) => {
  return new component({ data, propsData: { quantType } })
}

export default quantType
