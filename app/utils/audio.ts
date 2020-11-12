class Audio {
  constructor() {
    this.audio = document.createElement('audio');
    this.init();
  }

  switchsong = (src) => {
    const audio = this.audio;
    if (!audio.paused) {
      audio.pause();
    }
    audio.src = src;
    setTimeout(() => {
      this.play();
    }, 100);
  };

  play = () => {
    var _this = this,
      audio = this.audio;
    if (this.state) {
      this.changePlayInfo({
        type: [3],
        state: false,
      });
      this.get();
    } else {
      if (!audio.paused) {
        audio.pause();
        this.changeAudio({
          type: [2],
          flag: false,
        });
      } else {
        this.changeAudio({
          type: [2],
          flag: true,
        });
        audio.play();
      }
    }
  };

  init() {
    var audio = this.audio;
    var type = this.playInfo.type;
    if (!audio) return;
    audio.loop = false;
    audio.removeEventListener('canplaythrough', this.canplaythrough);
    audio.removeEventListener('ended', this.ended);
    audio.removeEventListener('error', this.errE);
    audio.addEventListener('canplaythrough', this.canplaythrough);
    audio.addEventListener('error', this.errE);

    if (type == 0) {
      audio.addEventListener('ended', this.ended);
    } else if (type == 1) {
      audio.addEventListener('ended', this.randomended);
    } else if (type == 2) {
      audio.loop = true;
    }

    this.changeAudio({
      type: [5, 6, 7],
      canplaythrough: this.canplaythrough,
      ended: this.ended,
      randomended: this.randomended,
    });
  }
}
