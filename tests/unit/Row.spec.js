import Row from '@/components/Row'
import Store from '@/Store'
import { mount } from '@vue/test-utils'

describe('Row.vue', () => {

  let cmp, wells, row, $Store

  beforeEach(() => {
    $Store = Store
    wells = { '1': {row:'A',column:'1',type:'Sample',id:'A1',concentration:'3.014', active: true},
              '2': {row:'A',column:'2',type:'Sample',id:'A1',concentration:'3.163', active: true},
              '3': {row:'A',column:'3',type:'Sample',id:'A2',concentration:'5.432', active: true} }
    cmp = mount(Row, { mocks: { $Store }, propsData: {id: 'A', plateBarcode: 'DN1234567', wells: wells}})
    row = cmp.vm
  })

  it('must have a heading', () => {
    expect(row.$el.querySelector('th').textContent).toEqual('A')
  })

  it('must have some wells', () => {
    expect(row.$el.querySelectorAll('.well'))
      .toHaveLength(3)
  })

  it('can have a plateId', () => {
    expect(row.plateBarcode).toEqual('DN1234567')
  })

  it('can return wells as json', () => {
    expect(row.json).toEqual(Object.values(wells))
  })

})

