class Audio {
  audio: HTMLAudioElement;
  constructor() {
    this.audio = document.createElement('audio');
  }

  switch(src: string) {
    const { audio } = this;
    this.handleStopAudio();
    audio.src = src;
  }

  stop() {
    const { audio } = this;
    if (!audio.paused) {
      audio.pause();
    }
  }
}

export default Audio;
