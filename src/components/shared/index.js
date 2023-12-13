import {
  BModal,
  BContainer,
  BRow,
  BCol,
  BBadge,
  BNavbar,
  BNavItem,
} from 'bootstrap-vue'

import QuanthubMessage from '@/components/QuanthubMessage.vue'
import QuanthubCloseIcon from '@/components/shared/icons/QuanthubCloseIcon.vue'

const registerBootstrapComponents = (vue) => {
  /* eslint-disable vue/component-definition-name-casing */
  vue.component('quanthub-modal', BModal)
  vue.component('quanthub-container', BContainer)
  vue.component('quanthub-navbar', BNavbar)
  vue.component('quanthub-navitem', BNavItem)
  vue.component('quanthub-bcol', BCol)
  vue.component('quanthub-brow', BRow)
  vue.component('quanthub-badge', BBadge)
  vue.component('quanthub-close-icon', QuanthubCloseIcon)
  vue.component('quanthub-alert', QuanthubMessage)
}

const registerGlobal = (vue) => {
  registerBootstrapComponents(vue)
}

export { registerGlobal }
