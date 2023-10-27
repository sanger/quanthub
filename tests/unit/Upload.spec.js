import Upload from '@/components/Upload.vue'
import { mount, localVue } from './testHelper'

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
