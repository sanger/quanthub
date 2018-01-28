import Vue from 'vue'
import Row from '@/components/Row'

describe('Row.vue', () => {

  let cmp, wells, row

  beforeEach(() => {
    wells = [ {row:'A',column:'1',content:'Sample X1',id:'A1',concentration:'3.014'},
              {row:'A',column:'2',content:'Sample X1',id:'A1',concentration:'3.163'},
              {row:'A',column:'3',content:'Sample X9',id:'A2',concentration:'5.432'} ]
    cmp = Vue.extend(Row)
    row = new cmp({ propsData: {id: 0, wells: wells}}).$mount()
  })

  it('must have a heading', () => {
    expect(row.heading).toEqual('A')
    expect(row.$el.querySelector('td').textContent).toEqual('A')
  })

  it('must have some wells', () => {
    expect(row.$el.querySelectorAll('.well'))
      .toHaveLength(3)
  })
})

