import Alert from '@/components/Alert'
import { mount, localVue } from './testHelper'

describe('Alert.vue', () => {

  let cmp, alert

  beforeEach(() => {
    cmp = mount(Alert, { localVue } )
    alert = cmp.vm
    cmp.setData({ dismissSecs: 100})
  })

  it('shows an alert', () => {
    alert.show('another bloody alert', 'danger')
    expect(alert.message).toEqual('another bloody alert')
    expect(alert.type).toEqual('danger')
    expect(alert.dismissCountDown).toEqual(100)
  })

})
