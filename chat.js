new Vue({
  el: '#app',
  data: {
    name: "",
    isEntered: false,
    messages: [],
    writingMessage: "",
    errorMessage: {name: ""},
  },
  methods: {
    sendMessage() {
      this.messages.push(this.writingMessage);
      this.writingMessage = "";
      this.$nextTick().then(() => {
        const displayMessagesEl = this.$refs.displayMessages
        displayMessagesEl.scrollTop = displayMessagesEl.scrollHeight - displayMessagesEl.clientHeight;
      })
    },
    enter() {
      this.errorMessage.name = ""
      if (this.name.trim() === "") {
        this.errorMessage.name = "名前を入力してから入室してください"
        return
      }
      this.isEntered = true
    },
    leave() {
      this.name = ""
      this.messages = []
      this.isEntered = false
    }
  }
})