import Upload from '@/components/Upload.vue'
import { mount, localVue } from './testHelper'
import { describe, expect, it, beforeEach } from 'vitest'

describe('Upload.vue', () => {
  let cmp, upload

  beforeEach(() => {
    cmp = mount(Upload, { localVue })
    upload = cmp.vm
  })

  it('has a message', () => {
    expect(upload.msg).toEqual('Upload')
  })
})
