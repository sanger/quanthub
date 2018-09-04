import Upload from '@/components/Upload'
import { mount } from '@vue/test-utils'

describe('Upload.vue', () => {

  let cmp, upload

  beforeEach(() => {
    cmp = mount(Upload, { } )
    upload = cmp.vm
  })

  it('has a message', () => {
    expect(upload.msg).toEqual('Upload')
  })

})
