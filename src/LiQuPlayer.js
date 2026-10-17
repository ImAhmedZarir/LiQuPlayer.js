/**
 * LiQu Player (LiQuPlayer.js)
 * Open Source Liquid Glass Video Player
 * https://github.com/ImAhmedZarir/LiQuPlayer.js
 *
 * (c) 2026 Ahmed Zarir & LiQu Player Open Source Team
 * Released under the MIT License.
 */

import { icons } from './utils/icons.js';
import { formatTime, formatRemainingTime, clamp } from './utils/formatters.js';
import { LiquidEngine } from './modules/LiquidEngine.js';
import { SourceManager } from './modules/SourceManager.js';
import { UIManager } from './modules/UIManager.js';
import { GestureManager } from './modules/GestureManager.js';
import { KeyboardManager } from './modules/KeyboardManager.js';
import { MediaSessionManager } from './modules/MediaSessionManager.js';

export class LiQuPlayer {
  constructor(target, options = {}) {
    this.container = typeof target === 'string' ? document.querySelector(target) : target;
    if (!this.container) {
      throw new Error(`[LiQuPlayer] Container element "${target}" not found.`);
    }

    this.options = Object.assign({
      source: null,
      title: 'The Odyssey - The Real Story',
      subtitle: '',
      poster: '',
      autoplay: false,
      muted: false,
      loop: false,
      volume: 1,
      playbackRate: 1,
      glassMode: 'ultra',
      ambientGlow: true,
      crossOrigin: undefined,
      downloadable: true,
      subtitles: [],
      nextEpisode: null,
      onBack: null
    }, options);

    this.listeners = new Map();
    this.isPlaying = false;
    this.isMenuOpen = false;
    this.ambientGlowEnabled = !!this.options.ambientGlow;
    this.brightness = 1;

    // Subsystems
    this.liquidEngine = new LiquidEngine({ mode: this.options.glassMode });
    this.sourceManager = new SourceManager(this);
    this.ui = new UIManager(this);
    this.gestureManager = new GestureManager(this);
    this.keyboardManager = new KeyboardManager(this);
    this.mediaSessionManager = new MediaSessionManager(this);

    // Fullscreen change handling
    this._onFullscreenChange = () => {
      const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
      this.container.classList.toggle('liqu-fullscreen', isFs);
      if (this.ui && this.ui.fullscreenBtn) {
        this.ui.fullscreenBtn.innerHTML = isFs ? icons.exitFullscreen : icons.fullscreen;
      }
      this.emit('fullscreenchange', isFs);
    };
    document.addEventListener('fullscreenchange', this._onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', this._onFullscreenChange);

    // Ambient glow
    if (this.ambientGlowEnabled) {
      this.initAmbientGlow();
    }

    // Load initial source if provided
    if (this.options.source) {
      this.setSource(this.options.source, {
        title: this.options.title,
        subtitle: this.options.subtitle,
        poster: this.options.poster
      });
    }

    // Set initial volume & mute state
    this.setVolume(this.options.volume);
    if (this.options.muted) this.toggleMute(true);
  }

  // --- Ambient Cinema Glow Engine ---
  initAmbientGlow() {
    if (this._glowTimer) return;
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 9;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    this._glowTimer = setInterval(() => {
      if (!this.ambientGlowEnabled || !this.isPlaying || !this.video) return;
      if (this.sourceManager.sourceType !== 'direct' && this.sourceManager.sourceType !== 'hls') return;

      try {
        ctx.drawImage(this.video, 0, 0, 16, 9);
        const data = ctx.getImageData(0, 0, 16, 9).data;
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 16) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);
        if (this.ui && this.ui.ambientGlow) {
          this.ui.ambientGlow.style.background =
            `radial-gradient(ellipse 90% 65% at 50% 50%, rgba(${r}, ${g}, ${b}, 0.55) 0%, rgba(${r}, ${g}, ${b}, 0.15) 60%, transparent 100%)`;
        }
      } catch (_) {}
    }, 500);
  }

  toggleAmbientGlow() {
    this.ambientGlowEnabled = !this.ambientGlowEnabled;
    if (this.ambientGlowEnabled) {
      this.initAmbientGlow();
    } else if (this.ui && this.ui.ambientGlow) {
      this.ui.ambientGlow.style.background = 'transparent';
    }
    this.showHUD(icons.settings, `Cinema Glow: ${this.ambientGlowEnabled ? 'ON' : 'OFF'}`);
  }

  // --- State Bridge Hooks ---
  _handlePlay(source) {
    this.isPlaying = true;
    if (this.ui) {
      this.ui.playIcon.style.display = 'none';
      this.ui.pauseIcon.style.display = 'block';
    }
    if (this.gestureManager) {
      this.gestureManager.onActivity();
    }
    if (this.mediaSessionManager) {
      this.mediaSessionManager.setPlaybackState('playing');
    }
    this.emit('play', { source });
  }

  _handlePause(source) {
    this.isPlaying = false;
    if (this.ui) {
      this.ui.playIcon.style.display = 'block';
      this.ui.pauseIcon.style.display = 'none';
    }
    if (this.gestureManager) {
      this.gestureManager.showControls();
    }
    if (this.mediaSessionManager) {
      this.mediaSessionManager.setPlaybackState('paused');
    }
    this.emit('pause', { source });
  }

  _handleEnded(source) {
    this.isPlaying = false;
    if (this.ui) {
      this.ui.playIcon.style.display = 'block';
      this.ui.pauseIcon.style.display = 'none';
    }
    if (this.gestureManager) {
      this.gestureManager.showControls();
    }
    if (this.mediaSessionManager) {
      this.mediaSessionManager.setPlaybackState('paused');
    }
    this.emit('ended', { source });
  }

  onTimeUpdateBridge(currentTime, duration, percent) {
    if (this.ui) {
      this.ui.updateProgress(currentTime, duration);
    }
    if (this.mediaSessionManager) {
      this.mediaSessionManager.updatePositionState(currentTime, duration, this.getPlaybackRate());
    }
    this.emit('timeupdate', { currentTime, duration, percent });
  }

  // --- Public API ---
  play() {
    try {
      this.sourceManager.play();
    } catch (_) {}
  }
  pause() {
    try {
      this.sourceManager.pause();
    } catch (_) {}
  }
  togglePlay() {
    const sm = this.sourceManager;
    if (sm && (sm.sourceType === 'direct' || sm.sourceType === 'hls' || sm.sourceType === 'dash')) {
      if (this.video) {
        if (this.video.paused) {
          this.play();
        } else {
          this.pause();
        }
        return;
      }
    }
    if (this.isPlaying) this.pause();
    else this.play();
  }
  seekTo(sec) { this.sourceManager.seek(clamp(sec, 0, this.getDuration() || 999999)); }
  seekBy(delta) { this.seekTo(this.getCurrentTime() + delta); }

  setVolume(vol) {
    const c = clamp(vol, 0, 1);
    this.sourceManager.setVolume(c);
    if (this.ui && this.ui.volSlider) {
      this.ui.volSlider.value = c;
      const isM = this.isMuted() || c === 0;
      this.ui.volBtn.innerHTML = isM ? icons.volumeMute : icons.volumeHigh;
    }
    this.emit('volumechange', c);
  }

  getVolume() { return this.video ? this.video.volume : 1; }
  isMuted() { return this.video ? this.video.muted : false; }

  toggleMute(force) {
    const n = force != null ? force : !this.isMuted();
    this.sourceManager.setMuted(n);
    if (this.ui && this.ui.volBtn) {
      this.ui.volBtn.innerHTML = n ? icons.volumeMute : icons.volumeHigh;
    }
    this.emit('volumechange', this.getVolume());
  }

  setBrightness(val) {
    this.brightness = clamp(val, 0.2, 1.5);
    if (this.video) {
      this.video.style.filter = `brightness(${this.brightness})`;
    }
    this.emit('brightnesschange', this.brightness);
  }

  getBrightness() { return this.brightness; }

  showBrightnessIndicator() {
    const pct = Math.round(this.brightness * 100);
    this.showHUD(icons.brightness, `Brightness: ${pct}%`);
  }

  showVolumeIndicator() {
    const pct = Math.round(this.getVolume() * 100);
    const icon = (this.isMuted() || pct === 0) ? icons.volumeMute : icons.volumeHigh;
    this.showHUD(icon, `Volume: ${pct}%`);
  }

  setPlaybackRate(r) {
    this.sourceManager.setSpeed(r);
    this.showHUD(icons.speedometer, `${r}x Speed`);
    this.emit('ratechange', r);
  }

  getPlaybackRate() { return this.video ? this.video.playbackRate || 1 : 1; }

  getCurrentTime() {
    const sm = this.sourceManager;
    if (sm) {
      if (sm.sourceType === 'youtube' && sm.ytPlayer && sm.ytPlayer.getCurrentTime) {
        return sm.ytPlayer.getCurrentTime() || 0;
      }
      if (sm.sourceType === 'vimeo') {
        return sm.vimeoCurrentTime || 0;
      }
    }
    return this.video ? this.video.currentTime : 0;
  }

  getDuration() {
    const sm = this.sourceManager;
    if (sm) {
      if (sm.sourceType === 'youtube' && sm.ytPlayer && sm.ytPlayer.getDuration) {
        return sm.ytPlayer.getDuration() || 0;
      }
      if (sm.sourceType === 'vimeo') {
        return sm.vimeoDuration || 0;
      }
    }
    return (this.video && isFinite(this.video.duration)) ? this.video.duration : 0;
  }

  getBuffered() { return this.video ? this.video.buffered : null; }

  setQuality(index) {
    this.sourceManager.setQuality(index);
    if (this.ui) {
      this.ui.showHUD(icons.quality, `Quality: ${this.ui.getQualityLabel()}`);
    }
  }

  getQualities() {
    return this.sourceManager.qualities || [];
  }

  setSubtitles(tracks) {
    if (this.ui) this.ui.setSubtitles(tracks);
  }

  toggleCaptions() {
    if (this.ui) {
      const next = (this.ui.activeSubtitleTrack === -1) ? 0 : -1;
      this.ui.setSubtitleTrack(next);
    }
  }

  async toggleFullscreen() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (this.container.requestFullscreen) await this.container.requestFullscreen();
      else if (this.container.webkitRequestFullscreen) await this.container.webkitRequestFullscreen();
    } else {
      if (document.exitFullscreen) await document.exitFullscreen();
      else if (document.webkitExitFullscreen) await document.webkitExitFullscreen();
    }
  }

  toggleFloatingMode(force) {
    const isFloating = force !== undefined ? force : !this.container.classList.contains('liqu-floating-pip');
    if (isFloating) {
      this.container.classList.add('liqu-floating-pip');
      this.showHUD(icons.pip, 'Floating Miniplayer');
      this.emit('floatingchange', true);
    } else {
      this.container.classList.remove('liqu-floating-pip');
      this.showHUD(icons.pip, 'Docked Player');
      this.emit('floatingchange', false);
    }
  }

  async togglePiP() {
    const sm = this.sourceManager;
    const isEmbed = sm && (sm.sourceType === 'youtube' || sm.sourceType === 'vimeo');

    // For embeds or browsers without native PiP support, trigger liquid floating miniplayer
    if (isEmbed || !document.pictureInPictureEnabled || !this.video) {
      this.toggleFloatingMode();
      return;
    }

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await this.video.requestPictureInPicture();
      }
    } catch (_) {
      // Fallback seamlessly to liquid floating miniplayer
      this.toggleFloatingMode();
    }
  }

  showError(msg) {
    if (this.ui) this.ui.showError(msg);
  }

  hideError() {
    if (this.ui) this.ui.hideError();
  }

  retry() {
    this.hideError();
    if (this.options.source) {
      this.setSource(this.options.source, {
        title: this.options.title,
        subtitle: this.options.subtitle,
        poster: this.options.poster
      });
    }
  }

  showHUD(iconSvg, text) {
    if (this.ui) this.ui.showHUD(iconSvg, text);
  }

  setSource(src, meta = {}) {
    this.hideError();
    this.options.source = src;
    if (meta.title) this.options.title = meta.title;
    if (meta.subtitle) this.options.subtitle = meta.subtitle;
    if (meta.poster) this.options.poster = meta.poster;

    if (this.ui) {
      const titleText = this.container.querySelector('.liqu-title-text');
      if (titleText && meta.title) titleText.textContent = meta.title;
      const titleSub = this.container.querySelector('.liqu-title-sub');
      if (titleSub && meta.subtitle) titleSub.textContent = meta.subtitle;
      if (this.video && meta.poster) this.video.poster = meta.poster;
    }

    if (this.mediaSessionManager) {
      this.mediaSessionManager.updateMetadata({
        title: meta.title || this.options.title,
        subtitle: meta.subtitle || this.options.subtitle,
        poster: meta.poster || this.options.poster
      });
    }

    this.sourceManager.load(src);
  }

  checkCompactMode() {
    if (this.ui && this.ui.checkCompactMode) {
      this.ui.checkCompactMode();
    }
  }

  // --- Events ---
  on(e, fn) {
    if (!this.listeners.has(e)) this.listeners.set(e, new Set());
    this.listeners.get(e).add(fn);
    return () => this.off(e, fn);
  }

  off(e, fn) {
    if (this.listeners.has(e)) this.listeners.get(e).delete(fn);
  }

  emit(e, d) {
    if (this.listeners.has(e)) {
      this.listeners.get(e).forEach(fn => {
        try { fn(d); } catch (err) { console.error(err); }
      });
    }
  }

  destroy() {
    if (this._onFullscreenChange) {
      document.removeEventListener('fullscreenchange', this._onFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', this._onFullscreenChange);
    }
    if (this._glowTimer) {
      clearInterval(this._glowTimer);
      this._glowTimer = null;
    }
    if (this.keyboardManager) this.keyboardManager.destroy();
    if (this.gestureManager) this.gestureManager.destroy();
    if (this.sourceManager) this.sourceManager.unload();
    if (this.liquidEngine) this.liquidEngine.destroy();
    if (this.ui) this.ui.destroy();
    this.listeners.clear();
  }
}

export default LiQuPlayer;
export {
  icons,
  formatTime,
  formatRemainingTime,
  clamp,
  LiquidEngine,
  SourceManager,
  UIManager,
  GestureManager,
  KeyboardManager,
  MediaSessionManager
};
