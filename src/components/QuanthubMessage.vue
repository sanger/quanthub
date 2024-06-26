<!--
  # QuanthubMessage

  Tailwind component displays an alert message to the user.
  It includes a close icon (QuanthubCloseIcon) that allows the user to dismiss the message.
-->

<template>
  <div v-show="isDisplayed">
    <div
      data-attribute="message"
      :class="[
        'flex flex-row border-b-2 border-gray-200 rounded rounded-md px-5 py-3 space-x-4 mb-4', //border and padding
        `text-base leading-6`, // text style
        `${color.message}`, // font color, background color
      ]"
    >
      <div class="w-full">
        {{ message }}
      </div>
      <div class="flex justify-end">
        <button data-attribute="close" @click="dismiss">
          <quanthub-close-icon :class-names="`${color.icon}`" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import QuanthubCloseIcon from '@/components/shared/icons/QuanthubCloseIcon.vue'

const colorStyles = {
  success: {
    message: 'success-message',
    icon: 'success-icon',
  },
  danger: {
    message: 'failure-message',
    icon: 'failure-icon',
  },
  warning: {
    message: 'warning-message',
    icon: 'warning-icon',
  },
}

export default {
  name: 'QuanthubMessage',
  components: {
    QuanthubCloseIcon,
  },
  data() {
    return {
      isDisplayed: false,
      message: '',
      type: '',
    }
  },
  computed: {
    /**
     * Returns tailwind colors based on 'type' property with default being grey.
     *  The supported values for 'type' property are as follows
     * 'success' -  will be displayed in green color
     * 'danger'  -  will be displayed in red color
     */
    color() {
      return (
        colorStyles[this.type] ?? {
          message: 'bg-gray-300 text-gray-500',
          icon: '',
        }
      )
    },
  },
  methods: {
    dismiss() {
      this.isDisplayed = false
    },
    show(message, type) {
      this.message = message
      this.type = type
      this.isDisplayed = true
    },
  },
}
</script>
