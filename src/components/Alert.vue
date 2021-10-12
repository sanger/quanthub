<!-- A simple Alert. -->
<template>
  <div class="alert">
     <b-alert :show="dismissCountDown"
              dismissible
              :dismiss-after-seconds="5"
              :variant="type"
              @dismissed="dismissCountDown=0"
              @dismiss-count-down="countDownChanged">
      <h4 class="text-center">{{message}}</h4>
    </b-alert>
  </div>
</template>

<script>

export default {
  name: 'Alert',
  data () {
    return {
      message: '',
      type: '',
      dismissSecs: 10,
      dismissCountDown: 0
    }
  },
  methods: {
    countDownChanged (dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    show (message, type) {
      this.message = message
      this.type = type
      this.dismissCountDown = this.dismissSecs
    }
  }
}
</script>
