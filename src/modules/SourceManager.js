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
    this.vimeoDuration = 0;
    this.vimeoCurrentTime = 0;
    this.qualities = [];
    this.currentQualityIndex = -1; // -1 = Auto
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
    return 'direct';
  }

  async load(source) {
    this.unload();
    this.currentSource = source;
    const url = typeof source === 'string' ? source : (source ? source.src : '');
    this.sourceType = this.detectSourceType(url);
    this.qualities = [];
    this.currentQualityIndex = -1;

    // Hide error overlay on new load
    this.player.hideError();

    try {
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
    } catch (err) {
      console.error('[LiQuPlayer] Source load failed:', err);
      this.player.showError('Could not load media source. Please verify URL or network.');
    }
  }

  loadDirect(url) {
    const video = this.player.video;
    this.hideExternalFrames();
    video.style.display = 'block';

    // DO NOT set crossOrigin by default — prevents CORS failure on external servers!
    if (this.player.options.crossOrigin) {
      video.crossOrigin = this.player.options.crossOrigin;
    } else {
      video.removeAttribute('crossorigin');
    }

    video.src = url;
    video.load();

    if (this.player.options.autoplay) {
      try {
        const p = video.play();
        if (p && typeof p.catch === 'function') {
          p.catch(err => {
            console.warn('[LiQuPlayer] Autoplay prevented, retrying muted:', err);
            if (!this.player.isMuted()) {
              this.player.toggleMute(true);
              try {
                const p2 = video.play();
                if (p2 && typeof p2.catch === 'function') p2.catch(() => {});
              } catch (_) {}
            }
          });
        }
      } catch (_) {}
    }
  }

  async loadHLS(url) {
    const video = this.player.video;
    this.hideExternalFrames();
    video.style.display = 'block';

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      if (this.player.options.autoplay) {
        try {
          const p = video.play();
          if (p && typeof p.catch === 'function') {
            p.catch(err => {
              if (!this.player.isMuted()) {
                this.player.toggleMute(true);
                try {
                  const p2 = video.play();
                  if (p2 && typeof p2.catch === 'function') p2.catch(() => {});
                } catch (_) {}
              }
            });
          }
        } catch (_) {}
      }
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
        this.qualities = data.levels.map((l, index) => ({
          label: l.height ? `${l.height}p` : `${Math.round(l.bitrate / 1000)}k`,
          height: l.height,
          bitrate: l.bitrate,
          index
        }));
        this.player.emit('qualities', this.qualities);

        // Sync subtitle tracks from HLS manifest
        if (this.hlsInstance.subtitleTracks && this.hlsInstance.subtitleTracks.length > 0) {
          const subs = this.hlsInstance.subtitleTracks.map((st, i) => ({
            label: st.name || st.lang || `Track ${i + 1}`,
            language: st.lang || 'en',
            index: i
          }));
          this.player.setSubtitles(subs);
        }

        if (this.player.options.autoplay) {
          try {
            const p = video.play();
            if (p && typeof p.catch === 'function') {
              p.catch(err => {
                console.warn('[LiQuPlayer] HLS autoplay prevented, retrying muted:', err);
                if (!this.player.isMuted()) {
                  this.player.toggleMute(true);
                  try {
                    const p2 = video.play();
                    if (p2 && typeof p2.catch === 'function') p2.catch(() => {});
                  } catch (_) {}
                }
              });
            }
          } catch (_) {}
        }
      });

      this.hlsInstance.on(window.Hls.Events.ERROR, (e, data) => {
        if (data.fatal) {
          switch (data.type) {
            case window.Hls.ErrorTypes.NETWORK_ERROR:
              this.hlsInstance.startLoad();
              break;
            case window.Hls.ErrorTypes.MEDIA_ERROR:
              this.hlsInstance.recoverMediaError();
              break;
            default:
              this.player.showError('HLS fatal stream error.');
              break;
          }
        }
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
      this.dashInstance.initialize(video, url, this.player.options.autoplay || false);
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
      this.player.showError('Invalid YouTube URL or Video ID.');
      return;
    }

    this.player.video.style.display = 'none';

    // Wrapper preserves .liqu-youtube-frame class; mount node is replaced by iframe!
    let ytWrapper = this.player.container.querySelector('.liqu-youtube-frame');
    if (!ytWrapper) {
      ytWrapper = document.createElement('div');
      ytWrapper.className = 'liqu-youtube-frame';
      this.player.mediaWrapper.insertBefore(ytWrapper, this.player.video);
    }
    ytWrapper.style.display = 'block';
    ytWrapper.innerHTML = '<div class="liqu-yt-mount"></div>';
    const mountNode = ytWrapper.querySelector('.liqu-yt-mount');

    // Load YT IFrame API safely without race condition
    if (typeof window.YT === 'undefined' || !window.YT.Player) {
      await new Promise(resolve => {
        if (window.YT && window.YT.Player) return resolve();
        const prev = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
          if (typeof prev === 'function') prev();
          resolve();
        };
        const poll = setInterval(() => {
          if (window.YT && window.YT.Player) {
            clearInterval(poll);
            resolve();
          }
        }, 50);
        this.loadScript('https://www.youtube.com/iframe_api').then(() => {
          if (window.YT && window.YT.Player) {
            clearInterval(poll);
            resolve();
          }
        });
      });
    }

    return new Promise(resolve => {
      try {
        const originUrl = (typeof window !== 'undefined' && window.location && window.location.origin && window.location.origin !== 'null' && !window.location.origin.startsWith('file')) ? window.location.origin : undefined;
        this.ytPlayer = new window.YT.Player(mountNode, {
          videoId: videoId,
          playerVars: {
            autoplay: this.player.options.autoplay ? 1 : 0,
            controls: 0,
            modestbranding: 1,
            rel: 0,
            iv_load_policy: 3,
            playsinline: 1,
            disablekb: 1,
            fs: 0,
            enablejsapi: 1,
            origin: originUrl
          },
          events: {
            onReady: () => {
              // Apply volume & rate settings once ready
              try {
                this.ytPlayer.setVolume(this.player.getVolume() * 100);
                if (this.player.isMuted()) this.ytPlayer.mute();
                this.ytPlayer.setPlaybackRate(this.player.getPlaybackRate());
                if (this.player.options.autoplay) {
                  try {
                    const res = this.ytPlayer.playVideo();
                    if (res && typeof res.catch === 'function') res.catch(() => {});
                  } catch (_) {
                    try {
                      this.ytPlayer.mute();
                      this.player.toggleMute(true);
                      const res2 = this.ytPlayer.playVideo();
                      if (res2 && typeof res2.catch === 'function') res2.catch(() => {});
                    } catch (_) {}
                  }
                }
              } catch (_) {}
              this.startYouTubeSync();
              resolve();
            },
            onStateChange: (e) => {
              if (e.data === window.YT.PlayerState.PLAYING) {
                this.player._handlePlay('youtube');
              } else if (e.data === window.YT.PlayerState.PAUSED) {
                this.player._handlePause('youtube');
              } else if (e.data === window.YT.PlayerState.ENDED) {
                this.player._handleEnded('youtube');
              } else if (e.data === window.YT.PlayerState.BUFFERING) {
                this.player.ui.showSpinner(true);
              }
            },
            onError: (e) => {
              let msg = 'YouTube playback failed.';
              if (e.data === 101 || e.data === 150) {
                msg = 'This video owner does not allow third-party embedded playback.';
              } else if (e.data === 2) {
                msg = 'Invalid YouTube video ID.';
              } else if (e.data === 100) {
                msg = 'YouTube video not found or removed.';
              }
              this.player.showError(msg);
              resolve();
            }
          }
        });
      } catch (err) {
        console.warn('[LiQuPlayer] YT.Player instantiation error, using fallback iframe:', err);
        mountNode.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&enablejsapi=1" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen style="width:100%;height:100%;border:none;"></iframe>`;
        resolve();
      }
    });
  }

  startYouTubeSync() {
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

    let vimeoWrapper = this.player.container.querySelector('.liqu-vimeo-frame');
    if (!vimeoWrapper) {
      vimeoWrapper = document.createElement('div');
      vimeoWrapper.className = 'liqu-vimeo-frame';
      this.player.mediaWrapper.insertBefore(vimeoWrapper, video);
    }
    vimeoWrapper.style.display = 'block';
    vimeoWrapper.innerHTML = '';

    this.vimeoPlayer = new window.Vimeo.Player(vimeoWrapper, {
      url: url,
      controls: false,
      autoplay: this.player.options.autoplay || false
    });

    this.vimeoPlayer.on('play', () => this.player._handlePlay('vimeo'));
    this.vimeoPlayer.on('pause', () => this.player._handlePause('vimeo'));
    this.vimeoPlayer.on('ended', () => this.player._handleEnded('vimeo'));
    this.vimeoPlayer.on('timeupdate', (data) => {
      this.vimeoCurrentTime = data.seconds || 0;
      this.vimeoDuration = data.duration || 0;
      this.player.onTimeUpdateBridge(data.seconds, data.duration, data.percent);
    });
    this.vimeoPlayer.on('loaded', async () => {
      this.vimeoDuration = await this.vimeoPlayer.getDuration();
    });
    this.vimeoPlayer.on('error', () => {
      this.player.showError('Vimeo stream failed to load.');
    });
  }

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
    let offset = 0;

    const render = () => {
      const now = (Date.now() - startTime) / 1000;
      const barW = canvas.width / bars.length;
      bars.forEach((color, i) => {
        ctx.fillStyle = color;
        ctx.fillRect(i * barW, 0, barW, canvas.height);
      });

      // Crosshair test pattern
      ctx.fillStyle = 'rgba(80, 80, 80, 0.7)';
      ctx.fillRect(180, 520, 240, 20);
      ctx.fillRect(290, 410, 20, 240);

      // Moving laser beam
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

      ctx.beginPath();
      ctx.arc(lx, canvas.height * 0.75 - (lx / canvas.width) * (canvas.height * 0.63), 12, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffff00';
      ctx.shadowBlur = 30;
      ctx.fill();
      ctx.restore();

      // Timecode
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.fillRect(16, 16, 180, 48);
      ctx.fillStyle = '#ff2222';
      ctx.font = 'bold 22px monospace';
      const fakeSeconds = Math.floor(now % 60);
      const fakeFrames = Math.floor((now * 30) % 30);
      ctx.fillText(`00:00:${fakeSeconds < 10 ? '0' : ''}${fakeSeconds}.${fakeFrames < 10 ? '0' : ''}${fakeFrames}`, 26, 48);

      if (this.player.isPlaying) {
        offset += 0.03;
        this.player.onTimeUpdateBridge(now % 39, 39, 1);
      }
      this.testCanvasAnim = requestAnimationFrame(render);
    };

    render();

    if (canvas.captureStream) {
      video.srcObject = canvas.captureStream(30);
      if (this.player.options.autoplay) {
        video.play().catch(() => {});
      }
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
        if (existing.dataset.loaded) return resolve();
        existing.addEventListener('load', resolve);
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
      try {
        const res = this.ytPlayer.playVideo();
        if (res && typeof res.catch === 'function') {
          res.catch(() => {
            try {
              this.ytPlayer.mute();
              this.player.toggleMute(true);
              const res2 = this.ytPlayer.playVideo();
              if (res2 && typeof res2.catch === 'function') res2.catch(() => {});
            } catch (_) {}
          });
        }
      } catch (_) {
        try {
          this.ytPlayer.mute();
          this.player.toggleMute(true);
          const res2 = this.ytPlayer.playVideo();
          if (res2 && typeof res2.catch === 'function') res2.catch(() => {});
        } catch (_) {}
      }
    } else if (this.sourceType === 'vimeo' && this.vimeoPlayer) {
      try {
        const res = this.vimeoPlayer.play();
        if (res && typeof res.catch === 'function') {
          res.catch(() => {
            try {
              this.vimeoPlayer.setMuted(true);
              this.player.toggleMute(true);
              this.vimeoPlayer.play().catch(() => {});
            } catch (_) {}
          });
        }
      } catch (_) {}
    } else if (this.player.video) {
      try {
        const p = this.player.video.play();
        if (p && typeof p.catch === 'function') {
          p.catch(err => {
            console.warn('[LiQuPlayer] Autoplay prevented, attempting muted playback:', err);
            if (!this.player.isMuted()) {
              this.player.toggleMute(true);
              try {
                const p2 = this.player.video.play();
                if (p2 && typeof p2.catch === 'function') {
                  p2.catch(() => {});
                }
              } catch (_) {}
            }
          });
        }
      } catch (_) {}
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
      this.vimeoCurrentTime = seconds;
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

  setQuality(index) {
    this.currentQualityIndex = index;
    if (this.hlsInstance) {
      this.hlsInstance.currentLevel = index; // -1 = Auto
    } else if (this.sourceType === 'youtube' && this.ytPlayer && this.ytPlayer.setPlaybackQuality) {
      const qMap = { 0: 'highres', 1: 'hd1080', 2: 'hd720', 3: 'large', 4: 'medium', '-1': 'default' };
      this.ytPlayer.setPlaybackQuality(qMap[index] || 'default');
    }
    this.player.emit('qualitychange', index);
  }

  unload() {
    // 1. Explicitly stop and unload native video
    if (this.player.video) {
      this.player.video.pause();
      this.player.video.removeAttribute('src');
      this.player.video.srcObject = null;
      try { this.player.video.load(); } catch (_) {}
    }

    // 2. Clear HLS & DASH
    if (this.hlsInstance) {
      this.hlsInstance.destroy();
      this.hlsInstance = null;
    }
    if (this.dashInstance) {
      this.dashInstance.reset();
      this.dashInstance = null;
    }

    // 3. Clear YouTube timer & instance
    if (this.ytTimer) {
      clearInterval(this.ytTimer);
      this.ytTimer = null;
    }
    if (this.ytPlayer) {
      try { this.ytPlayer.destroy(); } catch (_) {}
      this.ytPlayer = null;
    }

    // 4. Clear Vimeo
    if (this.vimeoPlayer) {
      try { this.vimeoPlayer.destroy(); } catch (_) {}
      this.vimeoPlayer = null;
    }

    // 5. Clear procedural canvas
    if (this.testCanvasAnim) {
      cancelAnimationFrame(this.testCanvasAnim);
      this.testCanvasAnim = null;
    }

    this.hideExternalFrames();
    this.vimeoDuration = 0;
    this.vimeoCurrentTime = 0;
  }
}
