/*!
 * LiQu Player v1.0.0 (LiQuPlayer.js)
 * Open Source Liquid Glass Video Player
 * https://github.com/ImAhmedZarir/LiQuPlayer.js
 *
 * (c) 2026 Ahmed Zarir & LiQu Player Open Source Team
 * Released under the MIT License.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.LiQuPlayer = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* =========================================================================
   * 1. Vector Icons (Retina Crisp)
   * ========================================================================= */
  const icons = {
    play: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v13.72a1 1 0 0 0 1.52.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14z"/></svg>`,
    pause: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5a1.5 1.5 0 0 0-1.5 1.5v11A1.5 1.5 0 0 0 7 19h2a1.5 1.5 0 0 0 1.5-1.5v-11A1.5 1.5 0 0 0 9 5H7zm8 0a1.5 1.5 0 0 0-1.5 1.5v11a1.5 1.5 0 0 0 1.5 1.5h2a1.5 1.5 0 0 0 1.5-1.5v-11A1.5 1.5 0 0 0 17 5h-2z"/></svg>`,
    replay10: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4.5 10A8 8 0 1 1 12 20a7.97 7.97 0 0 1-5.65-2.34"/>
      <polyline points="4.5 5 4.5 10 9.5 10"/>
      <text x="12" y="14.8" font-size="7.5" font-weight="800" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" text-anchor="middle" fill="currentColor" stroke="none">10</text>
    </svg>`,
    forward10: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19.5 10A8 8 0 1 0 12 20a7.97 7.97 0 0 0 5.65-2.34"/>
      <polyline points="19.5 5 19.5 10 14.5 10"/>
      <text x="12" y="14.8" font-size="7.5" font-weight="800" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" text-anchor="middle" fill="currentColor" stroke="none">10</text>
    </svg>`,
    volumeHigh: `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77zm-3.5 1.77L6.3 8.5H3a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h3.3l4.2 3.5a1 1 0 0 0 1.5-.86V5.86a1 1 0 0 0-1.5-.86zM14 8.83v6.34c1.24-.62 2-1.9 2-3.17s-.76-2.55-2-3.17z"/>
    </svg>`,
    volumeMute: `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M3.27 2L2 3.27l4.99 4.99L6.3 8.5H3a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h3.3l4.2 3.5a1 1 0 0 0 1.5-.86v-6.37l4.88 4.88c-.58.45-1.21.82-1.88 1.09v2.06c1.19-.38 2.29-.98 3.23-1.74L20.73 22 22 20.73 3.27 2zm7.23 3.86a1 1 0 0 0-1.5-.86l-2.07 1.73 3.57 3.57V5.86zm8.5 6.14c0 1.27-.76 2.55-2 3.17v-2.13c.48-.32.8-.84.8-1.04 0-.12-.04-.25-.11-.37l1.52 1.52c-.14-.72-.21-1.15-.21-1.15zM14 3.23v2.06c2.89.86 5 3.54 5 6.71 0 1.05-.24 2.05-.67 2.95l1.52 1.52A10.74 10.74 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77z"/>
    </svg>`,
    subtitles: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="4"/>
      <path d="M7 14h2a1.5 1.5 0 0 0 1.5-1.5v-1a1.5 1.5 0 0 0-1.5-1.5H7v4zm7 0h2a1.5 1.5 0 0 0 1.5-1.5v-1a1.5 1.5 0 0 0-1.5-1.5H14v4z" fill="currentColor" stroke="none"/>
    </svg>`,
    speedometer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 21a9 9 0 1 0-9-9c0 2.21.8 4.24 2.12 5.82L12 12"/>
      <circle cx="12" cy="12" r="2.5" fill="currentColor"/>
      <path d="m14 10 4-4"/>
    </svg>`,
    settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="4" y1="7" x2="20" y2="7"/>
      <circle cx="9" cy="7" r="2" fill="currentColor"/>
      <line x1="4" y1="17" x2="20" y2="17"/>
      <circle cx="15" cy="17" r="2" fill="currentColor"/>
    </svg>`,
    download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 3v12m0 0 4-4m-4 4-4-4"/>
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>
    </svg>`,
    pip: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="3"/>
      <rect x="12" y="11" width="8" height="6" rx="1.5" fill="currentColor"/>
    </svg>`,
    fullscreen: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M15 3h6v6M9 21H3v-6M21 15v6h-6M3 9V3h6"/>
    </svg>`,
    exitFullscreen: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 14h6v6M20 10h-6V4M14 20v-6h6M10 4v6H4"/>
    </svg>`,
    back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>`,
    chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="9 6 15 12 9 18"/>
    </svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>`,
    spinner: `<svg class="liqu-spin" viewBox="0 0 50 50">
      <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="4" stroke-dasharray="80 30" stroke-linecap="round"/>
    </svg>`
  };

  /* =========================================================================
   * 2. Utility Helpers
   * ========================================================================= */
  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0 || !isFinite(seconds)) return '0:00';
    const s = Math.floor(seconds);
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function formatRemainingTime(current, total) {
    if (!isFinite(total) || total <= 0) return formatTime(current);
    const diff = Math.max(0, total - current);
    return `-${formatTime(diff)}`;
  }

  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  function isLowPower() {
    if (typeof navigator === 'undefined') return false;
    const cores = navigator.hardwareConcurrency || 4;
    const memory = navigator.deviceMemory || 4;
    return cores <= 2 || memory <= 2;
  }

  /* =========================================================================
   * 3. Liquid Glass Optics & Displacement Engine
   * ========================================================================= */
  const SVG_NS = "http://www.w3.org/2000/svg";
  let uid = 0;
  let sharedSvgDefs = null;
  const mapCache = new Map();

  class LiquidEngine {
    constructor(opts = {}) {
      this.mode = opts.mode || (isLowPower() ? 'balanced' : 'ultra');
      this.instances = new Set();
      this.isSupported = this.checkRefractionSupport();
    }

    checkRefractionSupport() {
      if (typeof window === 'undefined') return false;
      const ua = navigator.userAgent;
      const isSafari = /Safari/.test(ua) && !/Chrome|Chromium|Edg|OPR|Vivaldi/.test(ua);
      const isFirefox = /Firefox/.test(ua);
      if (isSafari || isFirefox) return false;
      if (typeof CSS === 'undefined' || !CSS.supports || !CSS.supports("backdrop-filter", "url(#lg)")) return false;
      try {
        const c = document.createElement("canvas");
        c.width = c.height = 4;
        return !!c.getContext("2d");
      } catch (_) {
        return false;
      }
    }

    getDefs() {
      if (sharedSvgDefs && document.body.contains(sharedSvgDefs.ownerSVGElement)) {
        return sharedSvgDefs;
      }
      const svg = document.createElementNS(SVG_NS, "svg");
      svg.setAttribute("width", "0");
      svg.setAttribute("height", "0");
      svg.setAttribute("aria-hidden", "true");
      svg.style.position = "absolute";
      svg.style.pointerEvents = "none";
      svg.style.left = "-9999px";
      svg.style.top = "-9999px";
      sharedSvgDefs = document.createElementNS(SVG_NS, "defs");
      svg.appendChild(sharedSvgDefs);
      document.body.appendChild(svg);
      return sharedSvgDefs;
    }

    getMap(w, h, radius, border, mapBlur, isSpherical = false) {
      const key = `${w}_${h}_${radius}_${border}_${mapBlur}_${isSpherical ? 's' : 'r'}`;
      if (mapCache.has(key)) return mapCache.get(key);

      const canvas = document.createElement("canvas");
      canvas.width = Math.min(w, 360);
      canvas.height = Math.min(h, 360);
      const scaleX = canvas.width / w;
      const ctx = canvas.getContext("2d");

      if (isSpherical) {
        const cw = canvas.width;
        const ch = canvas.height;
        const imgData = ctx.createImageData(cw, ch);
        const data = imgData.data;
        const cx = cw / 2;
        const cy = ch / 2;
        const r = Math.min(cx, cy);

        for (let y = 0; y < ch; y++) {
          for (let x = 0; x < cw; x++) {
            const idx = (y * cw + x) * 4;
            const dx = x - cx;
            const dy = y - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < r) {
              const norm = dist / r;
              const factor = Math.sin(norm * Math.PI) * 128;
              const dirX = norm > 0 ? (dx / dist) : 0;
              const dirY = norm > 0 ? (dy / dist) : 0;
              data[idx] = Math.floor(128 + dirX * factor);
              data[idx + 1] = 128;
              data[idx + 2] = Math.floor(128 + dirY * factor);
              data[idx + 3] = 255;
            } else {
              data[idx] = 128;
              data[idx + 1] = 128;
              data[idx + 2] = 128;
              data[idx + 3] = 255;
            }
          }
        }
        ctx.putImageData(imgData, 0, 0);
      } else {
        const cw = canvas.width;
        const ch = canvas.height;
        const gx = ctx.createLinearGradient(0, 0, cw, 0);
        gx.addColorStop(0, "rgb(0,0,0)");
        gx.addColorStop(1, "rgb(255,0,0)");
        ctx.fillStyle = gx;
        ctx.fillRect(0, 0, cw, ch);

        const gy = ctx.createLinearGradient(0, 0, 0, ch);
        gy.addColorStop(0, "rgb(0,0,0)");
        gy.addColorStop(1, "rgb(0,0,255)");
        ctx.globalCompositeOperation = "difference";
        ctx.fillStyle = gy;
        ctx.fillRect(0, 0, cw, ch);

        ctx.globalCompositeOperation = "source-over";
        const inset = border * Math.min(cw, ch);
        ctx.filter = `blur(${mapBlur * scaleX}px)`;
        ctx.fillStyle = "rgba(128,128,128,0.94)";
        ctx.beginPath();
        const r = Math.max((radius * scaleX) - inset, 2);
        if (ctx.roundRect) {
          ctx.roundRect(inset, inset, cw - inset * 2, ch - inset * 2, r);
        } else {
          ctx.rect(inset, inset, cw - inset * 2, ch - inset * 2);
        }
        ctx.fill();
        ctx.filter = "none";
      }

      const dataUrl = canvas.toDataURL("image/png");
      if (mapCache.size > 30) {
        const firstKey = mapCache.keys().next().value;
        mapCache.delete(firstKey);
      }
      mapCache.set(key, dataUrl);
      return dataUrl;
    }

    buildFilter(id, scales) {
      const filter = document.createElementNS(SVG_NS, "filter");
      filter.setAttribute("id", id);
      filter.setAttribute("x", "-10%");
      filter.setAttribute("y", "-10%");
      filter.setAttribute("width", "120%");
      filter.setAttribute("height", "120%");
      filter.setAttribute("color-interpolation-filters", "sRGB");

      const feImage = document.createElementNS(SVG_NS, "feImage");
      feImage.setAttribute("result", "map");
      feImage.setAttribute("preserveAspectRatio", "none");
      filter.appendChild(feImage);

      const keep = [
        "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0",
        "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0",
        "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0",
      ];
      const channels = [];
      for (let i = 0; i < 3; i++) {
        const disp = document.createElementNS(SVG_NS, "feDisplacementMap");
        disp.setAttribute("in", "SourceGraphic");
        disp.setAttribute("in2", "map");
        disp.setAttribute("scale", scales[i]);
        disp.setAttribute("xChannelSelector", "R");
        disp.setAttribute("yChannelSelector", "B");
        disp.setAttribute("result", `d${i}`);
        filter.appendChild(disp);

        const cm = document.createElementNS(SVG_NS, "feColorMatrix");
        cm.setAttribute("in", `d${i}`);
        cm.setAttribute("type", "matrix");
        cm.setAttribute("values", keep[i]);
        cm.setAttribute("result", `c${i}`);
        filter.appendChild(cm);
        channels.push(`c${i}`);
      }

      const blend1 = document.createElementNS(SVG_NS, "feBlend");
      blend1.setAttribute("in", channels[0]);
      blend1.setAttribute("in2", channels[1]);
      blend1.setAttribute("mode", "screen");
      blend1.setAttribute("result", "c01");
      filter.appendChild(blend1);

      const blend2 = document.createElementNS(SVG_NS, "feBlend");
      blend2.setAttribute("in", "c01");
      blend2.setAttribute("in2", channels[2]);
      blend2.setAttribute("mode", "screen");
      filter.appendChild(blend2);

      this.getDefs().appendChild(filter);
      return { filter, feImage };
    }

    apply(el, options = {}) {
      if (!el) return null;
      const opts = Object.assign({
        scale: options.isOrb ? -135 : -95,
        chroma: 7,
        border: options.isOrb ? 0.04 : 0.08,
        mapBlur: 10,
        blur: 3,
        saturate: 1.6,
        radius: null,
        fallbackBlur: 16,
        isOrb: false
      }, options);

      const useUltra = (this.mode === 'ultra' && this.isSupported);
      const useBalanced = (this.mode === 'balanced' || !this.isSupported);

      let parts = null;
      let filterId = null;

      if (useUltra) {
        filterId = `liqu-f-${++uid}`;
        const scales = [opts.scale, opts.scale + opts.chroma, opts.scale + 2 * opts.chroma];
        parts = this.buildFilter(filterId, scales);
      }

      const refresh = () => {
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        if (!w || !h) return;
        if (useUltra && parts) {
          const r = opts.radius != null ? opts.radius : (Math.min(w, h) / 2);
          const mapUrl = this.getMap(w, h, r, opts.border, opts.mapBlur, opts.isOrb);
          parts.feImage.setAttribute("href", mapUrl);
          parts.feImage.setAttribute("width", w);
          parts.feImage.setAttribute("height", h);
        }
      };

      if (useUltra) {
        el.style.backdropFilter = `url(#${filterId}) blur(${opts.blur}px) saturate(${opts.saturate})`;
        el.style.webkitBackdropFilter = `url(#${filterId}) blur(${opts.blur}px) saturate(${opts.saturate})`;
      } else if (useBalanced) {
        el.style.backdropFilter = `blur(${opts.fallbackBlur}px) saturate(${opts.saturate})`;
        el.style.webkitBackdropFilter = `blur(${opts.fallbackBlur}px) saturate(${opts.saturate})`;
      } else {
        el.style.backdropFilter = `blur(8px)`;
        el.style.webkitBackdropFilter = `blur(8px)`;
        el.classList.add("liqu-glass-lite");
      }

      refresh();

      const onPointerMove = (e) => {
        const rect = el.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const gx = ((e.clientX - rect.left) / rect.width) * 100;
        const gy = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty("--gx", `${gx.toFixed(1)}%`);
        el.style.setProperty("--gy", `${gy.toFixed(1)}%`);
      };

      el.addEventListener("pointermove", onPointerMove, { passive: true });

      let resizeTimer = null;
      let ro = null;
      if (typeof ResizeObserver !== 'undefined') {
        ro = new ResizeObserver(() => {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(refresh, 120);
        });
        ro.observe(el);
      }

      const inst = {
        el,
        refresh,
        destroy: () => {
          if (ro) ro.disconnect();
          clearTimeout(resizeTimer);
          el.removeEventListener("pointermove", onPointerMove);
          if (parts && parts.filter) parts.filter.remove();
          el.style.backdropFilter = "";
          el.style.webkitBackdropFilter = "";
          this.instances.delete(inst);
        }
      };

      this.instances.add(inst);
      return inst;
    }

    setMode(newMode) {
      if (this.mode === newMode) return;
      this.mode = newMode;
      const oldInstances = Array.from(this.instances);
      oldInstances.forEach(inst => {
        const el = inst.el;
        inst.destroy();
        this.apply(el);
      });
    }

    destroy() {
      this.instances.forEach(inst => inst.destroy());
      this.instances.clear();
      if (sharedSvgDefs && sharedSvgDefs.ownerSVGElement) {
        sharedSvgDefs.ownerSVGElement.remove();
        sharedSvgDefs = null;
      }
    }
  }

  /* =========================================================================
   * 4. Multi-Source Streaming Manager
   * ========================================================================= */
  class SourceManager {
    constructor(player) {
      this.player = player;
      this.currentSource = null;
      this.sourceType = null;
      this.hls = null;
      this.dash = null;
      this.ytPlayer = null;
      this.vimeoPlayer = null;
      this.testAnim = null;
    }

    detect(src) {
      if (!src) return 'direct';
      if (typeof src === 'object' && src.src) src = src.src;
      src = src.trim();
      if (src === 'test:colorbar' || src === 'test:pattern') return 'test_pattern';
      if (/youtube\.com|youtu\.be/i.test(src) || /^[a-zA-Z0-9_-]{11}$/.test(src)) return 'youtube';
      if (/vimeo\.com/i.test(src)) return 'vimeo';
      if (/\.m3u8($|\?)/i.test(src)) return 'hls';
      if (/\.mpd($|\?)/i.test(src)) return 'dash';
      return 'direct';
    }

    async load(source) {
      this.unload();
      this.currentSource = source;
      const url = typeof source === 'string' ? source : source.src;
      this.sourceType = this.detect(url);

      if (this.sourceType === 'youtube') {
        await this.loadYouTube(url);
      } else if (this.sourceType === 'vimeo') {
        await this.loadVimeo(url);
      } else if (this.sourceType === 'hls') {
        await this.loadHLS(url);
      } else if (this.sourceType === 'dash') {
        await this.loadDash(url);
      } else if (this.sourceType === 'test_pattern') {
        this.loadTestPattern();
      } else {
        this.loadDirect(url);
      }

      this.player.emit('sourceloaded', { type: this.sourceType, source });
    }

    loadDirect(url) {
      this.hideEmbeds();
      const v = this.player.video;
      v.style.display = 'block';
      v.src = url;
      v.load();
    }

    async loadHLS(url) {
      this.hideEmbeds();
      const v = this.player.video;
      v.style.display = 'block';

      if (v.canPlayType('application/vnd.apple.mpegurl')) {
        v.src = url;
        return;
      }
      if (typeof window.Hls === 'undefined') {
        await this.injectScript('https://cdn.jsdelivr.net/npm/hls.js@1.5.8/dist/hls.min.js');
      }
      if (window.Hls && window.Hls.isSupported()) {
        this.hls = new window.Hls({ capLevelToPlayerSize: true });
        this.hls.loadSource(url);
        this.hls.attachMedia(v);
      } else {
        v.src = url;
      }
    }

    async loadDash(url) {
      this.hideEmbeds();
      const v = this.player.video;
      v.style.display = 'block';
      if (typeof window.dashjs === 'undefined') {
        await this.injectScript('https://cdn.jsdelivr.net/npm/dashjs@4.7.4/dist/dash.all.min.js');
      }
      if (window.dashjs) {
        this.dash = window.dashjs.MediaPlayer().create();
        this.dash.initialize(v, url, false);
      } else {
        v.src = url;
      }
    }

    extractYouTubeId(url) {
      if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
      const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|live\/))([\w-]{11})/i);
      return match ? match[1] : null;
    }

    async loadYouTube(url) {
      const videoId = this.extractYouTubeId(url);
      this.player.video.style.display = 'none';

      let ytContainer = this.player.container.querySelector('.liqu-youtube-frame');
      if (!ytContainer) {
        ytContainer = document.createElement('div');
        ytContainer.className = 'liqu-youtube-frame';
        this.player.mediaWrapper.insertBefore(ytContainer, this.player.video);
      }
      ytContainer.style.display = 'block';

      if (typeof window.YT === 'undefined' || !window.YT.Player) {
        await this.injectScript('https://www.youtube.com/iframe_api');
        await new Promise(res => {
          const prev = window.onYouTubeIframeAPIReady;
          window.onYouTubeIframeAPIReady = () => {
            if (prev) prev();
            res();
          };
          if (window.YT && window.YT.Player) res();
        });
      }

      return new Promise(resolve => {
        this.ytPlayer = new window.YT.Player(ytContainer, {
          videoId,
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
            onReady: () => {
              this.startYouTubeSync();
              resolve();
            },
            onStateChange: (e) => {
              if (e.data === window.YT.PlayerState.PLAYING) this.player.emit('play');
              else if (e.data === window.YT.PlayerState.PAUSED) this.player.emit('pause');
              else if (e.data === window.YT.PlayerState.ENDED) this.player.emit('ended');
            }
          }
        });
      });
    }

    startYouTubeSync() {
      clearInterval(this.ytSyncTimer);
      this.ytSyncTimer = setInterval(() => {
        if (!this.ytPlayer || !this.ytPlayer.getCurrentTime) return;
        try {
          const cur = this.ytPlayer.getCurrentTime() || 0;
          const dur = this.ytPlayer.getDuration() || 0;
          const buf = this.ytPlayer.getVideoLoadedFraction() || 0;
          this.player.onTimeUpdateBridge(cur, dur, buf);
        } catch (_) {}
      }, 250);
    }

    async loadVimeo(url) {
      this.player.video.style.display = 'none';
      if (typeof window.Vimeo === 'undefined') {
        await this.injectScript('https://player.vimeo.com/api/player.js');
      }
      let vm = this.player.container.querySelector('.liqu-vimeo-frame');
      if (!vm) {
        vm = document.createElement('div');
        vm.className = 'liqu-vimeo-frame';
        this.player.mediaWrapper.insertBefore(vm, this.player.video);
      }
      vm.style.display = 'block';

      this.vimeoPlayer = new window.Vimeo.Player(vm, {
        url,
        controls: false,
        autoplay: this.player.options.autoplay || false
      });
      this.vimeoPlayer.on('play', () => this.player.emit('play'));
      this.vimeoPlayer.on('pause', () => this.player.emit('pause'));
      this.vimeoPlayer.on('timeupdate', (d) => this.player.onTimeUpdateBridge(d.seconds, d.duration, d.percent));
    }

    loadTestPattern() {
      this.hideEmbeds();
      const v = this.player.video;
      v.style.display = 'block';

      const canvas = document.createElement('canvas');
      canvas.width = 1280;
      canvas.height = 720;
      const ctx = canvas.getContext('2d');
      const bars = ['#e60000', '#00e600', '#ffff00', '#0000ff', '#e600e6', '#00e6e6'];
      let start = Date.now();
      let offset = 0;

      const render = () => {
        const elapsed = (Date.now() - start) / 1000;
        const bw = canvas.width / bars.length;
        bars.forEach((col, i) => {
          ctx.fillStyle = col;
          ctx.fillRect(i * bw, 0, bw, canvas.height);
        });

        // Test Crosshair & checkerboard
        ctx.fillStyle = 'rgba(40, 40, 50, 0.7)';
        ctx.fillRect(160, 520, 220, 20);
        ctx.fillRect(260, 420, 20, 220);

        // Neon animated beam
        ctx.save();
        ctx.beginPath();
        const lx = (offset * 140) % (canvas.width + 400) - 200;
        ctx.strokeStyle = '#ff2a4b';
        ctx.lineWidth = 14;
        ctx.shadowColor = '#ff2a4b';
        ctx.shadowBlur = 24;
        ctx.moveTo(-100, canvas.height * 0.75);
        ctx.lineTo(canvas.width + 100, canvas.height * 0.12);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(lx, canvas.height * 0.75 - (lx / canvas.width) * (canvas.height * 0.63), 12, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.shadowColor = '#ffff00';
        ctx.shadowBlur = 30;
        ctx.fill();
        ctx.restore();

        // Timecode banner
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(16, 16, 190, 46);
        ctx.fillStyle = '#ff3333';
        ctx.font = 'bold 22px monospace';
        const s = Math.floor(elapsed % 60);
        const f = Math.floor((elapsed * 30) % 30);
        ctx.fillText(`00:00:${s < 10 ? '0' : ''}${s}.${f < 10 ? '0' : ''}${f}`, 24, 46);

        offset += 0.035;
        this.player.onTimeUpdateBridge(elapsed % 39, 39, 1);
        this.testAnim = requestAnimationFrame(render);
      };

      render();
      if (canvas.captureStream) {
        v.srcObject = canvas.captureStream(30);
      }
    }

    hideEmbeds() {
      const yt = this.player.container.querySelector('.liqu-youtube-frame');
      if (yt) yt.style.display = 'none';
      const vm = this.player.container.querySelector('.liqu-vimeo-frame');
      if (vm) vm.style.display = 'none';
    }

    injectScript(src) {
      return new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) return resolve();
        const s = document.createElement('script');
        s.src = src;
        s.async = true;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
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

    seek(sec) {
      if (this.sourceType === 'youtube' && this.ytPlayer && this.ytPlayer.seekTo) {
        this.ytPlayer.seekTo(sec, true);
      } else if (this.sourceType === 'vimeo' && this.vimeoPlayer) {
        this.vimeoPlayer.setCurrentTime(sec);
      } else if (this.player.video) {
        this.player.video.currentTime = sec;
      }
    }

    setVolume(vol) {
      const c = clamp(vol, 0, 1);
      if (this.sourceType === 'youtube' && this.ytPlayer && this.ytPlayer.setVolume) {
        this.ytPlayer.setVolume(c * 100);
      } else if (this.sourceType === 'vimeo' && this.vimeoPlayer) {
        this.vimeoPlayer.setVolume(c);
      } else if (this.player.video) {
        this.player.video.volume = c;
      }
    }

    setMuted(m) {
      if (this.sourceType === 'youtube' && this.ytPlayer) {
        if (m) this.ytPlayer.mute(); else this.ytPlayer.unMute();
      } else if (this.sourceType === 'vimeo' && this.vimeoPlayer) {
        this.vimeoPlayer.setMuted(m);
      } else if (this.player.video) {
        this.player.video.muted = m;
      }
    }

    setSpeed(spd) {
      if (this.sourceType === 'youtube' && this.ytPlayer && this.ytPlayer.setPlaybackRate) {
        this.ytPlayer.setPlaybackRate(spd);
      } else if (this.sourceType === 'vimeo' && this.vimeoPlayer) {
        this.vimeoPlayer.setPlaybackRate(spd);
      } else if (this.player.video) {
        this.player.video.playbackRate = spd;
      }
    }

    unload() {
      if (this.hls) { this.hls.destroy(); this.hls = null; }
      if (this.dash) { this.dash.reset(); this.dash = null; }
      if (this.ytSyncTimer) { clearInterval(this.ytSyncTimer); this.ytSyncTimer = null; }
      if (this.ytPlayer) { try { this.ytPlayer.destroy(); } catch (_) {} this.ytPlayer = null; }
      if (this.vimeoPlayer) { try { this.vimeoPlayer.destroy(); } catch (_) {} this.vimeoPlayer = null; }
      if (this.testAnim) { cancelAnimationFrame(this.testAnim); this.testAnim = null; }
      if (this.player.video) {
        this.player.video.removeAttribute('src');
        this.player.video.srcObject = null;
      }
    }
  }

  /* =========================================================================
   * 5. LiQu Player Main Class
   * ========================================================================= */
  class LiQuPlayer {
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
        downloadable: true,
        subtitles: [],
        nextEpisode: null
      }, options);

      this.listeners = new Map();
      this.isPlaying = false;
      this.isMenuOpen = false;
      this.ambientGlowEnabled = this.options.ambientGlow;
      this.brightness = 1;

      // Subsystems
      this.liquidEngine = new LiquidEngine({ mode: this.options.glassMode });
      this.sourceManager = new SourceManager(this);

      this.buildUI();
      this.bindControls();
      this.bindShortcuts();
      this.bindGestures();

      if (this.ambientGlowEnabled) {
        this.initAmbientGlow();
      }

      if (this.options.source) {
        this.setSource(this.options.source);
      }

      this.setVolume(this.options.volume);
      if (this.options.muted) this.toggleMute(true);
    }

    buildUI() {
      const c = this.container;
      c.classList.add('liqu-player-container');
      c.setAttribute('tabindex', '0');

      // Ambient glow
      this.ambientGlow = document.createElement('div');
      this.ambientGlow.className = 'liqu-ambient-glow';
      c.appendChild(this.ambientGlow);

      // Media wrapper & video
      this.mediaWrapper = document.createElement('div');
      this.mediaWrapper.className = 'liqu-media-wrapper';
      c.appendChild(this.mediaWrapper);

      this.video = document.createElement('video');
      this.video.className = 'liqu-video-element';
      this.video.playsInline = true;
      this.video.setAttribute('webkit-playsinline', 'true');
      this.video.crossOrigin = 'anonymous';
      if (this.options.poster) this.video.poster = this.options.poster;
      if (this.options.autoplay) this.video.autoplay = true;
      if (this.options.muted) this.video.muted = true;
      if (this.options.loop) this.video.loop = true;
      this.mediaWrapper.appendChild(this.video);

      // Controls overlay
      this.overlay = document.createElement('div');
      this.overlay.className = 'liqu-controls-overlay';
      c.appendChild(this.overlay);

      // Spinner
      this.spinner = document.createElement('div');
      this.spinner.className = 'liqu-spinner-container liqu-glass-pill';
      this.spinner.innerHTML = icons.spinner;
      this.overlay.appendChild(this.spinner);

      // Top Bar
      this.topBar = document.createElement('div');
      this.topBar.className = 'liqu-top-bar';
      this.topBar.innerHTML = `
        <div class="liqu-top-left">
          <button class="liqu-btn liqu-glass-circle liqu-back-btn" title="Back" aria-label="Back">
            ${icons.back}
          </button>
          <div class="liqu-title-badge liqu-glass-pill">
            <span class="liqu-title-text">${this.options.title || 'LiQu Player'}</span>
            ${this.options.subtitle ? `<span class="liqu-title-sub">${this.options.subtitle}</span>` : ''}
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
            ${this.options.downloadable !== false ? `
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
      this.overlay.appendChild(this.topBar);

      // Center Controls (Floating Bubbles)
      this.centerControls = document.createElement('div');
      this.centerControls.className = 'liqu-center-controls';
      this.centerControls.innerHTML = `
        <button class="liqu-btn liqu-seek-btn liqu-seek-back liqu-glass-circle" title="Rewind 10 seconds">
          ${icons.replay10}
        </button>
        <button class="liqu-btn liqu-play-btn liqu-glass-orb" title="Play / Pause">
          <span class="liqu-play-icon">${icons.play}</span>
          <span class="liqu-pause-icon" style="display:none">${icons.pause}</span>
        </button>
        <button class="liqu-btn liqu-seek-btn liqu-seek-forward liqu-glass-circle" title="Forward 10 seconds">
          ${icons.forward10}
        </button>
      `;
      this.overlay.appendChild(this.centerControls);

      // Next Episode Button
      if (this.options.nextEpisode) {
        this.nextEpisodeBtn = document.createElement('button');
        this.nextEpisodeBtn.className = 'liqu-next-btn liqu-glass-pill';
        this.nextEpisodeBtn.innerHTML = `<span>${this.options.nextEpisode.title || 'Next Episode'}</span> ${icons.chevronRight}`;
        this.overlay.appendChild(this.nextEpisodeBtn);
      }

      // Bottom Dock
      this.bottomDock = document.createElement('div');
      this.bottomDock.className = 'liqu-bottom-dock liqu-glass-pill';
      this.bottomDock.innerHTML = `
        <span class="liqu-time-current">0:00</span>
        <div class="liqu-scrub-bar" role="slider" aria-label="Scrubber">
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
      this.overlay.appendChild(this.bottomDock);

      // Popover Menus & HUD
      this.popoverContainer = document.createElement('div');
      this.popoverContainer.className = 'liqu-popovers-container';
      this.overlay.appendChild(this.popoverContainer);

      this.hudPill = document.createElement('div');
      this.hudPill.className = 'liqu-hud-pill liqu-glass-pill';
      this.hudPill.innerHTML = `<span class="liqu-hud-icon"></span><span class="liqu-hud-text"></span>`;
      this.overlay.appendChild(this.hudPill);

      // References
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
      this.applyLiquidOptics();

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

    applyLiquidOptics() {
      const le = this.liquidEngine;
      le.apply(this.playBtn, { isOrb: true, scale: -140, chroma: 8, border: 0.04, mapBlur: 14 });
      le.apply(this.seekBackBtn, { radius: 36, scale: -95, chroma: 5, border: 0.08 });
      le.apply(this.seekFwdBtn, { radius: 36, scale: -95, chroma: 5, border: 0.08 });
      le.apply(this.backBtn, { radius: 24, scale: -85, chroma: 4, border: 0.09 });

      const titleBadge = this.topBar.querySelector('.liqu-title-badge');
      const topActions = this.topBar.querySelector('.liqu-top-actions');
      if (titleBadge) le.apply(titleBadge, { radius: 22, scale: -75, chroma: 4, border: 0.06 });
      if (topActions) le.apply(topActions, { radius: 24, scale: -80, chroma: 4, border: 0.06 });
      le.apply(this.bottomDock, { radius: 28, scale: -85, chroma: 5, border: 0.05 });

      if (this.nextEpisodeBtn) {
        le.apply(this.nextEpisodeBtn, { radius: 20, scale: -80, chroma: 4, border: 0.06 });
      }
    }

    bindControls() {
      const v = this.video;

      this.playBtn.addEventListener('click', (e) => { e.stopPropagation(); this.togglePlay(); });
      this.seekBackBtn.addEventListener('click', (e) => { e.stopPropagation(); this.seekBy(-10); });
      this.seekFwdBtn.addEventListener('click', (e) => { e.stopPropagation(); this.seekBy(10); });

      this.backBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.options.onBack) this.options.onBack();
        else if (window.history.length > 1) window.history.back();
      });

      this.volBtn.addEventListener('click', (e) => { e.stopPropagation(); this.toggleMute(); });
      this.volSlider.addEventListener('input', (e) => {
        e.stopPropagation();
        this.setVolume(parseFloat(e.target.value));
      });

      this.speedBtn.addEventListener('click', (e) => { e.stopPropagation(); this.toggleMenu('speed'); });
      this.settingsBtn.addEventListener('click', (e) => { e.stopPropagation(); this.toggleMenu('settings'); });
      this.ccBtn.addEventListener('click', (e) => { e.stopPropagation(); this.toggleMenu('subtitles'); });

      if (this.downloadBtn) {
        this.downloadBtn.addEventListener('click', (e) => { e.stopPropagation(); this.downloadMedia(); });
      }

      this.pipBtn.addEventListener('click', (e) => { e.stopPropagation(); this.togglePiP(); });
      this.fullscreenBtn.addEventListener('click', (e) => { e.stopPropagation(); this.toggleFullscreen(); });

      if (this.nextEpisodeBtn) {
        this.nextEpisodeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (this.options.nextEpisode.onClick) this.options.nextEpisode.onClick();
        });
      }

      this.timeRemaining.addEventListener('click', (e) => {
        e.stopPropagation();
        this.showRemaining = !this.showRemaining;
        this.updateProgress();
      });

      this.initScrubber();

      // Video native events
      v.addEventListener('play', () => {
        this.isPlaying = true;
        this.playIcon.style.display = 'none';
        this.pauseIcon.style.display = 'block';
        this.container.classList.add('liqu-playing');
        this.emit('play');
      });

      v.addEventListener('pause', () => {
        this.isPlaying = false;
        this.playIcon.style.display = 'block';
        this.pauseIcon.style.display = 'none';
        this.container.classList.remove('liqu-playing');
        this.emit('pause');
      });

      v.addEventListener('timeupdate', () => this.updateProgress());
      v.addEventListener('waiting', () => { this.spinner.style.display = 'flex'; });
      v.addEventListener('playing', () => { this.spinner.style.display = 'none'; });
      v.addEventListener('canplay', () => { this.spinner.style.display = 'none'; });

      v.addEventListener('volumechange', () => {
        this.volSlider.value = v.muted ? 0 : v.volume;
        this.volBtn.innerHTML = (v.muted || v.volume === 0) ? icons.volumeMute : icons.volumeHigh;
      });

      document.addEventListener('fullscreenchange', () => {
        const isFs = !!document.fullscreenElement;
        this.fullscreenBtn.innerHTML = isFs ? icons.exitFullscreen : icons.fullscreen;
        this.container.classList.toggle('liqu-fullscreen', isFs);
      });
    }

    initScrubber() {
      let isScrubbing = false;

      const onScrub = (e) => {
        const rect = this.scrubBar.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const pos = clamp((clientX - rect.left) / rect.width, 0, 1);
        const targetTime = pos * this.getDuration();

        this.scrubTooltip.style.left = `${pos * 100}%`;
        this.scrubTooltip.textContent = formatTime(targetTime);
        this.scrubTooltip.style.opacity = '1';

        if (isScrubbing) {
          this.scrubProgress.style.width = `${pos * 100}%`;
          this.timeCurrent.textContent = formatTime(targetTime);
        }
      };

      const onEnd = (e) => {
        if (!isScrubbing) return;
        isScrubbing = false;
        this.scrubBar.classList.remove('liqu-scrubbing');
        const rect = this.scrubBar.getBoundingClientRect();
        const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
        const pos = clamp((clientX - rect.left) / rect.width, 0, 1);
        this.seekTo(pos * this.getDuration());
        this.scrubTooltip.style.opacity = '0';
        window.removeEventListener('pointermove', onScrub);
        window.removeEventListener('pointerup', onEnd);
      };

      this.scrubBar.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        isScrubbing = true;
        this.scrubBar.classList.add('liqu-scrubbing');
        onScrub(e);
        window.addEventListener('pointermove', onScrub);
        window.addEventListener('pointerup', onEnd);
      });

      this.scrubBar.addEventListener('pointerenter', () => { this.scrubTooltip.style.opacity = '1'; });
      this.scrubBar.addEventListener('pointerleave', () => { if (!isScrubbing) this.scrubTooltip.style.opacity = '0'; });
      this.scrubBar.addEventListener('pointermove', onScrub);
    }

    updateProgress() {
      const cur = this.getCurrentTime();
      const dur = this.getDuration();
      if (!dur || !isFinite(dur)) return;

      const pct = (cur / dur) * 100;
      this.scrubProgress.style.width = `${pct}%`;
      this.timeCurrent.textContent = formatTime(cur);
      this.timeRemaining.textContent = this.showRemaining ? formatRemainingTime(cur, dur) : formatTime(dur);

      const buf = this.getBuffered();
      if (buf && buf.length) {
        const bufPct = (buf.end(buf.length - 1) / dur) * 100;
        this.scrubBuffer.style.width = `${Math.min(bufPct, 100)}%`;
      }
    }

    onTimeUpdateBridge(cur, dur, loadedFraction) {
      this.timeCurrent.textContent = formatTime(cur);
      if (dur > 0) {
        this.scrubProgress.style.width = `${(cur / dur) * 100}%`;
        this.timeRemaining.textContent = this.showRemaining ? formatRemainingTime(cur, dur) : formatTime(dur);
        this.scrubBuffer.style.width = `${(loadedFraction || 0) * 100}%`;
      }
    }

    bindShortcuts() {
      window.addEventListener('keydown', (e) => {
        const tag = (e.target.tagName || '').toLowerCase();
        if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;
        if (!this.container.contains(e.target) && !document.fullscreenElement) return;

        if (e.key === ' ' || e.key === 'k') { e.preventDefault(); this.togglePlay(); }
        else if (e.key === 'ArrowLeft' || e.key === 'j') { e.preventDefault(); this.seekBy(-10); }
        else if (e.key === 'ArrowRight' || e.key === 'l') { e.preventDefault(); this.seekBy(10); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); this.setVolume(this.getVolume() + 0.05); }
        else if (e.key === 'ArrowDown') { e.preventDefault(); this.setVolume(this.getVolume() - 0.05); }
        else if (e.key === 'm') { e.preventDefault(); this.toggleMute(); }
        else if (e.key === 'f') { e.preventDefault(); this.toggleFullscreen(); }
        else if (e.key === 'p') { e.preventDefault(); this.togglePiP(); }
      });
    }

    bindGestures() {
      let idleTimer = null;
      const resetIdle = () => {
        this.container.classList.remove('liqu-idle');
        this.container.classList.add('liqu-active');
        clearTimeout(idleTimer);
        if (this.isPlaying && !this.isMenuOpen) {
          idleTimer = setTimeout(() => {
            this.container.classList.remove('liqu-active');
            this.container.classList.add('liqu-idle');
          }, 2800);
        }
      };

      this.container.addEventListener('pointermove', resetIdle, { passive: true });
      this.container.addEventListener('pointerenter', resetIdle, { passive: true });
      this.container.addEventListener('pointerleave', () => {
        if (this.isPlaying) {
          this.container.classList.remove('liqu-active');
          this.container.classList.add('liqu-idle');
        }
      }, { passive: true });

      // Droplet ripple on player click
      this.container.addEventListener('click', (e) => {
        resetIdle();
        if (!e.target.closest('.liqu-popover') && !e.target.closest('.liqu-btn') && !e.target.closest('.liqu-scrub-bar')) {
          this.closeMenu();
          const rect = this.container.getBoundingClientRect();
          const rip = document.createElement('div');
          rip.className = 'liqu-droplet-ripple';
          rip.style.left = `${e.clientX - rect.left}px`;
          rip.style.top = `${e.clientY - rect.top}px`;
          this.container.appendChild(rip);
          setTimeout(() => rip.remove(), 750);
        }
      });

      // Mobile double-tap to seek
      let lastTap = 0;
      this.container.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) return;
        const now = Date.now();
        const touch = e.touches[0];
        const rect = this.container.getBoundingClientRect();
        if (now - lastTap < 300) {
          const isLeft = (touch.clientX - rect.left) < rect.width / 2;
          this.seekBy(isLeft ? -10 : 10);
          this.showDoubleTapEffect(isLeft);
          lastTap = 0;
          return;
        }
        lastTap = now;
      }, { passive: true });
    }

    showDoubleTapEffect(isLeft) {
      const rip = document.createElement('div');
      rip.className = `liqu-double-tap-ripple ${isLeft ? 'liqu-tap-left' : 'liqu-tap-right'}`;
      rip.innerHTML = `<div class="liqu-tap-inner liqu-glass-pill"><span>${isLeft ? '-10s' : '+10s'}</span></div>`;
      this.container.appendChild(rip);
      setTimeout(() => rip.remove(), 650);
    }

    toggleMenu(type) {
      if (this.activeMenu === type) { this.closeMenu(); return; }
      this.closeMenu();
      this.activeMenu = type;
      this.isMenuOpen = true;

      const popover = document.createElement('div');
      popover.className = `liqu-popover liqu-glass-card`;

      if (type === 'speed') {
        const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
        const cur = this.getPlaybackRate();
        popover.innerHTML = `
          <div class="liqu-menu-header">Playback Speed</div>
          <div class="liqu-menu-list">
            ${speeds.map(s => `
              <button class="liqu-menu-item ${s === cur ? 'liqu-item-active' : ''}" data-speed="${s}">
                <span>${s === 1 ? '1.0x (Normal)' : `${s}x`}</span>
                ${s === cur ? icons.check : ''}
              </button>
            `).join('')}
          </div>
        `;
      } else if (type === 'settings') {
        popover.innerHTML = `
          <div class="liqu-menu-header">Settings</div>
          <div class="liqu-menu-list">
            <div class="liqu-menu-section-title">Liquid Glass Mode</div>
            <button class="liqu-menu-item ${this.liquidEngine.mode === 'ultra' ? 'liqu-item-active' : ''}" data-glass="ultra">
              <span>Ultra Fluid (Apple Refraction)</span>
              ${this.liquidEngine.mode === 'ultra' ? icons.check : ''}
            </button>
            <button class="liqu-menu-item ${this.liquidEngine.mode === 'balanced' ? 'liqu-item-active' : ''}" data-glass="balanced">
              <span>Balanced (60 FPS Frosted)</span>
              ${this.liquidEngine.mode === 'balanced' ? icons.check : ''}
            </button>
            <button class="liqu-menu-item ${this.liquidEngine.mode === 'lite' ? 'liqu-item-active' : ''}" data-glass="lite">
              <span>Lite (Old Devices & Low RAM)</span>
              ${this.liquidEngine.mode === 'lite' ? icons.check : ''}
            </button>
            <div class="liqu-menu-divider"></div>
            <div class="liqu-menu-section-title">Cinema Ambient Glow</div>
            <button class="liqu-menu-item ${this.ambientGlowEnabled ? 'liqu-item-active' : ''}" data-ambient="toggle">
              <span>${this.ambientGlowEnabled ? 'Enabled' : 'Disabled'}</span>
              ${this.ambientGlowEnabled ? icons.check : ''}
            </button>
          </div>
        `;
      } else if (type === 'subtitles') {
        popover.innerHTML = `
          <div class="liqu-menu-header">Subtitles / Captions</div>
          <div class="liqu-menu-list">
            <button class="liqu-menu-item liqu-item-active" data-track="off"><span>Off</span> ${icons.check}</button>
            ${(this.options.subtitles || []).map((t, idx) => `
              <button class="liqu-menu-item" data-track="${idx}"><span>${t.label || `Track ${idx + 1}`}</span></button>
            `).join('')}
          </div>
        `;
      }

      this.popoverContainer.appendChild(popover);
      this.liquidEngine.apply(popover, { radius: 20, scale: -75, chroma: 4, border: 0.06 });

      popover.addEventListener('click', (e) => {
        const item = e.target.closest('.liqu-menu-item');
        if (!item) return;
        if (item.dataset.speed) {
          this.setPlaybackRate(parseFloat(item.dataset.speed));
          this.closeMenu();
        } else if (item.dataset.glass) {
          this.liquidEngine.setMode(item.dataset.glass);
          this.closeMenu();
        } else if (item.dataset.ambient) {
          this.toggleAmbientGlow();
          this.closeMenu();
        } else if (item.dataset.track) {
          this.closeMenu();
        }
      });
    }

    closeMenu() {
      this.activeMenu = null;
      this.isMenuOpen = false;
      this.popoverContainer.innerHTML = '';
    }

    initAmbientGlow() {
      let glowCanvas = document.createElement('canvas');
      glowCanvas.width = 48;
      glowCanvas.height = 27;
      let ctx = glowCanvas.getContext('2d');
      let glowTimer = setInterval(() => {
        if (!this.ambientGlowEnabled || !this.isPlaying || !this.video) return;
        try {
          ctx.drawImage(this.video, 0, 0, 48, 27);
          const data = ctx.getImageData(0, 0, 48, 27).data;
          let r = 0, g = 0, b = 0, count = 0;
          for (let i = 0; i < data.length; i += 16) {
            r += data[i]; g += data[i + 1]; b += data[i + 2]; count++;
          }
          r = Math.floor(r / count); g = Math.floor(g / count); b = Math.floor(b / count);
          this.ambientGlow.style.background =
            `radial-gradient(ellipse 90% 65% at 50% 50%, rgba(${r}, ${g}, ${b}, 0.55) 0%, rgba(${r}, ${g}, ${b}, 0.15) 60%, transparent 100%)`;
        } catch (_) {}
      }, 500);

      this._glowCleanup = () => clearInterval(glowTimer);
    }

    toggleAmbientGlow() {
      this.ambientGlowEnabled = !this.ambientGlowEnabled;
      if (!this.ambientGlowEnabled) this.ambientGlow.style.background = 'transparent';
    }

    showHUD(iconSvg, text) {
      this.hudPill.querySelector('.liqu-hud-icon').innerHTML = iconSvg;
      this.hudPill.querySelector('.liqu-hud-text').textContent = text;
      this.hudPill.classList.add('liqu-show');
      clearTimeout(this.hudTimer);
      this.hudTimer = setTimeout(() => this.hudPill.classList.remove('liqu-show'), 1200);
    }

    downloadMedia() {
      const src = this.sourceManager.currentSource;
      const url = typeof src === 'string' ? src : (src && src.src ? src.src : null);
      if (url && (url.startsWith('http') || url.startsWith('blob'))) {
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.options.title || 'video'}.mp4`;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        this.showHUD(icons.download, 'Download Unavailable');
      }
    }

    // --- Public API ---
    play() { this.sourceManager.play(); }
    pause() { this.sourceManager.pause(); }
    togglePlay() { if (this.isPlaying) this.pause(); else this.play(); }
    seekTo(sec) { this.sourceManager.seek(clamp(sec, 0, this.getDuration() || 999999)); }
    seekBy(delta) { this.seekTo(this.getCurrentTime() + delta); }
    setVolume(vol) { const c = clamp(vol, 0, 1); this.sourceManager.setVolume(c); this.volSlider.value = c; }
    getVolume() { return this.video ? this.video.volume : 1; }
    isMuted() { return this.video ? this.video.muted : false; }
    toggleMute(force) { const n = force != null ? force : !this.isMuted(); this.sourceManager.setMuted(n); }
    setPlaybackRate(r) { this.sourceManager.setSpeed(r); this.showHUD(icons.speedometer, `${r}x Speed`); }
    getPlaybackRate() { return this.video ? this.video.playbackRate || 1 : 1; }
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
    getBuffered() { return this.video ? this.video.buffered : null; }
    async toggleFullscreen() {
      if (!document.fullscreenElement) {
        if (this.container.requestFullscreen) await this.container.requestFullscreen();
        else if (this.container.webkitRequestFullscreen) await this.container.webkitRequestFullscreen();
      } else {
        if (document.exitFullscreen) await document.exitFullscreen();
        else if (document.webkitExitFullscreen) await document.webkitExitFullscreen();
      }
    }
    async togglePiP() {
      try {
        if (document.pictureInPictureElement) await document.exitPictureInPicture();
        else if (document.pictureInPictureEnabled && this.video) await this.video.requestPictureInPicture();
      } catch (err) {}
    }
    setSource(src, meta = {}) {
      this.sourceManager.load(src);
      if (meta.title) this.container.querySelector('.liqu-title-text').textContent = meta.title;
      if (meta.subtitle) {
        const sub = this.container.querySelector('.liqu-title-sub');
        if (sub) sub.textContent = meta.subtitle;
      }
    }
    on(e, fn) {
      if (!this.listeners.has(e)) this.listeners.set(e, new Set());
      this.listeners.get(e).add(fn);
      return () => this.off(e, fn);
    }
    off(e, fn) { if (this.listeners.has(e)) this.listeners.get(e).delete(fn); }
    emit(e, d) { if (this.listeners.has(e)) this.listeners.get(e).forEach(fn => fn(d)); }
    destroy() {
      if (this.compactRo) {
        this.compactRo.disconnect();
        this.compactRo = null;
      }
      if (this._glowCleanup) this._glowCleanup();
      this.sourceManager.unload();
      this.liquidEngine.destroy();
      this.container.innerHTML = '';
      this.listeners.clear();
    }
  }

  return LiQuPlayer;
});
