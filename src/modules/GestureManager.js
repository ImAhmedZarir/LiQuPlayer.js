/**
 * LiQu Player — Gesture & Touch Manager
 * Double-tap to seek, vertical swipe brightness & volume HUD, auto-hide idle controls.
 */
import { clamp } from '../utils/formatters.js';

export class GestureManager {
  constructor(player) {
    this.player = player;
    this.container = player.container;
    this.lastTapTime = 0;
    this.lastTapX = 0;
    this.touchStartY = 0;
    this.touchStartX = 0;
    this.isSwiping = false;
    this.swipeSide = null; // 'left' (brightness) or 'right' (volume)

    this.idleTimer = null;
    this.idleTimeout = 2800; // auto-hide after 2.8s

    this.initEvents();
  }

  initEvents() {
    const c = this.container;

    // Pointer move to show controls & reset idle timer
    c.addEventListener('pointermove', () => this.onActivity(), { passive: true });
    c.addEventListener('pointerenter', () => this.onActivity(), { passive: true });
    c.addEventListener('pointerleave', () => {
      if (this.player.isPlaying) {
        this.hideControls();
      }
    }, { passive: true });

    // Touch events for mobile gestures
    c.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
    c.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
    c.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });

    // Droplet ripple on click
    c.addEventListener('click', (e) => {
      this.createRipple(e);
      this.onActivity();
    });
  }

  onActivity() {
    this.showControls();
    clearTimeout(this.idleTimer);
    if (this.player.isPlaying && !this.player.isMenuOpen) {
      this.idleTimer = setTimeout(() => {
        this.hideControls();
      }, this.idleTimeout);
    }
  }

  showControls() {
    this.container.classList.remove('liqu-idle');
    this.container.classList.add('liqu-active');
  }

  hideControls() {
    if (this.player.isMenuOpen) return;
    this.container.classList.remove('liqu-active');
    this.container.classList.add('liqu-idle');
  }

  handleTouchStart(e) {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const rect = this.container.getBoundingClientRect();
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.swipeSide = (touch.clientX - rect.left < rect.width / 2) ? 'left' : 'right';
    this.isSwiping = false;

    // Double tap detection
    const now = Date.now();
    const timeDiff = now - this.lastTapTime;
    const distDiff = Math.abs(touch.clientX - this.lastTapX);

    if (timeDiff < 300 && distDiff < 60) {
      // Double tap triggered!
      const isLeft = (touch.clientX - rect.left) < rect.width / 2;
      const seekAmount = isLeft ? -10 : 10;
      this.player.seekBy(seekAmount);
      this.showDoubleTapFeedback(isLeft, touch.clientX - rect.left, touch.clientY - rect.top);
      this.lastTapTime = 0;
      return;
    }

    this.lastTapTime = now;
    this.lastTapX = touch.clientX;
  }

  handleTouchMove(e) {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const deltaY = this.touchStartY - touch.clientY;
    const deltaX = Math.abs(touch.clientX - this.touchStartX);

    // If vertical movement dominates, handle HUD adjust
    if (Math.abs(deltaY) > 20 && deltaX < 30) {
      this.isSwiping = true;
      e.preventDefault(); // prevent native scroll
      const rect = this.container.getBoundingClientRect();
      const change = deltaY / (rect.height * 0.7);

      if (this.swipeSide === 'right') {
        // Volume adjustment
        const newVol = clamp(this.player.getVolume() + change * 0.05, 0, 1);
        this.player.setVolume(newVol);
        this.player.showVolumeIndicator();
      } else {
        // Brightness adjustment
        const newBright = clamp((this.player.brightness || 1) + change * 0.05, 0.2, 1.5);
        this.player.setBrightness(newBright);
        this.player.showBrightnessIndicator();
      }
      this.touchStartY = touch.clientY;
    }
  }

  handleTouchEnd(e) {
    this.isSwiping = false;
    this.onActivity();
  }

  showDoubleTapFeedback(isLeft, x, y) {
    const el = document.createElement('div');
    el.className = `liqu-double-tap-ripple ${isLeft ? 'liqu-tap-left' : 'liqu-tap-right'}`;
    el.innerHTML = `
      <div class="liqu-tap-inner liqu-glass-pill">
        <span>${isLeft ? '-10s' : '+10s'}</span>
      </div>
    `;
    this.container.appendChild(el);
    setTimeout(() => el.remove(), 700);
  }

  createRipple(e) {
    // Liquid ripple droplet wave
    const rect = this.container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement('div');
    ripple.className = 'liqu-droplet-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    this.container.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 800);
  }

  destroy() {
    clearTimeout(this.idleTimer);
  }
}
