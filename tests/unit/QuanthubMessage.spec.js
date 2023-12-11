import { describe, expect, it, beforeEach } from 'vitest'
import { mount, localVue } from './testHelper'
import QuanthubMessage from '@/components/QuanthubMessage.vue'

describe('QuanthubMessage.vue', () => {
  let cmp, alert

  beforeEach(() => {
    cmp = mount(QuanthubMessage, { localVue })
    alert = cmp.vm
  })

  it('shows an alert', () => {
    alert.show('Shows a danger message', 'danger')
    expect(alert.message).toEqual('Shows a danger message')
    expect(alert.type).toEqual('danger')
  })
})
