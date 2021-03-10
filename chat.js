new Vue({
  el: '#app',
  data: {
    name: "",
    isLogined: false,
    messages: [],
    writingMessage: "",
    errorMessage: {name: "", writingMessage: ""},
    ws: null
  },
  methods: {
    sendMessage() {
      this.errorMessage.writingMessage = ""
      if (this.writingMessage.trim() === "") {
        this.errorMessage.writingMessage = "空白は送信できません"
        return
      }
      this.send({
        type: "send",
        name: this.name,
        text: this.writingMessage
      })
      this.writingMessage = "";
      
    },
    login() {
      this.errorMessage.name = ""
      if (this.name.trim() === "") {
        this.errorMessage.name = "名前を入力してから入室してください"
        return
      }
      this.ws = new WebSocket('ws://biimata:9000')
      this.ws.addEventListener("open", () => {
        this.setRecieveEvent()
        this.send({
          type: "login",
          name: this.name
        })
        this.isLogined = true
      })
      this.ws.addEventListener("error", () => {
        this.errorMessage.name = "サーバーに接続できません"
      })
    },
    logout() {
      this.ws.send(JSON.stringify({
        type: "logout",
        name: this.name
      }))
      if (this.ws?.readyState === 1) {
        this.ws.close()
      }
      this.name = ""
      this.messages = []
      this.isLogined = false
    },
    send(data) {
      if (this.ws?.readyState !== 1) {
        this.logout()
        this.errorMessage.name = "接続が切れたのでログアウトしました"
        return
      }
      this.ws.send(JSON.stringify(data))
    },
    setRecieveEvent() {
      this.ws.addEventListener("message", e => {
        this.messages.push(e.data)
        this.$nextTick().then(() => {
          const displayMessagesEl = this.$refs.displayMessages
          displayMessagesEl.scrollTop = displayMessagesEl.scrollHeight - displayMessagesEl.clientHeight;
        })
      })
    }
  }
})