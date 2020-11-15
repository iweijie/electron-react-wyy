import { ObserverFactory } from '../../utils/observer';
// audioprocess	a的输入缓冲区ScriptProcessorNode已准备好进行处理。
// canplay	浏览器可以播放媒体，但是估计没有足够的数据已加载到无法播放媒体的程度，而不必为进一步缓冲内容而停下来。
// canplaythrough	浏览器估计它可以播放媒体到最后，而无需停止内容缓冲。
// complete	的呈现OfflineAudioContext终止。
// durationchange	该 duration 属性已更新。
// emptied	媒体已经空了；例如，如果已加载（或部分加载）媒体，则发送此事件，并load() 调用该 方法以重新加载它。
// ended	由于已到达媒体结尾，因此播放已停止。
// loadeddata	媒体的第一帧已完成加载。
// loadedmetadata	元数据已加载。
// pause	播放已暂停。
// play	播放已开始。
// playing	由于缺少数据而被暂停或延迟后，就可以开始播放了。
// ratechange	播放速率已更改。
// seeked	一个 寻求 操作完成。
// seeking	一个 寻求 行动开始。
// stalled	用户代理正在尝试获取媒体数据，但是数据出人意​​料地不可用。
// suspend	媒体数据加载已暂停。
// timeupdate	currentTime 属性指示的时间 已更新。
// volumechange	音量已更改。
// waiting	由于暂时缺少数据，播放已停止
// type EventType =
//   | 'audioprocess'
//   | 'canplay'
//   | 'canplaythrough'
//   | 'complete'
//   | 'emptied'
//   | 'ended'
//   | 'loadeddata'
//   | 'loadedmetadata'
//   | 'play'
//   | 'pause'
//   | 'playing'
//   | 'ratechange'
//   | 'seeked'
//   | 'seeking'
//   | 'stalled'
//   | 'suspend'
//   | 'timeupdate'
//   | 'volumechange'
//   | 'waiting';

/**
 * play  ： 播放
 * pause ： 暂停
 * ended ： 播放结束，params：
 * statusChange ： Audio 状态切换,  params: AudioStatus
 */

export type EventType = 'play' | 'pause' | 'ended' | 'statusChange';

/**
 * empty  ： 空，表示当前无选中歌曲，无播放歌曲
 * loading ： 当前歌曲正在加载中
 * play ： 当前歌曲正在加载中
 * play ： 当前歌曲正在播放中
 * pause： 当前歌曲暂停播放中
 */
export type AudioStatus = 'empty' | 'loading' | 'play' | 'pause';

export interface IAudioProps {
  volume?: number;
  src?: string;
  autoplay?: boolean;
}

interface IOnHandle {
  (params: any): any;
}

class Audio {
  audio: HTMLAudioElement;
  src: string;
  volume: number;
  _observer: any;

  constructor({ volume = 1, src = '' }: IAudioProps) {
    this.audio = document.createElement('audio');
    this.src = src;
    this.volume = volume % 1;
    this._observer = new ObserverFactory();
    this._init();
  }

  on(eventType: EventType, handle: IOnHandle, once?: boolean) {
    if (once) {
      this._observer.once(eventType, handle);
    } else {
      this._observer.on(eventType, handle);
    }
  }

  remove(eventType: EventType) {
    this._observer.remove(eventType);
  }

  _init() {
    const { audio, src } = this;
    audio.addEventListener('canplay', () => {
      if (this.status === 'empty' || this.status === 'loading') {
        this.play();
      }
    });
    audio.addEventListener('ended', () => {
      // this.pause();
    });
    audio.addEventListener('waiting', () => {
      this.pause();
    });

    if (src) {
      this.handleChangeStatus('loading');
    }
  }

  get duration() {
    return this.audio.duration || 0;
  }

  switch(src: string) {
    const { audio } = this;
    if (src === this.src) {
      return;
    }
    this.src = src;
    this.pause();
    audio.src = src;
  }

  pause() {
    const { audio } = this;
    if (!audio.paused) {
      audio.pause();
      this.handleChangeStatus('pause');
    }
  }

  play() {
    const { audio } = this;
    if (!audio.played) {
      audio.play();
      this.handleChangeStatus('play');
    }
  }
  // 重新播放
  replay() {
    this.pause();
    this.clear();
    const src = this.src;
    setTimeout(() => {
      this.switch(src);
    }, 16);
  }

  clear() {
    const { audio } = this;
    audio.src = '';
    this.src = '';
  }

  handleChangeStatus(type: AudioStatus) {
    this.status = type;
    this._observer.emit('statusChange', type);
  }
}

export default Audio;
