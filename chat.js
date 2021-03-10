new Vue({
  el: '#app',
  data: {
    name: "",
    isEntered: false,
    messages: [],
    writingMessage: "",
    errorMessage: {name: ""},
    ws: null
  },
  methods: {
    sendMessage() {
      this.send({
        type: "send",
        name: this.name,
        text: this.writingMessage
      })
      this.writingMessage = "";
      
    },
    enter() {
      this.errorMessage.name = ""
      if (this.name.trim() === "") {
        this.errorMessage.name = "名前を入力してから入室してください"
        return
      }
      this.ws = new WebSocket('ws://biimata:9000')
      this.ws.addEventListener("open", () => {
        this.setRecieveEvent()
        this.send({
          type: "enter",
          name: this.name
        })
        this.isEntered = true
      })
      this.ws.addEventListener("error", () => {
        this.errorMessage.name = "サーバーに接続できません"
      })
    },
    leave() {
      this.ws.send(JSON.stringify({
        type: "leave",
        name: this.name
      }))
      if (this.ws?.readyState === 1) {
        this.ws.close()
      }
      this.name = ""
      this.messages = []
      this.isEntered = false
    },
    send(data) {
      if (this.ws?.readyState !== 1) {
        this.leave()
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