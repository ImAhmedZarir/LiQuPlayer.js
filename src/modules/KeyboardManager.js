/**
 * LiQu Player — Keyboard & Shortcuts Manager
 */
export class KeyboardManager {
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
