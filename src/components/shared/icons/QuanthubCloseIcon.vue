<!--
  # QuanthubCloseIcon

  Tailwind component that renders a cross icon.
  This component serves multiple purposes, including indicating failure, dismissing messages, and closing windows."
-->
<template>
  <svg
    :class="[`h-4 w-4`, `${classNames}`]"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    data-attribute="close-icon"
  >
    <path
      fillRule="evenodd"
      fill="currentColor"
      stroke="currentColor"
      stroke-width="1"
      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
      clipRule="evenodd"
      data-attribute="close"
    />
  </svg>
</template>

<script>
export default {
  name: 'QuanthubCloseIcon',
  props: {
    classNames: {
      type: String,
      default: '',
    },
  },
}
</script>
