import { BBadge } from 'bootstrap-vue'

import QuanthubMessage from '@/components/QuanthubMessage.vue'
import QuanthubCloseIcon from '@/components/shared/icons/QuanthubCloseIcon.vue'
import QuanthubModal from '@/components/shared/QuanthubModal.vue'

const registerBootstrapComponents = (vue) => {
  /* eslint-disable vue/component-definition-name-casing */
  vue.component('quanthub-badge', BBadge)
  vue.component('quanthub-close-icon', QuanthubCloseIcon)
  vue.component('quanthub-alert', QuanthubMessage)
  vue.component('quanthub-modal', QuanthubModal)
}

const registerGlobal = (vue) => {
  registerBootstrapComponents(vue)
}

export { registerGlobal }
