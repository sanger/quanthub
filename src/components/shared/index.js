import QuanthubMessage from '@/components/QuanthubMessage.vue'
import QuanthubCloseIcon from '@/components/shared/icons/QuanthubCloseIcon.vue'
import QuanthubModal from '@/components/shared/QuanthubModal.vue'
import BadgeLabel from '@/components/shared/BadgeLabel.vue'
import CustomButton from '@/components/shared/CustomButton.vue'
import CustomSelect from '@/components/shared/CustomSelect.vue'

const registerBootstrapComponents = (vue) => {
  /* eslint-disable vue/component-definition-name-casing */
  vue.component('quanthub-close-icon', QuanthubCloseIcon)
  vue.component('quanthub-alert', QuanthubMessage)
  vue.component('quanthub-modal', QuanthubModal)
  vue.component('badge-label', BadgeLabel)
  vue.component('custom-button', CustomButton)
  vue.component('custom-select', CustomSelect)
}

const registerGlobal = (vue) => {
  registerBootstrapComponents(vue)
}

export { registerGlobal }
