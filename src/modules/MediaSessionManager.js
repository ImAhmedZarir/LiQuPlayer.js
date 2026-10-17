/**
 * LiQu Player — MediaSessionManager
 * System lock-screen and control center integration for iOS, Android, macOS, and Windows.
 */
export class MediaSessionManager {
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
