import Vue from 'vue'
import Well from '@/components/Well'

describe('Well.vue', () => {

  let cmp, vm

  beforeEach(() => {
    cmp = Vue.extend(Well) // Create a copy of the original component
    vm = new cmp({propsData: {row: 'A', column:'1'}}).$mount()
  })

  it('should have a location', () => {
    expect(vm.location).toEqual('A1')
  })
})
