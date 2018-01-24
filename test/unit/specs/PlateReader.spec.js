import Vue from 'vue'
import PlateReader from '@/components/PlateReader'

describe('PlateReader.vue', () => {

  let cmp, vm

  beforeEach(() => {
    cmp = Vue.extend(PlateReader) // Create a copy of the original component
    vm = new cmp({
    }).$mount() // Instances and mounts the component
  })


  it('should render correct contents', () => {
    expect(vm.$el.querySelector('.plate-reader h1').textContent)
      .toEqual('Plate Reader')
  })

  it('should create a 384 well plate', () => {
    expect(vm.$el.querySelector('table').querySelectorAll('th')).toHaveLength(25)
    expect(vm.$el.querySelector('table').querySelectorAll('tr')).toHaveLength(16)
    expect(vm.$el.querySelector('table').querySelector('tr').querySelectorAll('td')).toHaveLength(25)
  })
})
