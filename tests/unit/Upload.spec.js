import Upload from '@/components/Upload.vue'
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
})
