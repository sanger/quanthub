import Upload from '@/components/Upload.vue'
import { mount} from './testHelper'
import { describe, expect, it, beforeEach } from 'vitest'

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
