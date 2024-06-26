import QuanthubMessage from '@/components/QuanthubMessage.vue'
import { beforeEach, describe, expect, it } from 'vitest'

import { mount } from './testHelper'

describe('QuanthubMessage.vue', () => {
  let cmp, alert

  beforeEach(() => {
    cmp = mount(QuanthubMessage, {
      data() {
        return {
          message: 'FooBar',
        }
      },
    })
    alert = cmp.vm
  })

  it('shows an alert', () => {
    alert.show('Shows a danger message', 'danger')
    expect(alert.message).toEqual('Shows a danger message')
    expect(alert.type).toEqual('danger')
  })
})
