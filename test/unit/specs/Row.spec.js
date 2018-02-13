import Vue from 'vue'
import Row from '@/components/Row'
import Store from '@/lib/Store'
import { mount } from '@vue/test-utils'

describe('Row.vue', () => {

  let cmp, wells, row, $Store

  beforeEach(() => {
    $Store = Store
    wells = [ {row:'A',column:'1',content:'Sample X1',id:'A1',concentration:'3.014'},
              {row:'A',column:'2',content:'Sample X1',id:'A1',concentration:'3.163'},
              {row:'A',column:'3',content:'Sample X9',id:'A2',concentration:'5.432'} ]
    cmp = mount(Row, { mocks: { $Store }, propsData: {id: 0, wells: wells}})
    row = cmp.vm
  })

  it('must have a heading', () => {
    expect(row.heading).toEqual('A')
    expect(row.$el.querySelector('th').textContent).toEqual('A')
  })

  it('must have some wells', () => {
    expect(row.$el.querySelectorAll('.well'))
      .toHaveLength(3)
  })

  it('converts id to string', () => {
    expect(row.idToString).toEqual('0')
  })
})

