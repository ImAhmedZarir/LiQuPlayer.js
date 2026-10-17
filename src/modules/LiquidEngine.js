/**
 * LiQu Player — LiquidEngine
 * Apple-style liquid glass refraction, chromatic aberration, and fluid physics.
 * Optimized for low memory and smooth performance across mobile and desktop.
 */
import { isLowPowerDevice } from '../utils/formatters.js';

const SVG_NS = "http://www.w3.org/2000/svg";
let uid = 0;
let sharedSvgDefs = null;
const mapCache = new Map();

export class LiquidEngine {
  constructor(options = {}) {
    this.mode = options.mode || (isLowPowerDevice() ? 'balanced' : 'ultra');
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
    svg.className = "liqu-svg-filters";
    sharedSvgDefs = document.createElementNS(SVG_NS, "defs");
    svg.appendChild(sharedSvgDefs);
    document.body.appendChild(svg);
    return sharedSvgDefs;
  }

  getMap(w, h, radius, border, mapBlur, isSpherical = false) {
    const key = `${w}_${h}_${radius}_${border}_${mapBlur}_${isSpherical ? 's' : 'r'}`;
    if (mapCache.has(key)) {
      return mapCache.get(key);
    }

    const canvas = document.createElement("canvas");
    canvas.width = Math.min(w, 360);
    canvas.height = Math.min(h, 360);
    const scaleX = canvas.width / w;
    const scaleY = canvas.height / h;
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
    const isUltra = (!isLite && this.mode === 'ultra' && this.isSupported);
    const isBalanced = (!isLite && !isUltra);

    let parts = null;
    let filterId = null;

    if (isUltra) {
      filterId = `liqu-filter-${++uid}`;
      const scales = [opts.scale, opts.scale + opts.chroma, opts.scale + 2 * opts.chroma];
      parts = this.buildFilter(filterId, scales);
    }

    const refresh = () => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      if (!w || !h) return;

      if (isUltra && parts) {
        const computedRadius = opts.radius != null ? opts.radius : (Math.min(w, h) / 2);
        const mapUrl = this.getMap(w, h, computedRadius, opts.border, opts.mapBlur, opts.isOrb);
        parts.feImage.setAttribute("href", mapUrl);
        parts.feImage.setAttribute("width", w);
        parts.feImage.setAttribute("height", h);
      }
    };

    // Clean any previous mode classes
    el.classList.remove("liqu-glass-lite");

    if (isLite) {
      el.style.backdropFilter = `blur(8px)`;
      el.style.webkitBackdropFilter = `blur(8px)`;
      el.classList.add("liqu-glass-lite");
    } else if (isUltra) {
      el.style.backdropFilter = `url(#${filterId}) blur(${opts.blur}px) saturate(${opts.saturate})`;
      el.style.webkitBackdropFilter = `url(#${filterId}) blur(${opts.blur}px) saturate(${opts.saturate})`;
    } else {
      el.style.backdropFilter = `blur(${opts.fallbackBlur}px) saturate(${opts.saturate})`;
      el.style.webkitBackdropFilter = `blur(${opts.fallbackBlur}px) saturate(${opts.saturate})`;
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
