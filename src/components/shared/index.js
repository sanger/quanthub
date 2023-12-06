import {
  BModal,
  BAlert,
  BContainer,
  BRow,
  BCol,
  BBadge,
  BNavbar,
  BNavItem,
} from 'bootstrap-vue'

const registerBootstrapComponents = (vue) => {
  /* eslint-disable vue/component-definition-name-casing */
  vue.component('quanthub-modal', BModal)
  vue.component('quanthub-container', BContainer)
  vue.component('quanthub-navbar', BNavbar)
  vue.component('quanthub-navitem', BNavItem)
  vue.component('quanthub-bcol', BCol)
  vue.component('quanthub-brow', BRow)
  vue.component('quanthub-badge', BBadge)
  vue.component('quanthub-alert', BAlert)
}

const registerGlobal = (vue) => {
  registerBootstrapComponents(vue)
}

export { registerGlobal }
