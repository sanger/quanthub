/**
 * I'm currently in the place of refactoring Grid into a plain JS object
 * This is where it will be housed. Currently this is simply wrapping the vue
 * component so that we can refactor gradually.
 */

import Vue from 'vue'
import Grid from '@/components/Grid'

const component = Vue.extend(Grid)
const grid = (propsData) => new component({ propsData })

export default grid
