/**
 * LiQu Player — SourceManager
 * Universal media engine supporting Direct Video (MP4/WebM/OGG/MOV),
 * HLS (.m3u8), MPEG-DASH (.mpd), YouTube, Vimeo, and procedural test streams.
 */

export class SourceManager {
  constructor(player) {
    this.player = player;
    this.currentSource = null;
    this.sourceType = null;
    this.hlsInstance = null;
    this.dashInstance = null;
    this.ytPlayer = null;
    this.vimeoPlayer = null;
    this.testCanvasAnim = null;
  }

  detectSourceType(src) {
    if (!src) return 'unknown';
    if (typeof src === 'object' && src.src) src = src.src;
    src = src.trim();

    if (src === 'test:colorbar' || src === 'test:pattern') return 'test_pattern';
    if (/youtube\.com|youtu\.be/i.test(src) || /^[a-zA-Z0-9_-]{11}$/.test(src)) return 'youtube';
    if (/vimeo\.com/i.test(src)) return 'vimeo';
    if (/\.m3u8($|\?)/i.test(src) || src.includes('application/x-mpegURL')) return 'hls';
    if (/\.mpd($|\?)/i.test(src) || src.includes('application/dash+xml')) return 'dash';
    if (/\.(mp4|webm|ogv|ogg|mov|m4v)($|\?)/i.test(src) || src.startsWith('blob:') || src.startsWith('data:')) return 'direct';
    
    return 'direct';
  }

  async load(source) {
    this.unload();
    this.currentSource = source;
    const url = typeof source === 'string' ? source : source.src;
    this.sourceType = this.detectSourceType(url);

    switch (this.sourceType) {
      case 'youtube':
        await this.loadYouTube(url);
        break;
      case 'vimeo':
        await this.loadVimeo(url);
        break;
      case 'hls':
        await this.loadHLS(url);
        break;
      case 'dash':
        await this.loadDash(url);
        break;
      case 'test_pattern':
        this.loadTestPattern();
        break;
      case 'direct':
      default:
        this.loadDirect(url);
        break;
    }

    this.player.emit('sourceloaded', { type: this.sourceType, source });
  }

  loadDirect(url) {
    const video = this.player.video;
    this.hideExternalFrames();
    video.style.display = 'block';
    video.src = url;
    video.load();
  }

  async loadHLS(url) {
    const video = this.player.video;
    this.hideExternalFrames();
    video.style.display = 'block';

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      return;
    }

    if (typeof window.Hls === 'undefined') {
      await this.loadScript('https://cdn.jsdelivr.net/npm/hls.js@1.5.8/dist/hls.min.js');
    }

    if (window.Hls && window.Hls.isSupported()) {
      this.hlsInstance = new window.Hls({
        capLevelToPlayerSize: true,
        autoStartLoad: true
      });
      this.hlsInstance.loadSource(url);
      this.hlsInstance.attachMedia(video);

      this.hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, (e, data) => {
        const qualities = data.levels.map((l, index) => ({
          label: `${l.height}p`,
          bitrate: l.bitrate,
          index
        }));
        this.player.emit('qualities', qualities);
      });
    } else {
      video.src = url;
    }
  }

  async loadDash(url) {
    const video = this.player.video;
    this.hideExternalFrames();
    video.style.display = 'block';

    if (typeof window.dashjs === 'undefined') {
      await this.loadScript('https://cdn.jsdelivr.net/npm/dashjs@4.7.4/dist/dash.all.min.js');
    }

    if (window.dashjs) {
      this.dashInstance = window.dashjs.MediaPlayer().create();
      this.dashInstance.initialize(video, url, false);
    } else {
      video.src = url;
    }
  }

  extractYouTubeId(url) {
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|live\/))([\w-]{11})/i);
    return match ? match[1] : null;
  }

  async loadYouTube(url) {
    const videoId = this.extractYouTubeId(url);
    if (!videoId) {
      console.error('[LiQuPlayer] Invalid YouTube ID / URL:', url);
      return;
    }

    this.player.video.style.display = 'none';
    let ytContainer = this.player.container.querySelector('.liqu-youtube-frame');
    if (!ytContainer) {
      ytContainer = document.createElement('div');
      ytContainer.className = 'liqu-youtube-frame';
      this.player.mediaWrapper.insertBefore(ytContainer, this.player.video);
    }
    ytContainer.style.display = 'block';

    if (typeof window.YT === 'undefined' || !window.YT.Player) {
      await this.loadScript('https://www.youtube.com/iframe_api');
      await new Promise(resolve => {
        const prev = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
          if (prev) prev();
          resolve();
        };
        if (window.YT && window.YT.Player) resolve();
      });
    }

    return new Promise(resolve => {
      this.ytPlayer = new window.YT.Player(ytContainer, {
        videoId: videoId,
        playerVars: {
          autoplay: this.player.options.autoplay ? 1 : 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          iv_load_policy: 3,
          playsinline: 1,
          disablekb: 1,
          fs: 0
        },
        events: {
          onReady: (e) => {
            this.bridgeYouTubeEvents();
            resolve();
          },
          onStateChange: (e) => {
            if (e.data === window.YT.PlayerState.PLAYING) {
              this.player.emit('play');
            } else if (e.data === window.YT.PlayerState.PAUSED) {
              this.player.emit('pause');
            } else if (e.data === window.YT.PlayerState.ENDED) {
              this.player.emit('ended');
            } else if (e.data === window.YT.PlayerState.BUFFERING) {
              this.player.emit('waiting');
            }
          }
        }
      });
    });
  }

  bridgeYouTubeEvents() {
    // Polling interval for time & buffer sync on YouTube iframe
    clearInterval(this.ytTimer);
    this.ytTimer = setInterval(() => {
      if (!this.ytPlayer || !this.ytPlayer.getCurrentTime) return;
      try {
        const currentTime = this.ytPlayer.getCurrentTime() || 0;
        const duration = this.ytPlayer.getDuration() || 0;
        const loadedFraction = this.ytPlayer.getVideoLoadedFraction() || 0;
        this.player.onTimeUpdateBridge(currentTime, duration, loadedFraction);
      } catch (_) {}
    }, 250);
  }

  async loadVimeo(url) {
    const video = this.player.video;
    video.style.display = 'none';

    if (typeof window.Vimeo === 'undefined') {
      await this.loadScript('https://player.vimeo.com/api/player.js');
    }

    let vimeoContainer = this.player.container.querySelector('.liqu-vimeo-frame');
    if (!vimeoContainer) {
      vimeoContainer = document.createElement('div');
      vimeoContainer.className = 'liqu-vimeo-frame';
      this.player.mediaWrapper.insertBefore(vimeoContainer, video);
    }
    vimeoContainer.style.display = 'block';

    this.vimeoPlayer = new window.Vimeo.Player(vimeoContainer, {
      url: url,
      controls: false,
      autoplay: this.player.options.autoplay || false
    });

    this.vimeoPlayer.on('play', () => this.player.emit('play'));
    this.vimeoPlayer.on('pause', () => this.player.emit('pause'));
    this.vimeoPlayer.on('ended', () => this.player.emit('ended'));
    this.vimeoPlayer.on('timeupdate', (data) => {
      this.player.onTimeUpdateBridge(data.seconds, data.duration, data.percent);
    });
  }

  /**
   * Procedural test pattern generator (matching Image 2 & Image 3 SMPTE color bars)
   * Runs offline with an animated diagonal laser line and timecode!
   */
  loadTestPattern() {
    const video = this.player.video;
    this.hideExternalFrames();
    video.style.display = 'block';

    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');

    const bars = ['#ff0000', '#00ff00', '#ffff00', '#0000ff', '#ff00ff', '#00ffff'];
    let startTime = Date.now();
    let isPlaying = false;
    let offset = 0;

    const render = () => {
      const now = (Date.now() - startTime) / 1000;
      // Draw SMPTE style 6 vertical bars
      const barW = canvas.width / bars.length;
      bars.forEach((color, i) => {
        ctx.fillStyle = color;
        ctx.fillRect(i * barW, 0, barW, canvas.height);
      });

      // Draw crosshair + checkerboard test blocks
      ctx.fillStyle = 'rgba(80, 80, 80, 0.7)';
      ctx.fillRect(180, 520, 240, 20);
      ctx.fillRect(290, 410, 20, 240);

      // Checkerboard block
      const checkW = 16;
      for (let y = 460; y < 620; y += checkW) {
        for (let x = 780; x < 1100; x += checkW) {
          if ((Math.floor(x / checkW) + Math.floor(y / checkW)) % 2 === 0) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
            ctx.fillRect(x, y, checkW, checkW);
          }
        }
      }

      // Animated glowing diagonal laser line
      ctx.save();
      ctx.beginPath();
      const lx = (offset * 120) % (canvas.width + 400) - 200;
      ctx.strokeStyle = '#ff3344';
      ctx.lineWidth = 14;
      ctx.shadowColor = '#ff5566';
      ctx.shadowBlur = 25;
      ctx.moveTo(-100, canvas.height * 0.75);
      ctx.lineTo(canvas.width + 100, canvas.height * 0.12);
      ctx.stroke();

      // Moving laser beam point
      ctx.beginPath();
      ctx.arc(lx, canvas.height * 0.75 - (lx / canvas.width) * (canvas.height * 0.63), 12, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffff00';
      ctx.shadowBlur = 30;
      ctx.fill();
      ctx.restore();

      // Timecode overlay in top left
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.fillRect(16, 16, 180, 48);
      ctx.fillStyle = '#ff2222';
      ctx.font = 'bold 22px monospace';
      const fakeSeconds = Math.floor(now % 60);
      const fakeFrames = Math.floor((now * 30) % 30);
      ctx.fillText(`00:00:${fakeSeconds < 10 ? '0' : ''}${fakeSeconds}.${fakeFrames < 10 ? '0' : ''}${fakeFrames}`, 26, 48);

      if (isPlaying) {
        offset += 0.03;
        this.player.onTimeUpdateBridge(now % 39, 39, 1);
      }
      this.testCanvasAnim = requestAnimationFrame(render);
    };

    render();

    if (canvas.captureStream) {
      video.srcObject = canvas.captureStream(30);
    }
  }

  hideExternalFrames() {
    const yt = this.player.container.querySelector('.liqu-youtube-frame');
    if (yt) yt.style.display = 'none';
    const vm = this.player.container.querySelector('.liqu-vimeo-frame');
    if (vm) vm.style.display = 'none';
  }

  loadScript(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        existing.addEventListener('load', resolve);
        if (existing.dataset.loaded) return resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => {
        script.dataset.loaded = 'true';
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  play() {
    if (this.sourceType === 'youtube' && this.ytPlayer && this.ytPlayer.playVideo) {
      this.ytPlayer.playVideo();
    } else if (this.sourceType === 'vimeo' && this.vimeoPlayer) {
      this.vimeoPlayer.play();
    } else if (this.player.video) {
      this.player.video.play().catch(() => {});
    }
  }

  pause() {
    if (this.sourceType === 'youtube' && this.ytPlayer && this.ytPlayer.pauseVideo) {
      this.ytPlayer.pauseVideo();
    } else if (this.sourceType === 'vimeo' && this.vimeoPlayer) {
      this.vimeoPlayer.pause();
    } else if (this.player.video) {
      this.player.video.pause();
    }
  }

  seek(seconds) {
    if (this.sourceType === 'youtube' && this.ytPlayer && this.ytPlayer.seekTo) {
      this.ytPlayer.seekTo(seconds, true);
    } else if (this.sourceType === 'vimeo' && this.vimeoPlayer) {
      this.vimeoPlayer.setCurrentTime(seconds);
    } else if (this.player.video) {
      this.player.video.currentTime = seconds;
    }
  }

  setVolume(vol) {
    const clamped = Math.max(0, Math.min(1, vol));
    if (this.sourceType === 'youtube' && this.ytPlayer && this.ytPlayer.setVolume) {
      this.ytPlayer.setVolume(clamped * 100);
    } else if (this.sourceType === 'vimeo' && this.vimeoPlayer) {
      this.vimeoPlayer.setVolume(clamped);
    } else if (this.player.video) {
      this.player.video.volume = clamped;
    }
  }

  setMuted(muted) {
    if (this.sourceType === 'youtube' && this.ytPlayer) {
      if (muted) this.ytPlayer.mute();
      else this.ytPlayer.unMute();
    } else if (this.sourceType === 'vimeo' && this.vimeoPlayer) {
      this.vimeoPlayer.setMuted(muted);
    } else if (this.player.video) {
      this.player.video.muted = muted;
    }
  }

  setSpeed(speed) {
    if (this.sourceType === 'youtube' && this.ytPlayer && this.ytPlayer.setPlaybackRate) {
      this.ytPlayer.setPlaybackRate(speed);
    } else if (this.sourceType === 'vimeo' && this.vimeoPlayer) {
      this.vimeoPlayer.setPlaybackRate(speed);
    } else if (this.player.video) {
      this.player.video.playbackRate = speed;
    }
  }

  unload() {
    if (this.hlsInstance) {
      this.hlsInstance.destroy();
      this.hlsInstance = null;
    }
    if (this.dashInstance) {
      this.dashInstance.reset();
      this.dashInstance = null;
    }
    if (this.ytTimer) {
      clearInterval(this.ytTimer);
      this.ytTimer = null;
    }
    if (this.ytPlayer) {
      try { this.ytPlayer.destroy(); } catch (_) {}
      this.ytPlayer = null;
    }
    if (this.vimeoPlayer) {
      try { this.vimeoPlayer.destroy(); } catch (_) {}
      this.vimeoPlayer = null;
    }
    if (this.testCanvasAnim) {
      cancelAnimationFrame(this.testCanvasAnim);
      this.testCanvasAnim = null;
    }
    if (this.player.video) {
      this.player.video.removeAttribute('src');
      this.player.video.srcObject = null;
    }
  }
}
