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
    this.isScrubbing = false;
    this.showRemaining = true;

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

    // Video element
    this.video = document.createElement('video');
    this.video.className = 'liqu-video-element';
    this.video.playsInline = true;
    this.video.setAttribute('webkit-playsinline', 'true');
    this.video.crossOrigin = 'anonymous';
    if (this.opts.poster) this.video.poster = this.opts.poster;
    if (this.opts.autoplay) this.video.autoplay = true;
    if (this.opts.muted) this.video.muted = true;
    if (this.opts.loop) this.video.loop = true;
    this.mediaWrapper.appendChild(this.video);
    this.player.video = this.video;
    this.player.mediaWrapper = this.mediaWrapper;

    // Controls overlay
    this.controlsOverlay = document.createElement('div');
    this.controlsOverlay.className = 'liqu-controls-overlay';
    this.container.appendChild(this.controlsOverlay);

    // Buffer spinner
    this.spinner = document.createElement('div');
    this.spinner.className = 'liqu-spinner-container liqu-glass-pill';
    this.spinner.innerHTML = icons.spinner;
    this.controlsOverlay.appendChild(this.spinner);

    // TOP BAR
    this.topBar = document.createElement('div');
    this.topBar.className = 'liqu-top-bar';
    this.topBar.innerHTML = `
      <div class="liqu-top-left">
        <button class="liqu-btn liqu-glass-circle liqu-back-btn" title="Back" aria-label="Back">
          ${icons.back}
        </button>
        <div class="liqu-title-badge liqu-glass-pill">
          <span class="liqu-title-text">${this.opts.title || 'LiQu Player'}</span>
          ${this.opts.subtitle ? `<span class="liqu-title-sub">${this.opts.subtitle}</span>` : ''}
        </div>
      </div>
      <div class="liqu-top-right">
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
          <button class="liqu-btn liqu-settings-btn" title="Settings" aria-label="Settings">
            ${icons.settings}
          </button>
          ${this.opts.downloadable !== false ? `
          <button class="liqu-btn liqu-download-btn" title="Download" aria-label="Download">
            ${icons.download}
          </button>` : ''}
          <button class="liqu-btn liqu-pip-btn" title="Picture in Picture" aria-label="Picture in Picture">
            ${icons.pip}
          </button>
          <button class="liqu-btn liqu-fullscreen-btn" title="Fullscreen" aria-label="Fullscreen">
            ${icons.fullscreen}
          </button>
        </div>
      </div>
    `;
    this.controlsOverlay.appendChild(this.topBar);

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
    this.settingsBtn = this.topBar.querySelector('.liqu-settings-btn');
    this.downloadBtn = this.topBar.querySelector('.liqu-download-btn');
    this.pipBtn = this.topBar.querySelector('.liqu-pip-btn');
    this.fullscreenBtn = this.topBar.querySelector('.liqu-fullscreen-btn');
    this.timeCurrent = this.bottomDock.querySelector('.liqu-time-current');
    this.timeRemaining = this.bottomDock.querySelector('.liqu-time-remaining');
    this.scrubBar = this.bottomDock.querySelector('.liqu-scrub-bar');
    this.scrubProgress = this.bottomDock.querySelector('.liqu-scrub-progress');
    this.scrubBuffer = this.bottomDock.querySelector('.liqu-scrub-buffer');
    this.scrubTooltip = this.bottomDock.querySelector('.liqu-scrub-tooltip');

    // Apply liquid glass engine to all glass elements
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

    // Apply spherical droplet lens to center play button (Orb)
    le.apply(this.playBtn, { isOrb: true, scale: -140, chroma: 8, border: 0.04, mapBlur: 14 });

    // Circular glass buttons
    le.apply(this.seekBackBtn, { radius: 36, scale: -95, chroma: 5, border: 0.08 });
    le.apply(this.seekFwdBtn, { radius: 36, scale: -95, chroma: 5, border: 0.08 });
    le.apply(this.backBtn, { radius: 24, scale: -85, chroma: 4, border: 0.09 });

    // Glass pill docks
    const titleBadge = this.topBar.querySelector('.liqu-title-badge');
    const topActions = this.topBar.querySelector('.liqu-top-actions');
    if (titleBadge) le.apply(titleBadge, { radius: 22, scale: -75, chroma: 4, border: 0.06 });
    if (topActions) le.apply(topActions, { radius: 24, scale: -80, chroma: 4, border: 0.06 });
    le.apply(this.bottomDock, { radius: 28, scale: -85, chroma: 5, border: 0.05 });

    if (this.nextEpisodeBtn) {
      le.apply(this.nextEpisodeBtn, { radius: 20, scale: -80, chroma: 4, border: 0.06 });
    }
  }

  bindEvents() {
    // Play/Pause center button
    this.playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.player.togglePlay();
    });

    // Seek buttons
    this.seekBackBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.player.seekBy(-10);
    });
    this.seekFwdBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.player.seekBy(10);
    });

    // Back button
    this.backBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.opts.onBack) this.opts.onBack();
      else if (window.history.length > 1) window.history.back();
    });

    // Volume button & slider
    this.volBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.player.toggleMute();
    });
    this.volSlider.addEventListener('input', (e) => {
      e.stopPropagation();
      this.player.setVolume(parseFloat(e.target.value));
    });

    // Menus
    this.speedBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMenu('speed');
    });
    this.settingsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMenu('settings');
    });
    this.ccBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMenu('subtitles');
    });

    // Download button
    if (this.downloadBtn) {
      this.downloadBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleDownload();
      });
    }

    // PiP & Fullscreen
    this.pipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.player.togglePiP();
    });
    this.fullscreenBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.player.toggleFullscreen();
    });

    // Next Episode
    if (this.nextEpisodeBtn) {
      this.nextEpisodeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.opts.nextEpisode.onClick) {
          this.opts.nextEpisode.onClick();
        }
      });
    }

    // Time toggle (current / remaining)
    this.timeRemaining.addEventListener('click', (e) => {
      e.stopPropagation();
      this.showRemaining = !this.showRemaining;
      this.updateProgress();
    });

    // Scrubbing on seek bar
    this.bindScrubberEvents();

    // Close menu on container click
    this.container.addEventListener('click', (e) => {
      if (!e.target.closest('.liqu-popover') && !e.target.closest('.liqu-btn')) {
        this.closeMenu();
      }
    });
  }

  bindScrubberEvents() {
    const onScrubMove = (e) => {
      const rect = this.scrubBar.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const pos = clamp((clientX - rect.left) / rect.width, 0, 1);
      const targetTime = pos * this.player.getDuration();

      // Tooltip position & content
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

    // Buffer update
    const buffered = this.player.getBuffered();
    if (buffered && buffered.length) {
      const bufEnd = buffered.end(buffered.length - 1);
      const bufPercent = (bufEnd / duration) * 100;
      this.scrubBuffer.style.width = `${Math.min(bufPercent, 100)}%`;
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
    }

    this.popoverContainer.appendChild(popover);
    this.player.liquidEngine.apply(popover, { radius: 20, scale: -75, chroma: 4, border: 0.06 });

    this.bindMenuActions(popover, type);
  }

  closeMenu() {
    this.activeMenu = null;
    this.player.isMenuOpen = false;
    this.popoverContainer.innerHTML = '';
  }

  renderSpeedMenu() {
    const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
    const currentSpeed = this.player.getPlaybackRate();
    return `
      <div class="liqu-menu-header">Playback Speed</div>
      <div class="liqu-menu-list">
        ${speeds.map(s => `
          <button class="liqu-menu-item ${s === currentSpeed ? 'liqu-item-active' : ''}" data-speed="${s}">
            <span>${s === 1 ? '1.0x (Normal)' : `${s}x`}</span>
            ${s === currentSpeed ? icons.check : ''}
          </button>
        `).join('')}
      </div>
    `;
  }

  renderSettingsMenu() {
    return `
      <div class="liqu-menu-header">Settings</div>
      <div class="liqu-menu-list">
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

  renderSubtitlesMenu() {
    const tracks = this.opts.subtitles || [];
    return `
      <div class="liqu-menu-header">Subtitles / Captions</div>
      <div class="liqu-menu-list">
        <button class="liqu-menu-item liqu-item-active" data-track="off">
          <span>Off</span>
          ${icons.check}
        </button>
        ${tracks.map((t, idx) => `
          <button class="liqu-menu-item" data-track="${idx}">
            <span>${t.label || t.language || `Track ${idx + 1}`}</span>
          </button>
        `).join('')}
      </div>
    `;
  }

  bindMenuActions(popover, type) {
    popover.addEventListener('click', (e) => {
      const btn = e.target.closest('.liqu-menu-item');
      if (!btn) return;

      if (type === 'speed' && btn.dataset.speed) {
        const speed = parseFloat(btn.dataset.speed);
        this.player.setPlaybackRate(speed);
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
      } else if (type === 'subtitles') {
        this.closeMenu();
      }
    });
  }

  handleDownload() {
    const src = this.player.sourceManager.currentSource;
    const url = typeof src === 'string' ? src : (src && src.src ? src.src : null);
    if (url && (url.startsWith('http') || url.startsWith('blob'))) {
      const a = document.createElement('a');
      a.href = url;
      a.download = this.opts.title || 'video.mp4';
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      this.showHUD(icons.download, 'Stream Download Unavailable');
    }
  }

  destroy() {
    if (this.compactRo) {
      this.compactRo.disconnect();
      this.compactRo = null;
    }
    this.closeMenu();
    this.container.innerHTML = '';
  }
}
