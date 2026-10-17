/**
 * LiQu Player — Liquid Glass Open Source Video Player
 * https://github.com/ImAhmedZarir/LiQuPlayer.js
 *
 * Highly inspired by Apple-style Liquid Glass UI with optical rim refraction,
 * dynamic spherical orbs, universal streaming format support, and low-RAM optimization.
 *
 * @author Ahmed Zarir & Contributors
 * @license MIT
 */

import { icons } from './utils/icons.js';
import { LiquidEngine } from './modules/LiquidEngine.js';
import { SourceManager } from './modules/SourceManager.js';
import { UIManager } from './modules/UIManager.js';
import { GestureManager } from './modules/GestureManager.js';
import { KeyboardManager } from './modules/KeyboardManager.js';
import { MediaSessionManager } from './modules/MediaSessionManager.js';
import { clamp } from './utils/formatters.js';

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
      theme: 'liquid',
      glassMode: 'ultra', // 'ultra', 'balanced', 'lite'
      ambientGlow: true,
      downloadable: true,
      subtitles: [],
      nextEpisode: null
    }, options);

    this.listeners = new Map();
    this.isPlaying = false;
    this.isMenuOpen = false;
    this.isFocused = false;
    this.ambientGlowEnabled = this.options.ambientGlow;
    this.brightness = 1;

    // Initialize Subsystems
    this.liquidEngine = new LiquidEngine({ mode: this.options.glassMode });
    this.ui = new UIManager(this);
    this.sourceManager = new SourceManager(this);
    this.gestures = new GestureManager(this);
    this.keyboard = new KeyboardManager(this);
    this.mediaSession = new MediaSessionManager(this);

    this.initVideoEventListeners();
    this.initFocusHandling();

    if (this.ambientGlowEnabled) {
      this.initAmbientGlow();
    }

    // Load initial source if provided
    if (this.options.source) {
      this.setSource(this.options.source);
    }

    // Set initial volume
    this.setVolume(this.options.volume);
    if (this.options.muted) this.toggleMute(true);

    this.mediaSession.updateMetadata({
      title: this.options.title,
      subtitle: this.options.subtitle,
      poster: this.options.poster
    });
  }

  initVideoEventListeners() {
    const v = this.video;

    v.addEventListener('play', () => {
      this.isPlaying = true;
      this.ui.updatePlayState(true);
      this.mediaSession.setPlaybackState('playing');
      this.emit('play');
    });

    v.addEventListener('pause', () => {
      this.isPlaying = false;
      this.ui.updatePlayState(false);
      this.mediaSession.setPlaybackState('paused');
      this.emit('pause');
    });

    v.addEventListener('timeupdate', () => {
      this.ui.updateProgress();
      this.mediaSession.updatePositionState(v.currentTime, v.duration, v.playbackRate);
      this.emit('timeupdate', { currentTime: v.currentTime, duration: v.duration });
    });

    v.addEventListener('progress', () => {
      this.ui.updateProgress();
    });

    v.addEventListener('waiting', () => {
      this.ui.showSpinner(true);
      this.emit('waiting');
    });

    v.addEventListener('playing', () => {
      this.ui.showSpinner(false);
      this.emit('playing');
    });

    v.addEventListener('canplay', () => {
      this.ui.showSpinner(false);
    });

    v.addEventListener('ended', () => {
      this.isPlaying = false;
      this.ui.updatePlayState(false);
      this.emit('ended');
      if (this.options.nextEpisode && this.options.nextEpisode.onClick) {
        this.options.nextEpisode.onClick();
      }
    });

    v.addEventListener('volumechange', () => {
      this.ui.updateVolume(v.volume, v.muted);
      this.emit('volumechange', { volume: v.volume, muted: v.muted });
    });

    document.addEventListener('fullscreenchange', () => {
      const isFs = !!document.fullscreenElement;
      this.ui.updateFullscreenState(isFs);
      this.emit('fullscreenchange', isFs);
    });
  }

  initFocusHandling() {
    this.container.addEventListener('focus', () => { this.isFocused = true; });
    this.container.addEventListener('blur', () => { this.isFocused = false; });
  }

  initAmbientGlow() {
    let glowCanvas = document.createElement('canvas');
    glowCanvas.width = 64;
    glowCanvas.height = 36;
    let glowCtx = glowCanvas.getContext('2d');
    let glowInterval = null;

    const updateGlow = () => {
      if (!this.ambientGlowEnabled || !this.isPlaying || !this.video) return;
      try {
        glowCtx.drawImage(this.video, 0, 0, 64, 36);
        const data = glowCtx.getImageData(0, 0, 64, 36).data;
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 16) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);
        this.ui.ambientGlow.style.background =
          `radial-gradient(ellipse 90% 65% at 50% 50%, rgba(${r}, ${g}, ${b}, 0.55) 0%, rgba(${r}, ${g}, ${b}, 0.15) 60%, transparent 100%)`;
      } catch (_) {}
    };

    glowInterval = setInterval(updateGlow, 500);
    this._glowCleanup = () => {
      clearInterval(glowInterval);
      glowCanvas = null;
      glowCtx = null;
    };
  }

  toggleAmbientGlow() {
    this.ambientGlowEnabled = !this.ambientGlowEnabled;
    if (!this.ambientGlowEnabled) {
      this.ui.ambientGlow.style.background = 'transparent';
    }
    this.emit('ambientchange', this.ambientGlowEnabled);
  }

  onTimeUpdateBridge(currentTime, duration, loadedFraction) {
    this.ui.timeCurrent.textContent = formatTime(currentTime);
    if (duration > 0) {
      const percent = (currentTime / duration) * 100;
      this.ui.scrubProgress.style.width = `${percent}%`;
      if (this.ui.showRemaining) {
        this.ui.timeRemaining.textContent = formatRemainingTime(currentTime, duration);
      } else {
        this.ui.timeRemaining.textContent = formatTime(duration);
      }
      this.ui.scrubBuffer.style.width = `${(loadedFraction || 0) * 100}%`;
      this.mediaSession.updatePositionState(currentTime, duration, this.getPlaybackRate());
    }
  }

  // --- Public Control Methods ---

  play() {
    this.sourceManager.play();
  }

  pause() {
    this.sourceManager.pause();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  seekTo(seconds) {
    const dur = this.getDuration();
    const target = clamp(seconds, 0, dur || 999999);
    this.sourceManager.seek(target);
  }

  seekBy(delta) {
    this.seekTo(this.getCurrentTime() + delta);
  }

  setVolume(vol) {
    const clamped = clamp(vol, 0, 1);
    this.sourceManager.setVolume(clamped);
    this.ui.updateVolume(clamped, this.isMuted());
  }

  getVolume() {
    if (this.video) return this.video.volume;
    return 1;
  }

  isMuted() {
    if (this.video) return this.video.muted;
    return false;
  }

  toggleMute(forceState) {
    const newState = forceState != null ? forceState : !this.isMuted();
    this.sourceManager.setMuted(newState);
    this.ui.updateVolume(this.getVolume(), newState);
  }

  setPlaybackRate(rate) {
    this.sourceManager.setSpeed(rate);
    this.ui.showHUD(icons.speedometer, `${rate}x Speed`);
  }

  getPlaybackRate() {
    if (this.video) return this.video.playbackRate || 1;
    return 1;
  }

  getCurrentTime() {
    if (this.sourceManager.sourceType === 'youtube' && this.sourceManager.ytPlayer && this.sourceManager.ytPlayer.getCurrentTime) {
      return this.sourceManager.ytPlayer.getCurrentTime() || 0;
    }
    return this.video ? this.video.currentTime : 0;
  }

  getDuration() {
    if (this.sourceManager.sourceType === 'youtube' && this.sourceManager.ytPlayer && this.sourceManager.ytPlayer.getDuration) {
      return this.sourceManager.ytPlayer.getDuration() || 0;
    }
    return this.video ? this.video.duration : 0;
  }

  getBuffered() {
    return this.video ? this.video.buffered : null;
  }

  async toggleFullscreen() {
    if (!document.fullscreenElement) {
      try {
        if (this.container.requestFullscreen) {
          await this.container.requestFullscreen();
        } else if (this.container.webkitRequestFullscreen) {
          await this.container.webkitRequestFullscreen();
        } else if (this.video.webkitEnterFullscreen) {
          this.video.webkitEnterFullscreen();
        }
      } catch (err) {
        console.warn('[LiQuPlayer] Fullscreen request failed:', err);
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      }
    }
  }

  async togglePiP() {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled && this.video) {
        await this.video.requestPictureInPicture();
      }
    } catch (err) {
      console.warn('[LiQuPlayer] PiP failed:', err);
    }
  }

  setBrightness(factor) {
    this.brightness = clamp(factor, 0.2, 1.8);
    this.video.style.filter = `brightness(${this.brightness})`;
  }

  showVolumeIndicator() {
    const pct = Math.round(this.getVolume() * 100);
    this.ui.showHUD(icons.volumeHigh, `${pct}%`);
  }

  showBrightnessIndicator() {
    const pct = Math.round(this.brightness * 100);
    this.ui.showHUD(icons.settings, `Brightness ${pct}%`);
  }

  setSource(source, meta = {}) {
    this.sourceManager.load(source);
    if (meta.title || meta.subtitle) {
      const titleEl = this.container.querySelector('.liqu-title-text');
      if (titleEl && meta.title) titleEl.textContent = meta.title;
      const subEl = this.container.querySelector('.liqu-title-sub');
      if (subEl && meta.subtitle) subEl.textContent = meta.subtitle;
      this.mediaSession.updateMetadata({
        title: meta.title || this.options.title,
        subtitle: meta.subtitle || this.options.subtitle,
        poster: meta.poster || this.options.poster
      });
    }
  }

  // --- Event Emitter ---

  on(event, handler) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(handler);
    return () => this.off(event, handler);
  }

  off(event, handler) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(handler);
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(fn => {
        try { fn(data); } catch (e) { console.error(e); }
      });
    }
  }

  destroy() {
    if (this._glowCleanup) this._glowCleanup();
    this.keyboard.destroy();
    this.gestures.destroy();
    this.sourceManager.unload();
    this.liquidEngine.destroy();
    this.ui.destroy();
    this.listeners.clear();
  }
}

// UMD / Global window exposure
if (typeof window !== 'undefined') {
  window.LiQuPlayer = LiQuPlayer;
}

export default LiQuPlayer;
