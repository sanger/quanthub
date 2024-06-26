import QuanthubSpinner from '@/components/shared/QuanthubSpinner.vue'
import { describe, expect, it } from 'vitest'

import { mount } from './testHelper'

describe('QuanthubSpinner.vue', () => {
  const buildWrapper = (props = {}) => {
    return mount(QuanthubSpinner, {
      props,
    })
  }

  it('displays the default color', () => {
    const wrapper = buildWrapper({})
    expect(wrapper.attributes('class')).toContain('text-sdb')
  })

  it('displays color given in props', () => {
    const wrapper = buildWrapper({ classes: 'text-red-600' })
    expect(wrapper.attributes('class')).toContain('text-red-600')
  })
})
