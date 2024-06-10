import QuanthubModal from '@/components/shared/QuanthubModal.vue'
import QuanthubSpinner from '@/components/shared/QuanthubSpinner.vue'
import QuanthubCloseIcon from '@/components/shared/icons/QuanthubCloseIcon.vue'
import { beforeEach, describe, expect, it } from 'vitest'

import { mount } from './testHelper'

/**
 * Note:- Modal dialog is a teleported Vue component, which doesn't appear in the actual DOM, so testing
 * the HTML content returns nothing. So we need to use findComponent method to check in virtual DOM
 * which will only return Vue components, not regular html elements
 */

describe('QuanthubModal.vue', () => {
  const buildWrapper = (props = {}) => {
    return mount(QuanthubModal, {
      props,
      slots: {
        default: 'Modal Content',
      },
    })
  }

  it('displays the dialog and content', () => {
    const wrapper = buildWrapper({ visible: true })
    const modal = wrapper.findComponent(QuanthubModal)
    expect(modal).not.toBeNull()
    expect(modal.text()).toContain('Modal Content')
  })

  it('displays the title prop', () => {
    const wrapper = buildWrapper({ visible: true, title: 'Heading' })
    const modal = wrapper.findComponent(QuanthubModal)
    expect(modal).not.toBeNull()
    expect(modal.text()).toContain('Heading')
  })

  it('displays close button', async () => {
    const wrapper = buildWrapper({ visible: true, title: 'Heading' })
    expect(wrapper.vm.display).toBe(true)
    const closebutton = wrapper.find('[data-attribute=close]')
    expect(closebutton.exists()).toBe(true)
    await closebutton.trigger('click')
    expect(wrapper.emitted()).toBeTruthy()
    expect(wrapper.vm.display).toBe(false)
  })

  it(' displays header component using modal-header slot', () => {
    const buildModalWrapper = (props = {}) => {
      return mount(QuanthubModal, {
        props: { ...props, visible: true },
        components: {
          'quanthub-spinner': QuanthubSpinner,
          'quanthub-close-icon': QuanthubCloseIcon,
        },
        slots: {
          'modal-header': '<div data-testid="header-div">Heading</div>',
        },
      })
    }
    const wrapper = buildModalWrapper()
    const headingComp = wrapper.find('[data-testid=header-div]')
    expect(headingComp.exists()).toBe(true)
  })

  it(' displays title component using "modal-title" slot', () => {
    const buildModalWrapper = (props = {}) => {
      return mount(QuanthubModal, {
        props: { ...props, visible: true },
        slots: {
          'modal-title': '<div data-testid="title-div"/>',
        },
      })
    }
    const wrapper = buildModalWrapper()
    expect(wrapper.find('[data-testid=title-div]').exists()).toBe(true)
  })

  it(' displays footer component using "modal-footer" slot', () => {
    const buildModalWrapper = (props = {}) => {
      return mount(QuanthubModal, {
        props: { ...props, visible: true },
        slots: {
          'modal-footer': '<div data-testid="footer-div"/>',
        },
      })
    }
    const wrapper = buildModalWrapper()
    expect(wrapper.find('[data-testid=footer-div]').exists()).toBe(true)
  })

  describe('Ok, cancel buttons in footer', () => {
    let wrapper
    const buildModalWrapper = (props = {}) => {
      return mount(QuanthubModal, {
        props: { ...props, visible: true },
        slots: {
          'modal-footer': `<div data-testid="footer-div">
            <button data-testid="ok-btn"> OK </button>
            <button data-testid="cancel-btn"> Cancel </button>
            </div>`,
        },
      })
    }
    beforeEach(() => {
      wrapper = buildModalWrapper()
    })

    it('displays ok, cancel  actions from footer', async () => {
      expect(wrapper.find('[data-testid=ok-btn]').exists()).toBe(true)
      expect(wrapper.find('[data-testid=cancel-btn]').exists()).toBe(true)
    })
  })
})
