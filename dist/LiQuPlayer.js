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
   * 1. Vector Retina Icons
   * ========================================================================= */
/**
 * LiQu Player — Liquid Glass SVG Icons
 * Retina-crisp, streamlined vector icons matching the LiQu Player interface.
 */
const icons = {
  play: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v13.72a1 1 0 0 0 1.52.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14z"/></svg>`,
  
  pause: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5a1.5 1.5 0 0 0-1.5 1.5v11A1.5 1.5 0 0 0 7 19h2a1.5 1.5 0 0 0 1.5-1.5v-11A1.5 1.5 0 0 0 9 5H7zm8 0a1.5 1.5 0 0 0-1.5 1.5v11a1.5 1.5 0 0 0 1.5 1.5h2a1.5 1.5 0 0 0 1.5-1.5v-11A1.5 1.5 0 0 0 17 5h-2z"/></svg>`,
  
  replay10: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 10A8 8 0 1 1 12 20a7.97 7.97 0 0 1-5.65-2.34"/>
    <polyline points="4 5 4 10 9 10"/>
    <text x="12" y="14.5" font-size="6.8" font-weight="700" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" text-anchor="middle" fill="currentColor" stroke="none">10</text>
  </svg>`,

  forward10: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 10A8 8 0 1 0 12 20a7.97 7.97 0 0 0 5.65-2.34"/>
    <polyline points="20 5 20 10 15 10"/>
    <text x="12" y="14.5" font-size="6.8" font-weight="700" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" text-anchor="middle" fill="currentColor" stroke="none">10</text>
  </svg>`,

  volumeHigh: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"/>
    <path d="M15.5 8.5a5 5 0 0 1 0 7"/>
    <path d="M19 5a9.5 9.5 0 0 1 0 14"/>
  </svg>`,

  volumeMute: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"/>
    <line x1="22" y1="9" x2="16" y2="15"/>
    <line x1="16" y1="9" x2="22" y2="15"/>
  </svg>`,

  subtitles: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2.5" y="5" width="19" height="14" rx="4"/>
    <path d="M10 9.5a2.5 2.5 0 0 0-2.5 2.5v0a2.5 2.5 0 0 0 2.5 2.5"/>
    <path d="M16.5 9.5a2.5 2.5 0 0 0-2.5 2.5v0a2.5 2.5 0 0 0 2.5 2.5"/>
  </svg>`,

  speedometer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 20a8 8 0 1 0-8-8 8 8 0 0 0 1.6 4.8"/>
    <circle cx="12" cy="12" r="2" fill="currentColor"/>
    <path d="M12 12l4-4"/>
  </svg>`,

  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="4" y1="7" x2="20" y2="7"/>
    <circle cx="9" cy="7" r="2.2" fill="currentColor"/>
    <line x1="4" y1="17" x2="20" y2="17"/>
    <circle cx="15" cy="17" r="2.2" fill="currentColor"/>
  </svg>`,

  quality: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2.5" y="5" width="19" height="14" rx="3.5"/>
    <path d="M7 9v6m0-3h3m0-3v6M14 9v6h1.8a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2H14z"/>
  </svg>`,

  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>`,

  pip: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2.5" y="4.5" width="19" height="15" rx="3"/>
    <rect x="11.5" y="11" width="8" height="6" rx="1.5" fill="currentColor"/>
  </svg>`,

  fullscreen: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M15 4h5v5M9 20H4v-5M20 15v5h-5M4 9V4h5"/>
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
  </svg>`,

  alertCircle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>`,

  refresh: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>`,

  brightness: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
  </svg>`
};


  /* =========================================================================
   * 2. Utility Formatters & Helpers
   * ========================================================================= */
/**
 * LiQu Player — Formatting and Utility Helpers
 */

/**
 * Format seconds into mm:ss or hh:mm:ss
 */
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

/**
 * Format remaining time with a minus sign e.g. -0:37 or -1:11:21
 */
function formatRemainingTime(current, total) {
  if (!isFinite(total) || total <= 0) return formatTime(current);
  const diff = Math.max(0, total - current);
  return `-${formatTime(diff)}`;
}

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

function isMobileDevice() {
  if (typeof navigator === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
}

function isLowPowerDevice() {
  if (typeof navigator === 'undefined') return false;
  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 4;
  const prefersReducedMotion = typeof window !== 'undefined' &&
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  return cores <= 2 || memory <= 2 || prefersReducedMotion;
}

function debounce(fn, wait = 100) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), wait);
  };
}

function throttle(fn, limit = 50) {
  let inThrottle = false;
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}


  /* =========================================================================
   * 3. Liquid Glass Engine
   * ========================================================================= */
/**
 * LiQu Player — LiquidEngine
 * Apple-style liquid glass refraction, chromatic aberration, and fluid physics.
 * Optimized for low memory and smooth performance across mobile and desktop.
 */

const SVG_NS = "http://www.w3.org/2000/svg";
let uid = 0;
let sharedSvgDefs = null;
const mapCache = new Map();

class LiquidEngine {
  constructor(options = {}) {
    this.mode = options.mode || (isLowPowerDevice() ? 'balanced' : 'ultra');
    this.instances = new Set();
    this.isSupported = this.checkRefractionSupport();
  }

  checkRefractionSupport() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return false;
    try {
      const ua = navigator.userAgent || '';
      const isSafari = /Safari/.test(ua) && !/Chrome|Chromium|Edg|OPR|Vivaldi/.test(ua);
      const isFirefox = /Firefox/.test(ua);
      if (isSafari || isFirefox) return false;
      if (typeof CSS === 'undefined' || !CSS.supports || !CSS.supports("backdrop-filter", "url(#lg)")) return false;
      const c = document.createElement("canvas");
      c.width = c.height = 4;
      return !!c.getContext("2d");
    } catch (_) {
      return false;
    }
  }

  getDefs() {
    if (sharedSvgDefs && document.body && document.body.contains(sharedSvgDefs.ownerSVGElement)) {
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
    svg.setAttribute("class", "liqu-svg-filters");
    sharedSvgDefs = document.createElementNS(SVG_NS, "defs");
    svg.appendChild(sharedSvgDefs);
    const mount = document.body || document.documentElement;
    if (mount) mount.appendChild(svg);
    return sharedSvgDefs;
  }

  getMap(w, h, radius, border, mapBlur, isSpherical = false) {
    const key = `${w}_${h}_${radius}_${border}_${mapBlur}_${isSpherical ? 's' : 'r'}`;
    if (mapCache.has(key)) {
      return mapCache.get(key);
    }

    try {
      const canvas = document.createElement("canvas");
      canvas.width = Math.min(w, 360);
      canvas.height = Math.min(h, 360);
      const scaleX = canvas.width / w;
      const scaleY = canvas.height / h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return "";

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
    } catch (_) {
      return "";
    }
  }

  buildFilter(id, scales) {
    try {
      const defs = this.getDefs();
      if (!defs) return null;

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

      defs.appendChild(filter);
      return { filter, feImage };
    } catch (_) {
      return null;
    }
  }

  apply(el, options = {}) {
    if (!el) return null;

    const opts = Object.assign({
      scale: options.isOrb ? -140 : -95,
      chroma: 7,
      border: options.isOrb ? 0.04 : 0.08,
      mapBlur: 10,
      blur: 3,
      saturate: 1.6,
      radius: null,
      fallbackBlur: 16,
      isOrb: false
    }, options);

    // Determine mode accurately
    const isLite = (this.mode === 'lite');
    let isUltra = (!isLite && this.mode === 'ultra' && this.isSupported);

    let parts = null;
    let filterId = null;

    if (isUltra) {
      try {
        filterId = `liqu-filter-${++uid}`;
        const scales = [opts.scale, opts.scale + opts.chroma, opts.scale + 2 * opts.chroma];
        parts = this.buildFilter(filterId, scales);
        if (!parts) {
          isUltra = false;
        }
      } catch (_) {
        isUltra = false;
      }
    }

    const applyFallback = () => {
      try {
        el.style.backdropFilter = `blur(${opts.fallbackBlur}px) saturate(${opts.saturate})`;
        el.style.webkitBackdropFilter = `blur(${opts.fallbackBlur}px) saturate(${opts.saturate})`;
      } catch (_) {}
    };

    const refresh = () => {
      try {
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        if (!w || !h) return;

        if (isUltra && parts && parts.feImage) {
          const computedRadius = opts.radius != null ? opts.radius : (Math.min(w, h) / 2);
          const mapUrl = this.getMap(w, h, computedRadius, opts.border, opts.mapBlur, opts.isOrb);
          if (mapUrl) {
            parts.feImage.setAttribute("href", mapUrl);
            parts.feImage.setAttribute("width", w);
            parts.feImage.setAttribute("height", h);
          } else {
            applyFallback();
          }
        }
      } catch (_) {
        applyFallback();
      }
    };

    // Clean any previous mode classes
    el.classList.remove("liqu-glass-lite");

    try {
      if (isLite) {
        el.style.backdropFilter = `blur(8px)`;
        el.style.webkitBackdropFilter = `blur(8px)`;
        el.classList.add("liqu-glass-lite");
      } else if (isUltra && filterId) {
        el.style.backdropFilter = `url(#${filterId}) blur(${opts.blur}px) saturate(${opts.saturate})`;
        el.style.webkitBackdropFilter = `url(#${filterId}) blur(${opts.blur}px) saturate(${opts.saturate})`;
      } else {
        applyFallback();
      }
    } catch (_) {
      applyFallback();
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

    const instance = {
      el,
      options: opts, // Preserved for setMode()
      refresh,
      destroy: () => {
        if (ro) ro.disconnect();
        clearTimeout(resizeTimer);
        el.removeEventListener("pointermove", onPointerMove);
        el.classList.remove("liqu-glass-lite");
        if (parts && parts.filter) {
          parts.filter.remove();
          parts = null;
        }
        el.style.backdropFilter = "";
        el.style.webkitBackdropFilter = "";
        this.instances.delete(instance);
      }
    };

    this.instances.add(instance);
    return instance;
  }

  setMode(newMode) {
    if (this.mode === newMode) return;
    this.mode = newMode;
    // Re-apply using stored per-element options!
    const oldInstances = Array.from(this.instances);
    oldInstances.forEach(inst => {
      const el = inst.el;
      const opts = inst.options;
      inst.destroy();
      this.apply(el, opts);
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
   * 4. Universal Media Source Manager
   * ========================================================================= */
/**
 * LiQu Player — SourceManager
 * Universal media engine supporting Direct Video (MP4/WebM/OGG/MOV),
 * HLS (.m3u8), MPEG-DASH (.mpd), YouTube, Vimeo, and procedural test streams.
 */

class SourceManager {
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


  /* =========================================================================
   * 5. UI & Liquid Controls Manager
   * ========================================================================= */
/**
 * LiQu Player — UIManager
 * Constructs and coordinates the liquid glass UI elements, menus,
 * time scrubbing, and responsive layouts.
 */


class UIManager {
  constructor(player) {
    this.player = player;
    this.container = player.container;
    this.opts = player.options;
    this.activeMenu = null;
    this.activeMenuGlassInst = null;
    this.isScrubbing = false;
    this.showRemaining = true;
    this.activeSubtitleTrack = -1; // -1 = Off

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

    this.container.addEventListener('click', (e) => {
      if (!e.target.closest('.liqu-popover') && !e.target.closest('.liqu-btn') && !e.target.closest('.liqu-bottom-dock') && !e.target.closest('.liqu-top-bar')) {
        this.closeMenu();
        this.player.togglePlay();
      } else if (!e.target.closest('.liqu-popover') && !e.target.closest('.liqu-btn')) {
        this.closeMenu();
      }
    });

    // Native video lifecycle & state event listeners
    this.video.addEventListener('play', () => {
      this.player._handlePlay('native');
    });
    this.video.addEventListener('pause', () => {
      this.player._handlePause('native');
    });
    this.video.addEventListener('ended', () => {
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

    // Native video error listener
    this.video.addEventListener('error', (e) => {
      const err = this.video.error;
      let msg = 'Playback failed.';
      if (err) {
        if (err.code === 1) msg = 'Playback was aborted.';
        else if (err.code === 2) msg = 'Network connection failed.';
        else if (err.code === 3) msg = 'Video decode error.';
        else if (err.code === 4) msg = 'Video format not supported or cross-origin access denied.';
      }
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

  destroy() {
    if (this.compactRo) {
      this.compactRo.disconnect();
      this.compactRo = null;
    }
    this.closeMenu();
    this.container.innerHTML = '';
  }
}


  /* =========================================================================
   * 6. Touch & Mobile Gesture Manager
   * ========================================================================= */
/**
 * LiQu Player — Gesture & Touch Manager
 * Double-tap to seek, vertical swipe brightness & volume HUD, auto-hide idle controls.
 */

class GestureManager {
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


  /* =========================================================================
   * 7. Keyboard & Shortcut Manager
   * ========================================================================= */
/**
 * LiQu Player — Keyboard & Shortcuts Manager
 */
class KeyboardManager {
  constructor(player) {
    this.player = player;
    this.enabled = true;
    this.onKeyDown = this.handleKeyDown.bind(this);
    window.addEventListener('keydown', this.onKeyDown);
  }

  handleKeyDown(e) {
    if (!this.enabled || !this.player.container) return;
    
    // Ignore keystrokes inside input / textarea / editable elements
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;

    // Only handle if player container is focused or active
    const isPlayerFocused = this.player.container.contains(e.target) || this.player.isFocused;
    if (!isPlayerFocused && !document.fullscreenElement) return;

    switch (e.key) {
      case ' ':
      case 'k':
      case 'K':
        e.preventDefault();
        this.player.togglePlay();
        break;

      case 'ArrowLeft':
      case 'j':
      case 'J':
        e.preventDefault();
        this.player.seekBy(-10);
        break;

      case 'ArrowRight':
      case 'l':
      case 'L':
        e.preventDefault();
        this.player.seekBy(10);
        break;

      case 'ArrowUp':
        e.preventDefault();
        this.player.setVolume(this.player.getVolume() + 0.05);
        this.player.showVolumeIndicator();
        break;

      case 'ArrowDown':
        e.preventDefault();
        this.player.setVolume(this.player.getVolume() - 0.05);
        this.player.showVolumeIndicator();
        break;

      case 'm':
      case 'M':
        e.preventDefault();
        this.player.toggleMute();
        break;

      case 'f':
      case 'F':
        e.preventDefault();
        this.player.toggleFullscreen();
        break;

      case 'p':
      case 'P':
        e.preventDefault();
        this.player.togglePiP();
        break;

      case 'c':
      case 'C':
        e.preventDefault();
        this.player.toggleCaptions();
        break;

      case '0': case '1': case '2': case '3': case '4':
      case '5': case '6': case '7': case '8': case '9':
        const fraction = parseInt(e.key, 10) / 10;
        this.player.seekTo(this.player.getDuration() * fraction);
        break;
    }
  }

  destroy() {
    window.removeEventListener('keydown', this.onKeyDown);
  }
}


  /* =========================================================================
   * 8. MediaSession System Integration
   * ========================================================================= */
/**
 * LiQu Player — MediaSessionManager
 * System lock-screen and control center integration for iOS, Android, macOS, and Windows.
 */
class MediaSessionManager {
  constructor(player) {
    this.player = player;
    this.isSupported = typeof navigator !== 'undefined' && 'mediaSession' in navigator;
    if (this.isSupported) {
      this.initHandlers();
    }
  }

  initHandlers() {
    try {
      const ms = navigator.mediaSession;
      ms.setActionHandler('play', () => this.player.play());
      ms.setActionHandler('pause', () => this.player.pause());
      ms.setActionHandler('seekbackward', (details) => {
        const offset = details.seekOffset || 10;
        this.player.seekBy(-offset);
      });
      ms.setActionHandler('seekforward', (details) => {
        const offset = details.seekOffset || 10;
        this.player.seekBy(offset);
      });
      ms.setActionHandler('seekto', (details) => {
        if (details.seekTime != null) {
          this.player.seekTo(details.seekTime);
        }
      });
      ms.setActionHandler('stop', () => this.player.pause());
    } catch (_) {}
  }

  updateMetadata(meta = {}) {
    if (!this.isSupported || typeof window.MediaMetadata === 'undefined') return;
    try {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: meta.title || 'LiQu Player',
        artist: meta.artist || meta.subtitle || 'LiQu Media',
        album: meta.album || 'Open Source Video Player',
        artwork: meta.poster ? [
          { src: meta.poster, sizes: '512x512', type: 'image/jpeg' }
        ] : []
      });
    } catch (_) {}
  }

  setPlaybackState(state) {
    if (!this.isSupported) return;
    try {
      navigator.mediaSession.playbackState = state === 'playing' ? 'playing' : 'paused';
    } catch (_) {}
  }

  updatePositionState(current, duration, playbackRate = 1) {
    if (!this.isSupported || !navigator.mediaSession.setPositionState) return;
    try {
      if (duration > 0 && isFinite(duration) && isFinite(current)) {
        navigator.mediaSession.setPositionState({
          duration: Math.max(0, duration),
          playbackRate: playbackRate,
          position: Math.max(0, Math.min(current, duration))
        });
      }
    } catch (_) {}
  }
}


  /* =========================================================================
   * 9. LiQu Player Master Controller
   * ========================================================================= */
/**
 * LiQu Player (LiQuPlayer.js)
 * Open Source Liquid Glass Video Player
 * https://github.com/ImAhmedZarir/LiQuPlayer.js
 *
 * (c) 2026 Ahmed Zarir & LiQu Player Open Source Team
 * Released under the MIT License.
 */









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



  // Attach helpers to LiQuPlayer namespace for external developers
  LiQuPlayer.icons = icons;
  LiQuPlayer.LiquidEngine = LiquidEngine;
  LiQuPlayer.SourceManager = SourceManager;
  LiQuPlayer.UIManager = UIManager;
  LiQuPlayer.GestureManager = GestureManager;
  LiQuPlayer.KeyboardManager = KeyboardManager;
  LiQuPlayer.MediaSessionManager = MediaSessionManager;
  LiQuPlayer.formatTime = formatTime;
  LiQuPlayer.formatRemainingTime = formatRemainingTime;
  LiQuPlayer.clamp = clamp;

  return LiQuPlayer;
});
