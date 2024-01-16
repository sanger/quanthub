import QuanthubMessage from '@/components/QuanthubMessage.vue'
import QuanthubCloseIcon from '@/components/shared/icons/QuanthubCloseIcon.vue'
import QuanthubModal from '@/components/shared/QuanthubModal.vue'
import QuanthubLabel from '@/components/shared/QuanthubLabel.vue'
import QuanthubButton from '@/components/shared/QuanthubButton.vue'
import QuanthubSelect from '@/components/shared/QuanthubSelect.vue'

const registerGlobal = (vue) => {
  /* eslint-disable vue/component-definition-name-casing */
  vue.component('quanthub-close-icon', QuanthubCloseIcon)
  vue.component('quanthub-alert', QuanthubMessage)
  vue.component('quanthub-modal', QuanthubModal)
  vue.component('quanthub-label', QuanthubLabel)
  vue.component('quanthub-button', QuanthubButton)
  vue.component('quanthub-select', QuanthubSelect)
}

export { registerGlobal }
