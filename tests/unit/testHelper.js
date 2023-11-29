import BootstrapVue from 'bootstrap-vue'
import { mount, createLocalVue } from '@vue/test-utils'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

// this is needed for the tooltip in Sample.vue to be able to find its target element to attach to
const createContainer = (tag = 'div') => {
  const container = document.createElement(tag)
  document.body.appendChild(container)

  return container
}

export { mount, localVue, createContainer }
