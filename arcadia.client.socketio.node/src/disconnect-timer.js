class DisconnectTimer {
  constructor(timeout, handler) {
    this.timeout = timeout;
    this.timer = null;
    this.handler = handler;
  }

  startTimer() {
    this.timer = setTimeout(() => this.handler(), this.timeout);
  }

  restartTimer() {
    clearTimeout(this.timer);
    this.startTimer();
  }

  stopTimer() {
    clearTimeout(this.timer);
  }
}

module.exports = { DisconnectTimer };
