/**
 * LiQu Player — UIManager
 * Constructs and coordinates the liquid glass UI elements, menus,
 * time scrubbing, and responsive layouts.
 */
import { icons } from '../utils/icons.js';
import { formatTime, formatRemainingTime, clamp } from '../utils/formatters.js';

export class UIManager {
  constructor(player) {
    this.player = player;
    this.container = player.container;
    this.opts = player.options;
    this.activeMenu = null;
    this.activeMenuGlassInst = null;
    this.isScrubbing = false;
    this.showRemaining = true;
    this.activeSubtitleTrack = -1; // -1 = Off
    this.contextMenu = null;
    this.contextMenuGlassInst = null;

    this.buildDOM();
    this.bindEvents();
  }

  buildDOM() {
    this.container.classList.add('liqu-player-container');
    this.container.setAttribute('tabindex', '0');

    // Ambient glow canvas/div behind video
    this.ambientGlow = document.createElement('div');
    this.ambientGlow.className = 'liqu-ambient-glow';
    this.container.appendChild(this.ambientGlow);

    // Media wrapper
    this.mediaWrapper = document.createElement('div');
    this.mediaWrapper.className = 'liqu-media-wrapper';
    this.container.appendChild(this.mediaWrapper);

    // Video element - NO HARDCODED CROSSORIGIN!
    this.video = document.createElement('video');
    this.video.className = 'liqu-video-element';
    this.video.playsInline = true;
    this.video.setAttribute('webkit-playsinline', 'true');
    if (this.opts.crossOrigin) this.video.crossOrigin = this.opts.crossOrigin;
    if (this.opts.poster) this.video.poster = this.opts.poster;
    if (this.opts.autoplay) this.video.autoplay = true;
    if (this.opts.muted) this.video.muted = true;
    if (this.opts.loop) this.video.loop = true;

    // Load initial subtitles tracks if present
    if (Array.isArray(this.opts.subtitles)) {
      this.opts.subtitles.forEach((sub, idx) => {
        const track = document.createElement('track');
        track.kind = sub.kind || 'subtitles';
        track.label = sub.label || `Track ${idx + 1}`;
        track.srclang = sub.srclang || 'en';
        track.src = sub.src;
        if (sub.default) {
          track.default = true;
          this.activeSubtitleTrack = idx;
        }
        this.video.appendChild(track);
      });
    }

    this.mediaWrapper.appendChild(this.video);

    // Click interceptor overlay: absorbs all pointer clicks over embedded iframes & media
    this.clickInterceptor = document.createElement('div');
    this.clickInterceptor.className = 'liqu-click-interceptor';
    this.mediaWrapper.appendChild(this.clickInterceptor);

    this.player.video = this.video;
    this.player.mediaWrapper = this.mediaWrapper;

    // Controls overlay
    this.controlsOverlay = document.createElement('div');
    this.controlsOverlay.className = 'liqu-controls-overlay';
    this.container.appendChild(this.controlsOverlay);

    // Spinner
    this.spinner = document.createElement('div');
    this.spinner.className = 'liqu-spinner-container liqu-glass-pill';
    this.spinner.innerHTML = icons.spinner;
    this.controlsOverlay.appendChild(this.spinner);

    // Error Overlay (Issue #2)
    this.errorOverlay = document.createElement('div');
    this.errorOverlay.className = 'liqu-error-overlay liqu-glass-card';
    this.errorOverlay.style.display = 'none';
    this.errorOverlay.innerHTML = `
      <div class="liqu-error-icon">${icons.alertCircle}</div>
      <div class="liqu-error-title">Playback Error</div>
      <div class="liqu-error-msg">The media could not be loaded.</div>
      <button class="liqu-btn liqu-error-retry liqu-glass-pill">${icons.refresh} <span>Retry</span></button>
    `;
    this.controlsOverlay.appendChild(this.errorOverlay);
    this.errorOverlay.querySelector('.liqu-error-retry').addEventListener('click', (e) => {
      e.stopPropagation();
      this.player.retry();
    });

    // TOP BAR
    this.topBar = document.createElement('div');
    this.topBar.className = 'liqu-top-bar';

    const topLeft = document.createElement('div');
    topLeft.className = 'liqu-top-left';

    const backBtn = document.createElement('button');
    backBtn.className = 'liqu-btn liqu-glass-circle liqu-back-btn';
    backBtn.title = 'Back';
    backBtn.setAttribute('aria-label', 'Back');
    backBtn.innerHTML = icons.back;
    topLeft.appendChild(backBtn);

    // Title badge with safe textContent (Prevents XSS)
    const titleBadge = document.createElement('div');
    titleBadge.className = 'liqu-title-badge liqu-glass-pill';
    const titleText = document.createElement('span');
    titleText.className = 'liqu-title-text';
    titleText.textContent = this.opts.title || 'LiQu Player';
    titleBadge.appendChild(titleText);

    if (this.opts.subtitle) {
      const titleSub = document.createElement('span');
      titleSub.className = 'liqu-title-sub';
      titleSub.textContent = this.opts.subtitle;
      titleBadge.appendChild(titleSub);
    }
    topLeft.appendChild(titleBadge);
    this.topBar.appendChild(topLeft);

    // Top Right Actions Dock (All 7 icons available on all devices)
    const topRight = document.createElement('div');
    topRight.className = 'liqu-top-right';
    topRight.innerHTML = `
      <div class="liqu-top-actions liqu-glass-pill">
        <div class="liqu-vol-wrapper">
          <button class="liqu-btn liqu-vol-btn" title="Volume / Mute" aria-label="Volume">
            ${icons.volumeHigh}
          </button>
          <div class="liqu-vol-slider-popover liqu-glass-pill">
            <input type="range" class="liqu-vol-slider" min="0" max="1" step="0.01" value="1">
          </div>
        </div>
        <button class="liqu-btn liqu-cc-btn" title="Subtitles" aria-label="Subtitles">
          ${icons.subtitles}
        </button>
        <button class="liqu-btn liqu-speed-btn" title="Speed" aria-label="Playback Speed">
          ${icons.speedometer}
        </button>
        <button class="liqu-btn liqu-quality-btn" title="Quality" aria-label="Quality">
          ${icons.quality}
        </button>
        <button class="liqu-btn liqu-settings-btn" title="Settings" aria-label="Settings">
          ${icons.settings}
        </button>
        <button class="liqu-btn liqu-pip-btn" title="Picture in Picture / Floating Player" aria-label="Floating Player">
          ${icons.pip}
        </button>
        <button class="liqu-btn liqu-fullscreen-btn" title="Fullscreen" aria-label="Fullscreen">
          ${icons.fullscreen}
        </button>
      </div>
    `;
    this.topBar.appendChild(topRight);
    this.controlsOverlay.appendChild(this.topBar);

    // Floating Player Dock Back Button (Visible when floating)
    this.floatingDockBtn = document.createElement('button');
    this.floatingDockBtn.className = 'liqu-btn liqu-floating-dock-btn liqu-glass-circle';
    this.floatingDockBtn.title = 'Dock player';
    this.floatingDockBtn.innerHTML = icons.close;
    this.floatingDockBtn.style.display = 'none';
    this.controlsOverlay.appendChild(this.floatingDockBtn);

    // CENTER CONTROLS (Floating Liquid Glass Bubbles)
    this.centerControls = document.createElement('div');
    this.centerControls.className = 'liqu-center-controls';
    this.centerControls.innerHTML = `
      <button class="liqu-btn liqu-seek-btn liqu-seek-back liqu-glass-circle" title="Rewind 10 seconds" aria-label="Rewind 10s">
        ${icons.replay10}
      </button>
      <button class="liqu-btn liqu-play-btn liqu-glass-orb" title="Play / Pause" aria-label="Play">
        <span class="liqu-play-icon">${icons.play}</span>
        <span class="liqu-pause-icon" style="display:none">${icons.pause}</span>
      </button>
      <button class="liqu-btn liqu-seek-btn liqu-seek-forward liqu-glass-circle" title="Forward 10 seconds" aria-label="Forward 10s">
        ${icons.forward10}
      </button>
    `;
    this.controlsOverlay.appendChild(this.centerControls);

    // SUBTITLE / CAPTIONS DISPLAY LAYER (Authentic Frosted Liquid Typography)
    this.captionsLayer = document.createElement('div');
    this.captionsLayer.className = 'liqu-captions-layer';
    this.captionsLayer.style.display = 'none';
    this.captionsText = document.createElement('div');
    this.captionsText.className = 'liqu-captions-text';
    this.captionsLayer.appendChild(this.captionsText);
    this.controlsOverlay.appendChild(this.captionsLayer);

    // NEXT EPISODE PILL (If configured)
    if (this.opts.nextEpisode) {
      this.nextEpisodeBtn = document.createElement('button');
      this.nextEpisodeBtn.className = 'liqu-next-btn liqu-glass-pill';
      this.nextEpisodeBtn.innerHTML = `<span>${this.opts.nextEpisode.title || 'Next Episode'}</span> ${icons.chevronRight}`;
      this.controlsOverlay.appendChild(this.nextEpisodeBtn);
    }

    // BOTTOM DOCK (Seek Bar & Timestamps)
    this.bottomDock = document.createElement('div');
    this.bottomDock.className = 'liqu-bottom-dock liqu-glass-pill';
    this.bottomDock.innerHTML = `
      <span class="liqu-time-current">0:00</span>
      <div class="liqu-scrub-bar" role="slider" aria-label="Video scrubber" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
        <div class="liqu-scrub-rail">
          <div class="liqu-scrub-buffer"></div>
          <div class="liqu-scrub-progress">
            <div class="liqu-scrub-thumb"></div>
          </div>
        </div>
        <div class="liqu-scrub-tooltip liqu-glass-pill">0:00</div>
      </div>
      <span class="liqu-time-remaining">-0:00</span>
    `;
    this.controlsOverlay.appendChild(this.bottomDock);

    // POPUP MENUS CONTAINER
    this.popoverContainer = document.createElement('div');
    this.popoverContainer.className = 'liqu-popovers-container';
    this.controlsOverlay.appendChild(this.popoverContainer);

    // HUD OVERLAYS (Volume / Brightness Pill Feedback)
    this.hudPill = document.createElement('div');
    this.hudPill.className = 'liqu-hud-pill liqu-glass-pill';
    this.hudPill.innerHTML = `<span class="liqu-hud-icon"></span><span class="liqu-hud-text"></span>`;
    this.controlsOverlay.appendChild(this.hudPill);

    // Cache element references
    this.playBtn = this.centerControls.querySelector('.liqu-play-btn');
    this.playIcon = this.centerControls.querySelector('.liqu-play-icon');
    this.pauseIcon = this.centerControls.querySelector('.liqu-pause-icon');
    this.seekBackBtn = this.centerControls.querySelector('.liqu-seek-back');
    this.seekFwdBtn = this.centerControls.querySelector('.liqu-seek-forward');
    this.backBtn = this.topBar.querySelector('.liqu-back-btn');
    this.volBtn = this.topBar.querySelector('.liqu-vol-btn');
    this.volSlider = this.topBar.querySelector('.liqu-vol-slider');
    this.ccBtn = this.topBar.querySelector('.liqu-cc-btn');
    this.speedBtn = this.topBar.querySelector('.liqu-speed-btn');
    this.qualityBtn = this.topBar.querySelector('.liqu-quality-btn');
    this.settingsBtn = this.topBar.querySelector('.liqu-settings-btn');
    this.pipBtn = this.topBar.querySelector('.liqu-pip-btn');
    this.fullscreenBtn = this.topBar.querySelector('.liqu-fullscreen-btn');
    this.timeCurrent = this.bottomDock.querySelector('.liqu-time-current');
    this.timeRemaining = this.bottomDock.querySelector('.liqu-time-remaining');
    this.scrubBar = this.bottomDock.querySelector('.liqu-scrub-bar');
    this.scrubProgress = this.bottomDock.querySelector('.liqu-scrub-progress');
    this.scrubBuffer = this.bottomDock.querySelector('.liqu-scrub-buffer');
    this.scrubTooltip = this.bottomDock.querySelector('.liqu-scrub-tooltip');

    // Apply liquid glass engine
    this.applyLiquidMaterials();

    // Automatic Compact / Mobile Responsive Detection
    this.checkCompactMode = () => {
      const w = this.container.offsetWidth;
      const h = this.container.offsetHeight;
      const isCompact = (w > 0 && w < 680) || (h > 0 && h < 340);
      this.container.classList.toggle('liqu-compact-mode', isCompact);
    };
    this.checkCompactMode();
    if (typeof ResizeObserver !== 'undefined') {
      this.compactRo = new ResizeObserver(this.checkCompactMode);
      this.compactRo.observe(this.container);
    }
  }

  applyLiquidMaterials() {
    const le = this.player.liquidEngine;
    if (!le) return;

    le.apply(this.playBtn, { isOrb: true, scale: -100, chroma: 5, border: 0.04, mapBlur: 10 });
    le.apply(this.seekBackBtn, { radius: 25, scale: -35, chroma: 2, border: 0.06 });
    le.apply(this.seekFwdBtn, { radius: 25, scale: -35, chroma: 2, border: 0.06 });
    le.apply(this.backBtn, { radius: 20, scale: -35, chroma: 2, border: 0.06 });

    const titleBadge = this.topBar.querySelector('.liqu-title-badge');
    const topActions = this.topBar.querySelector('.liqu-top-actions');
    if (titleBadge) le.apply(titleBadge, { radius: 20, scale: -40, chroma: 2, border: 0.05 });
    if (topActions) le.apply(topActions, { radius: 20, scale: -40, chroma: 2, border: 0.05 });
    le.apply(this.bottomDock, { radius: 24, scale: -45, chroma: 2, border: 0.05 });

    if (this.nextEpisodeBtn) {
      le.apply(this.nextEpisodeBtn, { radius: 20, scale: -40, chroma: 2, border: 0.05 });
    }
  }

  bindEvents() {
    this.playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.player.togglePlay();
    });

    this.seekBackBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.player.seekBy(-10);
    });
    this.seekFwdBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.player.seekBy(10);
    });

    this.backBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.opts.onBack) this.opts.onBack();
      else if (window.history.length > 1) window.history.back();
    });

    this.volBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.player.toggleMute();
    });
    this.volSlider.addEventListener('input', (e) => {
      e.stopPropagation();
      this.player.setVolume(parseFloat(e.target.value));
    });

    this.speedBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMenu('speed');
    });
    this.qualityBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMenu('quality');
    });
    this.settingsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMenu('settings');
    });
    this.ccBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMenu('subtitles');
    });

    this.floatingDockBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.player.toggleFloatingMode(false);
    });

    this.pipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.player.togglePiP();
    });
    this.fullscreenBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.player.toggleFullscreen();
    });

    if (this.nextEpisodeBtn) {
      this.nextEpisodeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.opts.nextEpisode.onClick) {
          this.opts.nextEpisode.onClick();
        }
      });
    }

    this.timeRemaining.addEventListener('click', (e) => {
      e.stopPropagation();
      this.showRemaining = !this.showRemaining;
      this.updateProgress();
    });

    this.bindScrubberEvents();

    // Click interceptor over iframe media to capture clicks & toggles
    this.clickInterceptor.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeMenu();
      this.closeContextMenu();
      this.player.togglePlay();
    });

    this.container.addEventListener('click', (e) => {
      this.closeContextMenu();
      if (!e.target.closest('.liqu-popover') && !e.target.closest('.liqu-btn') && !e.target.closest('.liqu-bottom-dock') && !e.target.closest('.liqu-top-bar')) {
        this.closeMenu();
        this.player.togglePlay();
      } else if (!e.target.closest('.liqu-popover') && !e.target.closest('.liqu-btn')) {
        this.closeMenu();
      }
    });

    // Custom Right-Click Liquid Glass Context Menu
    this.container.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.showContextMenu(e);
    });

    this._onDocClick = (e) => {
      if (this.contextMenu && !this.contextMenu.contains(e.target)) {
        this.closeContextMenu();
      }
    };
    this._onDocKeydown = (e) => {
      if (e.key === 'Escape') {
        this.closeContextMenu();
        this.closeMenu();
      }
    };
    document.addEventListener('click', this._onDocClick);
    document.addEventListener('keydown', this._onDocKeydown);

    // Native video lifecycle & state event listeners
    this.video.addEventListener('play', () => {
      this.showSpinner(false);
      this.player._handlePlay('native');
    });
    this.video.addEventListener('pause', () => {
      this.showSpinner(false);
      this.player._handlePause('native');
    });
    this.video.addEventListener('ended', () => {
      this.showSpinner(false);
      this.player._handleEnded('native');
    });
    this.video.addEventListener('timeupdate', () => {
      const cur = this.video.currentTime || 0;
      const dur = (isFinite(this.video.duration) && this.video.duration > 0) ? this.video.duration : 0;
      const pct = dur > 0 ? (cur / dur) : 0;
      this.player.onTimeUpdateBridge(cur, dur, pct);
    });
    this.video.addEventListener('waiting', () => {
      this.showSpinner(true);
    });
    this.video.addEventListener('playing', () => {
      this.showSpinner(false);
    });
    this.video.addEventListener('canplay', () => {
      this.showSpinner(false);
    });
    this.video.addEventListener('canplaythrough', () => {
      this.showSpinner(false);
    });
    this.video.addEventListener('loadeddata', () => {
      this.showSpinner(false);
    });

    // Native video error listener (guarded against embeds & empty unloads)
    this.video.addEventListener('error', () => {
      const sm = this.player.sourceManager;
      if (sm && (sm.sourceType === 'youtube' || sm.sourceType === 'vimeo' || sm.sourceType === 'test_pattern')) {
        return;
      }
      if (!this.video.currentSrc && !this.video.getAttribute('src')) {
        return;
      }
      const err = this.video.error;
      if (!err || (!this.video.src && err.code === 4)) {
        return;
      }
      let msg = 'Playback failed.';
      if (err.code === 1) msg = 'Playback was aborted.';
      else if (err.code === 2) msg = 'Network connection failed.';
      else if (err.code === 3) msg = 'Video decode error.';
      else if (err.code === 4) msg = 'Video format not supported or cross-origin access denied.';
      this.showError(msg);
      this.player.emit('error', err || msg);
    });
  }

  bindScrubberEvents() {
    const onScrubMove = (e) => {
      const rect = this.scrubBar.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const pos = clamp((clientX - rect.left) / rect.width, 0, 1);
      const targetTime = pos * this.player.getDuration();

      this.scrubTooltip.style.left = `${pos * 100}%`;
      this.scrubTooltip.textContent = formatTime(targetTime);
      this.scrubTooltip.style.opacity = '1';

      if (this.isScrubbing) {
        this.scrubProgress.style.width = `${pos * 100}%`;
        this.timeCurrent.textContent = formatTime(targetTime);
      }
    };

    const onScrubEnd = (e) => {
      if (!this.isScrubbing) return;
      this.isScrubbing = false;
      this.scrubBar.classList.remove('liqu-scrubbing');
      const rect = this.scrubBar.getBoundingClientRect();
      const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
      const pos = clamp((clientX - rect.left) / rect.width, 0, 1);
      this.player.seekTo(pos * this.player.getDuration());
      this.scrubTooltip.style.opacity = '0';
      window.removeEventListener('pointermove', onScrubMove);
      window.removeEventListener('pointerup', onScrubEnd);
    };

    this.scrubBar.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      this.isScrubbing = true;
      this.scrubBar.classList.add('liqu-scrubbing');
      onScrubMove(e);
      window.addEventListener('pointermove', onScrubMove);
      window.addEventListener('pointerup', onScrubEnd);
    });

    this.scrubBar.addEventListener('pointerenter', () => {
      this.scrubTooltip.style.opacity = '1';
    });
    this.scrubBar.addEventListener('pointerleave', () => {
      if (!this.isScrubbing) {
        this.scrubTooltip.style.opacity = '0';
      }
    });
    this.scrubBar.addEventListener('pointermove', onScrubMove);
  }

  updatePlayState(isPlaying) {
    if (isPlaying) {
      this.playIcon.style.display = 'none';
      this.pauseIcon.style.display = 'block';
      this.container.classList.add('liqu-playing');
    } else {
      this.playIcon.style.display = 'block';
      this.pauseIcon.style.display = 'none';
      this.container.classList.remove('liqu-playing');
    }
  }

  updateProgress() {
    if (this.isScrubbing) return;
    const current = this.player.getCurrentTime();
    const duration = this.player.getDuration();
    if (!duration || !isFinite(duration)) return;

    const percent = (current / duration) * 100;
    this.scrubProgress.style.width = `${percent}%`;
    this.timeCurrent.textContent = formatTime(current);

    if (this.showRemaining) {
      this.timeRemaining.textContent = formatRemainingTime(current, duration);
    } else {
      this.timeRemaining.textContent = formatTime(duration);
    }

    const buffered = this.player.getBuffered();
    if (buffered && buffered.length) {
      const bufEnd = buffered.end(buffered.length - 1);
      const bufPercent = (bufEnd / duration) * 100;
      this.scrubBuffer.style.width = `${Math.min(bufPercent, 100)}%`;
    }

    // Active subtitle cue update
    this.updateActiveCaption(current);
  }

  updateActiveCaption(current) {
    if (!this.captionsLayer) return;
    if (this.activeSubtitleTrack < 0) {
      this.captionsLayer.style.display = 'none';
      return;
    }

    let text = '';
    const tracks = this.opts.subtitles || [];
    const activeTrack = tracks[this.activeSubtitleTrack];

    // 1. Check custom cues array
    if (activeTrack && Array.isArray(activeTrack.cues)) {
      const match = activeTrack.cues.find(c => current >= c.start && current <= c.end);
      if (match) text = match.text;
    }

    // 2. Check native textTrack activeCues
    if (!text && this.video && this.video.textTracks && this.video.textTracks[this.activeSubtitleTrack]) {
      const nativeTrack = this.video.textTracks[this.activeSubtitleTrack];
      if (nativeTrack.activeCues && nativeTrack.activeCues.length > 0) {
        text = nativeTrack.activeCues[0].text;
      }
    }

    if (text) {
      this.captionsText.textContent = text;
      this.captionsLayer.style.display = 'flex';
    } else {
      this.captionsLayer.style.display = 'none';
    }
  }

  updateVolume(volume, isMuted) {
    this.volSlider.value = isMuted ? 0 : volume;
    if (isMuted || volume === 0) {
      this.volBtn.innerHTML = icons.volumeMute;
    } else {
      this.volBtn.innerHTML = icons.volumeHigh;
    }
  }

  updateFullscreenState(isFullscreen) {
    if (isFullscreen) {
      this.fullscreenBtn.innerHTML = icons.exitFullscreen;
      this.container.classList.add('liqu-fullscreen');
    } else {
      this.fullscreenBtn.innerHTML = icons.fullscreen;
      this.container.classList.remove('liqu-fullscreen');
    }
  }

  showSpinner(show) {
    this.spinner.style.display = show ? 'flex' : 'none';
  }

  showError(msg) {
    this.showSpinner(false);
    this.errorOverlay.querySelector('.liqu-error-msg').textContent = msg;
    this.errorOverlay.style.display = 'flex';
  }

  hideError() {
    this.errorOverlay.style.display = 'none';
  }

  showHUD(iconSvg, text) {
    this.hudPill.querySelector('.liqu-hud-icon').innerHTML = iconSvg;
    this.hudPill.querySelector('.liqu-hud-text').textContent = text;
    this.hudPill.classList.add('liqu-show');
    clearTimeout(this.hudTimer);
    this.hudTimer = setTimeout(() => {
      this.hudPill.classList.remove('liqu-show');
    }, 1200);
  }

  toggleMenu(type) {
    if (this.activeMenu === type) {
      this.closeMenu();
      return;
    }
    this.closeMenu();
    this.activeMenu = type;
    this.player.isMenuOpen = true;

    const popover = document.createElement('div');
    popover.className = `liqu-popover liqu-popover-${type} liqu-glass-card`;

    if (type === 'speed') {
      popover.innerHTML = this.renderSpeedMenu();
    } else if (type === 'settings') {
      popover.innerHTML = this.renderSettingsMenu();
    } else if (type === 'subtitles') {
      popover.innerHTML = this.renderSubtitlesMenu();
    } else if (type === 'quality') {
      popover.innerHTML = this.renderQualityMenu();
    }

    this.popoverContainer.appendChild(popover);
    this.activeMenuGlassInst = this.player.liquidEngine.apply(popover, { radius: 20, scale: -75, chroma: 4, border: 0.06 });

    this.bindMenuActions(popover, type);
  }

  closeMenu() {
    this.activeMenu = null;
    this.player.isMenuOpen = false;
    // Destroy SVG filter to prevent filter leak (Issue #7)
    if (this.activeMenuGlassInst) {
      this.activeMenuGlassInst.destroy();
      this.activeMenuGlassInst = null;
    }
    this.popoverContainer.innerHTML = '';
  }

  renderSpeedMenu() {
    const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
    const currentSpeed = this.player.getPlaybackRate();
    return `
      <div class="liqu-menu-header">Playback Speed</div>
      <div class="liqu-menu-list">
        ${speeds.map(s => `
          <button class="liqu-menu-item ${Math.abs(s - currentSpeed) < 0.01 ? 'liqu-item-active' : ''}" data-speed="${s}">
            <span>${s === 1 ? '1.0x (Normal)' : `${s}x`}</span>
            ${Math.abs(s - currentSpeed) < 0.01 ? icons.check : ''}
          </button>
        `).join('')}
      </div>
    `;
  }

  renderSettingsMenu() {
    return `
      <div class="liqu-menu-header">Settings</div>
      <div class="liqu-menu-list">
        <div class="liqu-menu-section-title">Video Quality</div>
        <button class="liqu-menu-item" data-goto="quality">
          <span>Quality</span>
          <span style="display:flex;align-items:center;gap:4px;color:var(--liqu-ink-dim);">
            ${this.getQualityLabel()} ${icons.chevronRight}
          </span>
        </button>

        <div class="liqu-menu-divider"></div>
        <div class="liqu-menu-section-title">Liquid Glass Mode</div>
        <button class="liqu-menu-item ${this.player.liquidEngine.mode === 'ultra' ? 'liqu-item-active' : ''}" data-glass="ultra">
          <span>Ultra Fluid (Apple Refraction)</span>
          ${this.player.liquidEngine.mode === 'ultra' ? icons.check : ''}
        </button>
        <button class="liqu-menu-item ${this.player.liquidEngine.mode === 'balanced' ? 'liqu-item-active' : ''}" data-glass="balanced">
          <span>Balanced (60 FPS Frosted)</span>
          ${this.player.liquidEngine.mode === 'balanced' ? icons.check : ''}
        </button>
        <button class="liqu-menu-item ${this.player.liquidEngine.mode === 'lite' ? 'liqu-item-active' : ''}" data-glass="lite">
          <span>Lite (Old Devices & Low RAM)</span>
          ${this.player.liquidEngine.mode === 'lite' ? icons.check : ''}
        </button>

        <div class="liqu-menu-divider"></div>
        <div class="liqu-menu-section-title">Cinema Ambient Glow</div>
        <button class="liqu-menu-item ${this.player.ambientGlowEnabled ? 'liqu-item-active' : ''}" data-ambient="toggle">
          <span>${this.player.ambientGlowEnabled ? 'Enabled' : 'Disabled'}</span>
          ${this.player.ambientGlowEnabled ? icons.check : ''}
        </button>

        <div class="liqu-menu-divider"></div>
        <div class="liqu-menu-section-title">Aspect Ratio</div>
        <button class="liqu-menu-item" data-aspect="contain"><span>Fit (16:9)</span></button>
        <button class="liqu-menu-item" data-aspect="cover"><span>Fill / Crop</span></button>
      </div>
    `;
  }

  getQualityLabel() {
    const cur = this.player.sourceManager.currentQualityIndex;
    if (cur === -1) return 'Auto';
    const qList = this.player.sourceManager.qualities;
    if (qList && qList[cur]) return qList[cur].label;
    return '1080p';
  }

  renderQualityMenu() {
    const sm = this.player.sourceManager;
    const curIdx = sm.currentQualityIndex;
    let list = sm.qualities;
    if (!list || !list.length) {
      list = [
        { label: '1080p (FHD)', index: 0 },
        { label: '720p (HD)', index: 1 },
        { label: '480p (SD)', index: 2 },
        { label: '360p', index: 3 }
      ];
    }

    return `
      <div class="liqu-menu-header" style="display:flex;align-items:center;justify-content:space-between;">
        <span>Video Quality</span>
        <span style="font-size:12px;opacity:0.7;">${this.getQualityLabel()}</span>
      </div>
      <div class="liqu-menu-list">
        <button class="liqu-menu-item ${curIdx === -1 ? 'liqu-item-active' : ''}" data-quality="-1">
          <span>Auto (Recommended)</span>
          ${curIdx === -1 ? icons.check : ''}
        </button>
        ${list.map(q => `
          <button class="liqu-menu-item ${curIdx === q.index ? 'liqu-item-active' : ''}" data-quality="${q.index}">
            <span>${q.label}</span>
            ${curIdx === q.index ? icons.check : ''}
          </button>
        `).join('')}
      </div>
    `;
  }

  renderSubtitlesMenu() {
    const tracks = this.opts.subtitles || [];
    return `
      <div class="liqu-menu-header">Subtitles / Captions</div>
      <div class="liqu-menu-list">
        <button class="liqu-menu-item ${this.activeSubtitleTrack === -1 ? 'liqu-item-active' : ''}" data-track="-1">
          <span>Off</span>
          ${this.activeSubtitleTrack === -1 ? icons.check : ''}
        </button>
        ${tracks.map((t, idx) => `
          <button class="liqu-menu-item ${this.activeSubtitleTrack === idx ? 'liqu-item-active' : ''}" data-track="${idx}">
            <span>${t.label || t.language || `Track ${idx + 1}`}</span>
            ${this.activeSubtitleTrack === idx ? icons.check : ''}
          </button>
        `).join('')}
      </div>
    `;
  }

  bindMenuActions(popover, type) {
    popover.addEventListener('click', (e) => {
      const btn = e.target.closest('.liqu-menu-item, [data-goto]');
      if (!btn) return;

      if (btn.dataset.goto) {
        this.toggleMenu(btn.dataset.goto);
        return;
      }

      if (type === 'speed' && btn.dataset.speed) {
        const speed = parseFloat(btn.dataset.speed);
        this.player.setPlaybackRate(speed);
        this.closeMenu();
      } else if (type === 'quality' && btn.dataset.quality) {
        const qIdx = parseInt(btn.dataset.quality, 10);
        this.player.sourceManager.setQuality(qIdx);
        this.showHUD(icons.quality, `Quality: ${this.getQualityLabel()}`);
        this.closeMenu();
      } else if (type === 'settings') {
        if (btn.dataset.glass) {
          this.player.liquidEngine.setMode(btn.dataset.glass);
          this.closeMenu();
        } else if (btn.dataset.ambient) {
          this.player.toggleAmbientGlow();
          this.closeMenu();
        } else if (btn.dataset.aspect) {
          this.video.style.objectFit = btn.dataset.aspect;
          this.closeMenu();
        }
      } else if (type === 'subtitles' && btn.dataset.track) {
        const trackIdx = parseInt(btn.dataset.track, 10);
        this.setSubtitleTrack(trackIdx);
        this.closeMenu();
      }
    });
  }

  setSubtitleTrack(index) {
    this.activeSubtitleTrack = index;
    const v = this.video;
    if (v && v.textTracks) {
      for (let i = 0; i < v.textTracks.length; i++) {
        v.textTracks[i].mode = (i === index) ? 'showing' : 'disabled';
      }
    }
    const tracks = this.opts.subtitles || [];
    if (index === -1) {
      if (this.captionsLayer) this.captionsLayer.style.display = 'none';
      this.showHUD(icons.subtitles, 'Subtitles: Off');
    } else {
      const label = (tracks[index] && tracks[index].label) ? tracks[index].label : `Track ${index + 1}`;
      this.showHUD(icons.subtitles, `Subtitles: ${label}`);
      this.updateActiveCaption(this.player.getCurrentTime());
    }
  }

  setSubtitles(tracks) {
    this.opts.subtitles = tracks || [];
    if (!this.video) return;
    const existing = this.video.querySelectorAll('track');
    existing.forEach(t => t.remove());
    this.activeSubtitleTrack = -1;
    if (Array.isArray(tracks)) {
      tracks.forEach((sub, idx) => {
        const track = document.createElement('track');
        track.kind = sub.kind || 'subtitles';
        track.label = sub.label || `Track ${idx + 1}`;
        track.srclang = sub.srclang || 'en';
        track.src = sub.src;
        if (sub.default) {
          track.default = true;
          this.activeSubtitleTrack = idx;
        }
        this.video.appendChild(track);
      });
    }
  }

  showContextMenu(e) {
    this.closeMenu();
    this.closeContextMenu();

    const menu = document.createElement('div');
    menu.className = 'liqu-context-menu liqu-glass-card';

    const isGlowOn = this.player.ambientGlowEnabled;
    const currentUrl = (this.player.sourceManager && this.player.sourceManager.currentSource)
      ? (typeof this.player.sourceManager.currentSource === 'string' ? this.player.sourceManager.currentSource : this.player.sourceManager.currentSource.src)
      : window.location.href;

    menu.innerHTML = `
      <div class="liqu-ctx-brand">
        <div class="liqu-ctx-logo">${icons.play}</div>
        <div class="liqu-ctx-info">
          <div class="liqu-ctx-name">LiQu Player <span class="liqu-ctx-badge">v1.0.0</span></div>
          <div class="liqu-ctx-desc">Liquid Glass Optical Engine</div>
        </div>
      </div>
      <div class="liqu-menu-divider"></div>
      <div class="liqu-ctx-items">
        <button class="liqu-ctx-item" data-action="toggle-play">
          <span class="liqu-ctx-item-icon">${this.player.isPlaying ? icons.pause : icons.play}</span>
          <span>${this.player.isPlaying ? 'Pause' : 'Resume'}</span>
          <span class="liqu-ctx-shortcut">Space</span>
        </button>
        <button class="liqu-ctx-item" data-action="toggle-pip">
          <span class="liqu-ctx-item-icon">${icons.pip}</span>
          <span>Picture-in-Picture / Float</span>
          <span class="liqu-ctx-shortcut">P</span>
        </button>
        <button class="liqu-ctx-item" data-action="toggle-fullscreen">
          <span class="liqu-ctx-item-icon">${icons.fullscreen}</span>
          <span>Fullscreen</span>
          <span class="liqu-ctx-shortcut">F</span>
        </button>
        <button class="liqu-ctx-item" data-action="toggle-glow">
          <span class="liqu-ctx-item-icon">${icons.settings}</span>
          <span>Ambient Cinema Glow</span>
          <span class="liqu-ctx-toggle">${isGlowOn ? 'ON' : 'OFF'}</span>
        </button>
        <div class="liqu-menu-divider"></div>
        <button class="liqu-ctx-item" data-action="copy-url">
          <span class="liqu-ctx-item-icon">${icons.forward10}</span>
          <span>Copy Media URL</span>
        </button>
        <button class="liqu-ctx-item" data-action="stats">
          <span class="liqu-ctx-item-icon">${icons.speedometer}</span>
          <span>Player Diagnostics</span>
        </button>
        <div class="liqu-menu-divider"></div>
        <a class="liqu-ctx-item liqu-ctx-link" href="https://github.com/ImAhmedZarir/LiQuPlayer.js" target="_blank" rel="noopener noreferrer">
          <span class="liqu-ctx-item-icon">${icons.check}</span>
          <span>LiQu Player on GitHub</span>
          <span class="liqu-ctx-shortcut">↗</span>
        </a>
      </div>
    `;

    this.controlsOverlay.appendChild(menu);
    this.contextMenu = menu;

    // Position relative to player container bounds
    const rect = this.container.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    const menuWidth = 240;
    const menuHeight = 280;

    if (x + menuWidth > rect.width) {
      x = Math.max(10, rect.width - menuWidth - 10);
    }
    if (y + menuHeight > rect.height) {
      y = Math.max(10, rect.height - menuHeight - 10);
    }

    menu.style.left = `${Math.max(10, x)}px`;
    menu.style.top = `${Math.max(10, y)}px`;

    // Liquid glass refraction for context menu
    if (this.player.liquidEngine) {
      this.contextMenuGlassInst = this.player.liquidEngine.apply(menu, {
        radius: 18,
        scale: -60,
        chroma: 3,
        border: 0.05
      });
    }

    // Handle context menu clicks
    menu.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const btn = ev.target.closest('[data-action]');
      if (!btn) return;
      const action = btn.dataset.action;

      if (action === 'toggle-play') {
        this.player.togglePlay();
      } else if (action === 'toggle-pip') {
        this.player.togglePiP();
      } else if (action === 'toggle-fullscreen') {
        this.player.toggleFullscreen();
      } else if (action === 'toggle-glow') {
        this.player.toggleAmbientGlow();
      } else if (action === 'copy-url') {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(currentUrl).then(() => {
            this.showHUD(icons.check, 'Media URL Copied');
          }).catch(() => {});
        } else {
          this.showHUD(icons.check, 'Media URL Copied');
        }
      } else if (action === 'stats') {
        const type = (this.player.sourceManager && this.player.sourceManager.sourceType) || 'direct';
        const dur = Math.round(this.player.getDuration());
        const cur = Math.round(this.player.getCurrentTime());
        const glass = (this.player.liquidEngine && this.player.liquidEngine.mode) || 'ultra';
        this.showHUD(icons.speedometer, `LiQu v1.0.0 | ${type.toUpperCase()} | ${glass} | ${cur}s/${dur}s`);
      }
      this.closeContextMenu();
    });
  }

  closeContextMenu() {
    if (this.contextMenuGlassInst) {
      this.contextMenuGlassInst.destroy();
      this.contextMenuGlassInst = null;
    }
    if (this.contextMenu) {
      this.contextMenu.remove();
      this.contextMenu = null;
    }
  }

  destroy() {
    if (this._onDocClick) {
      document.removeEventListener('click', this._onDocClick);
      this._onDocClick = null;
    }
    if (this._onDocKeydown) {
      document.removeEventListener('keydown', this._onDocKeydown);
      this._onDocKeydown = null;
    }
    if (this.compactRo) {
      this.compactRo.disconnect();
      this.compactRo = null;
    }
    this.closeContextMenu();
    this.closeMenu();
    this.container.innerHTML = '';
  }
}
