<!--
  # QuanthubModal

  This is a Tailwind component to display an HTML modal dialog. The overall design of this component,
  particularly the scoped slot design, data structures, and event handling, is based on how a Bootstrap
  modal works. This is to make it compatible with b-modal through the 'enable_custom_modal' feature flag.

  The modal dialog includes a header, body, and footer:
    - Header: Displayed using the 'modal-header' scoped slot. If only a title is required, use the 'title' prop or 'modal-title'.
    - Body: The default slot is displayed as the modal body.
    - Footer: Displayed using the 'modal-footer' scoped slot.
    - Close Button: Always displayed in the header, which closes the dialog on click.
-->

<template>
  <div class="contents">
    <div v-if="display">
      <!-- overlay -->
      <div
        class="fixed cursor-auto hover:cursor-auto inset-0 opacity-50 bg-black h-screen w-full justify-center items-start md:items-center pt-10 md:pt-0"
      />
      <!-- modal -->
      <div class="fixed z-20 inset-0 overflow-y-auto" @click.self="close">
        <div
          class="flex items-end justify-center pt-4 px-4 pb-20 text-center sm:block xl:p-0 opacity-100"
          @click.self="close"
        >
          <div
            class="inline-block align-bottom bg-white rounded-lg text-left text-lg overflow-hidden shadow-xl sm:my-8 sm:align-middle sm:max-w-screen-md sm:w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
            data-attribute="modal"
          >
            <div
              class="flex flex-row border-b-2 border-gray-200 p-4 pb-4 sm:p-6 sm:pb-4 bg-gray-100 text-lg leading-6 text-gray-900"
            >
              <div class="w-full mt-2">
                <template v-if="hasHeaderSlot">
                  <slot :name="`modal-header`"
                /></template>
                <template v-if="hasModalTitle">
                  <slot :name="`modal-title`"
                /></template>
                <label v-else>{{ title }}</label>
              </div>
              <div class="flex justify-end">
                <button
                  class="text-gray-700"
                  data-attribute="close"
                  @click="close"
                >
                  <quanthub-close-icon />
                </button>
              </div>
            </div>
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4"><slot /></div>
            <div class="flex bg-gray-100 px-4 py-3 sm:px-6 justify-end">
              <slot :name="`modal-footer`" :ok="ok" :cancel="cancel"></slot>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else></div>
  </div>
</template>
<script>
import QuanthubCloseIcon from '@/components/shared/icons/QuanthubCloseIcon.vue'

export default {
  name: 'QuanthubModal',
  components: {
    QuanthubCloseIcon,
  },
  inheritAttrs: false,
  props: {
    /**Prop to make the dialog visible or not */
    visible: {
      type: Boolean,
      default: false,
    },
    /**Title to display in modal header, if don't want to use scoped slots */
    title: {
      type: String,
      default: '',
    },
  },
  emits: ['ok', 'cancel'],
  data() {
    return {
      /**Mutable property to make the dialog visible or not */
      display: this.visible,
      originalScrollTop: 0,
    }
  },
  computed: {
    /**Is there a scoped slot defined to display header? */
    hasHeaderSlot() {
      return !!this.$slots['modal-header']
    },
    /**Is there a scoped slot defined to display title? */
    hasModalTitle() {
      return !!this.$slots['modal-title']
    },
  },
  watch: {
    visible(newValue) {
      this.display = newValue
      if (this.display) {
        /**Remove scrollbars in original backdrop window if any. This is required to disable scrolling of the
         * background when the modal is displayed
         */
        document.documentElement.style.overflow = 'hidden'
      } else {
        //Regain scrollbars in original window and scroll to it's original position
        this.resetScrollbar()
      }
    },
  },
  methods: {
    /**Close button clicked, so hide the dialog */
    close() {
      this.$emit('cancel')
      this.display = false
      this.resetScrollbar()
    },
    /**'ok' event emitted from footer, if there is a corresponding button in 'modal-footer' scoped slot */
    ok() {
      this.$emit('ok')
    },
    /**'cancel' event emitted from footer, if there is a corresponding button in 'modal-footer' scoped slot */
    cancel() {
      this.$emit('cancel')
    },
    resetScrollbar() {
      //Regain scrollbars in original window and scroll to it's original position
      document.documentElement.style.overflow = 'auto'
    },
  },
}
</script>
