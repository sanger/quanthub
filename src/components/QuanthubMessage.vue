<!--/**
   * # QuanthubMessage
   * Tailwind component to display an alert message. This component uses  html component (based on tailwind styles) 
   * The alert message includes message and a close button 
   * 
   */
   -->
<template>
  <div>
    <div
      v-if="isDisplayed"
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
      setTimeout(this.dismiss, 10000)
    },
  },
}
</script>
