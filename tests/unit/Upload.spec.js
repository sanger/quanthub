import Upload from '@/components/Upload.vue'
import quantTypes from '@/config/quantTypes'
import { beforeEach, describe, expect, it } from 'vitest'

import { mount } from './testHelper'

describe('Upload.vue', () => {
  let wrapper, upload

  beforeEach(() => {
    wrapper = mount(Upload)
    upload = wrapper.vm
  })

  it('has a message', () => {
    expect(upload.msg).toEqual('Upload')
  })

  it('shows the correct elements', () => {
    expect(wrapper.find('form').exists()).toBe(true)
    // Quant type select is visible
    expect(wrapper.find('#quant-type').exists()).toBe(true)
    // File input is hidden
    expect(wrapper.find('#file-input').exists()).toBe(true)
    expect(wrapper.find('#file-input').isVisible()).toBe(false)
    // Browse and upload buttons are visible
    expect(wrapper.find('button[type="button"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  describe('quanttype selection', () => {
    it('shows the correct data', () => {
      // Defaults to empty
      expect(wrapper.find('#quant-type').element.value).toEqual('')
      // Has the correct options
      const options = wrapper.find('#quant-type').findAll('option')
      expect(options.length).toEqual(Object.entries(quantTypes).length)
    })

    it('updates quantType when changed', async () => {
      const options = wrapper.find('#quant-type').findAll('option')
      expect(upload.quantType).toEqual(null)
      await options.at(5).setSelected()

      // Check that it updates the upload data
      const selectedQuantType = Object.entries(quantTypes)[5][0]
      expect(upload.quantType).toEqual(selectedQuantType)
    })
  })
})
