/**
 * LiQu Player - Standalone UMD Bundler
 * Compiles modular source files into standalone LiQuPlayer.js and dist/LiQuPlayer.js
 */

const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '..', 'src');
const rootFile = path.resolve(__dirname, '..', 'LiQuPlayer.js');
const distFile = path.resolve(__dirname, '..', 'dist', 'LiQuPlayer.js');

function stripImportsAndExports(code) {
  return code
    .replace(/^import\s+[^;]+;\s*$/gm, '')
    .replace(/^export\s+(const|class|function|let|var)\s+/gm, '$1 ')
    .replace(/^export\s*\{[^}]*\};?\s*$/gm, '')
    .replace(/^export\s+default\s+[^;]+;\s*$/gm, '');
}

const iconsCode = stripImportsAndExports(fs.readFileSync(path.join(srcDir, 'utils', 'icons.js'), 'utf-8'));
const formattersCode = stripImportsAndExports(fs.readFileSync(path.join(srcDir, 'utils', 'formatters.js'), 'utf-8'));
const liquidEngineCode = stripImportsAndExports(fs.readFileSync(path.join(srcDir, 'modules', 'LiquidEngine.js'), 'utf-8'));
const sourceManagerCode = stripImportsAndExports(fs.readFileSync(path.join(srcDir, 'modules', 'SourceManager.js'), 'utf-8'));
const uiManagerCode = stripImportsAndExports(fs.readFileSync(path.join(srcDir, 'modules', 'UIManager.js'), 'utf-8'));
const gestureManagerCode = stripImportsAndExports(fs.readFileSync(path.join(srcDir, 'modules', 'GestureManager.js'), 'utf-8'));
const keyboardManagerCode = stripImportsAndExports(fs.readFileSync(path.join(srcDir, 'modules', 'KeyboardManager.js'), 'utf-8'));
const mediaSessionCode = stripImportsAndExports(fs.readFileSync(path.join(srcDir, 'modules', 'MediaSessionManager.js'), 'utf-8'));
const mainPlayerCode = stripImportsAndExports(fs.readFileSync(path.join(srcDir, 'LiQuPlayer.js'), 'utf-8'));

const banner = `/*!
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

`;

const footer = `

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
`;

const bundle = banner + [
  '  /* =========================================================================\n   * 1. Vector Retina Icons\n   * ========================================================================= */\n' + iconsCode,
  '  /* =========================================================================\n   * 2. Utility Formatters & Helpers\n   * ========================================================================= */\n' + formattersCode,
  '  /* =========================================================================\n   * 3. Liquid Glass Engine\n   * ========================================================================= */\n' + liquidEngineCode,
  '  /* =========================================================================\n   * 4. Universal Media Source Manager\n   * ========================================================================= */\n' + sourceManagerCode,
  '  /* =========================================================================\n   * 5. UI & Liquid Controls Manager\n   * ========================================================================= */\n' + uiManagerCode,
  '  /* =========================================================================\n   * 6. Touch & Mobile Gesture Manager\n   * ========================================================================= */\n' + gestureManagerCode,
  '  /* =========================================================================\n   * 7. Keyboard & Shortcut Manager\n   * ========================================================================= */\n' + keyboardManagerCode,
  '  /* =========================================================================\n   * 8. MediaSession System Integration\n   * ========================================================================= */\n' + mediaSessionCode,
  '  /* =========================================================================\n   * 9. LiQu Player Master Controller\n   * ========================================================================= */\n' + mainPlayerCode
].join('\n\n') + footer;

fs.writeFileSync(rootFile, bundle, 'utf-8');
fs.writeFileSync(distFile, bundle, 'utf-8');

console.log(`[Build] Successfully compiled LiQuPlayer.js (${(bundle.length / 1024).toFixed(1)} KB)`);
