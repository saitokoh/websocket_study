new Vue({
  el: '#app',
  data: {
    name: "",
    isLogin: false,
    messages: ["あああ", "いいい", "ううう"],
    writingMessage: "",
    errorMessage: {name: "", writingMessage: ""},
  },
  methods: {
    sendMessage() {
      this.errorMessage.writingMessage = ""
      if (this.writingMessage.trim() === "") {
        this.errorMessage.writingMessage = "空白は送信できません"
        return
      }
      this.messages.push(this.writingMessage);
      this.writingMessage = "";
      this.$nextTick().then(() => {
        const displayMessagesEl = this.$refs.displayMessages
        displayMessagesEl.scrollTop = displayMessagesEl.scrollHeight - displayMessagesEl.clientHeight;
      })
    },
    login() {
      this.errorMessage.name = ""
      if (this.name.trim() === "") {
        this.errorMessage.name = "名前を入力してから入室してください"
        return
      }
      this.isLogin = true
    },
    logout() {
      this.name = ""
      this.messages = []
      this.isLogin = false
    }
  }
})