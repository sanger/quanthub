import Vue from 'vue'
import Plate from '@/components/Plate'

describe('Plate.vue', () => {

  let cmp, vm

  beforeEach(() => {
    cmp = Vue.extend(Plate) // Create a copy of the original component
    vm = new cmp({
    }).$mount() // Instances and mounts the component
  })


  it('should render correct contents', () => {
    expect(vm.$el.querySelector('.plate h1').textContent)
      .toEqual('Plate')
  })

  it('should create a 384 well plate', () => {
    expect(vm.$el.querySelector('table').querySelectorAll('th')).toHaveLength(25)
    expect(vm.$el.querySelector('table').querySelectorAll('tr')).toHaveLength(16)
    expect(vm.$el.querySelector('table').querySelector('tr').querySelectorAll('td')).toHaveLength(25)
  })
})
