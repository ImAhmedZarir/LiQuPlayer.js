/**
 * LiQu Player — TypeScript Definitions
 * Type declarations for LiQuPlayer.js (npm: liquplayer)
 *
 * (c) 2026 Ahmed Zarir & LiQu Player Open Source Team
 * Released under the MIT License.
 */

export type GlassMode = 'ultra' | 'balanced' | 'lite';

export interface SubtitleCue {
  start: number;
  end: number;
  text: string;
}

export interface SubtitleTrack {
  kind?: string;
  label?: string;
  srclang?: string;
  src?: string;
  default?: boolean;
  cues?: SubtitleCue[];
}

export interface NextEpisodeOptions {
  title?: string;
  onClick?: () => void;
}

export interface QualityOption {
  label: string;
  index: number;
  height?: number;
  bitrate?: number;
}

export interface LiQuPlayerOptions {
  /** Video media source: MP4/WebM URL, HLS (.m3u8), MPEG-DASH (.mpd), YouTube URL/ID, Vimeo URL, or test pattern */
  source?: string | { src: string; type?: string };
  /** Main title displayed in top liquid badge */
  title?: string;
  /** Subtitle or episode label (e.g. 'S1 · E1') */
  subtitle?: string;
  /** Poster image URL displayed before playback */
  poster?: string;
  /** Enable autoplay (gracefully retries muted if blocked by browser policy) */
  autoplay?: boolean;
  /** Initial mute state */
  muted?: boolean;
  /** Loop playback */
  loop?: boolean;
  /** Initial volume (0 to 1) */
  volume?: number;
  /** Initial playback speed (default 1) */
  playbackRate?: number;
  /** Liquid glass rendering tier: 'ultra' (Apple refraction), 'balanced' (60 FPS frosted), 'lite' (low RAM) */
  glassMode?: GlassMode;
  /** Real-time dynamic cinema ambient glow */
  ambientGlow?: boolean;
  /** Optional CORS attribute ('anonymous' | 'use-credentials') */
  crossOrigin?: 'anonymous' | 'use-credentials';
  /** Allow media download */
  downloadable?: boolean;
  /** Subtitles & captions tracks */
  subtitles?: SubtitleTrack[];
  /** Next episode pill configuration */
  nextEpisode?: NextEpisodeOptions;
  /** Custom callback when back button is clicked */
  onBack?: () => void;
}

export type PlayerEvent =
  | 'play'
  | 'pause'
  | 'ended'
  | 'timeupdate'
  | 'volumechange'
  | 'ratechange'
  | 'qualitychange'
  | 'sourceloaded'
  | 'fullscreenchange'
  | 'floatingchange'
  | 'brightnesschange'
  | 'error';

export declare class LiquidEngine {
  mode: GlassMode;
  isSupported: boolean;
  constructor(options?: { mode?: GlassMode });
  apply(el: HTMLElement, opts?: any): { destroy: () => void };
  setMode(mode: GlassMode): void;
}

export declare class SourceManager {
  currentSource: any;
  sourceType: 'direct' | 'hls' | 'dash' | 'youtube' | 'vimeo' | 'test_pattern' | 'unknown';
  qualities: QualityOption[];
  currentQualityIndex: number;
  load(source: string | { src: string }): Promise<void>;
  play(): void;
  pause(): void;
  seek(seconds: number): void;
  setVolume(volume: number): void;
  setMuted(muted: boolean): void;
  setSpeed(speed: number): void;
  setQuality(index: number): void;
  unload(): void;
}

export declare class UIManager {
  container: HTMLElement;
  video: HTMLVideoElement;
  activeSubtitleTrack: number;
  updatePlayState(isPlaying: boolean): void;
  updateProgress(current?: number, duration?: number): void;
  updateVolume(volume: number, isMuted: boolean): void;
  showSpinner(show: boolean): void;
  showError(message: string): void;
  hideError(): void;
  showHUD(iconSvg: string, text: string): void;
  toggleMenu(type: 'speed' | 'quality' | 'settings' | 'subtitles'): void;
  closeMenu(): void;
  showContextMenu(e: MouseEvent): void;
  closeContextMenu(): void;
  setSubtitleTrack(index: number): void;
  setSubtitles(tracks: SubtitleTrack[]): void;
  destroy(): void;
}

export declare class LiQuPlayer {
  container: HTMLElement;
  video: HTMLVideoElement;
  mediaWrapper: HTMLElement;
  options: LiQuPlayerOptions;
  isPlaying: boolean;
  ambientGlowEnabled: boolean;
  brightness: number;

  liquidEngine: LiquidEngine;
  sourceManager: SourceManager;
  ui: UIManager;

  constructor(target: string | HTMLElement, options?: LiQuPlayerOptions);

  /** Start media playback */
  play(): void;
  /** Pause media playback */
  pause(): void;
  /** Toggle play / pause state */
  togglePlay(): void;
  /** Seek to target seconds */
  seekTo(seconds: number): void;
  /** Seek forward or backwards by delta seconds */
  seekBy(deltaSeconds: number): void;
  /** Set audio volume between 0 and 1 */
  setVolume(volume: number): void;
  /** Get current audio volume */
  getVolume(): number;
  /** Check if player is muted */
  isMuted(): boolean;
  /** Toggle audio mute state */
  toggleMute(force?: boolean): void;
  /** Set media playback rate (e.g. 0.5, 1, 1.5, 2) */
  setPlaybackRate(rate: number): void;
  /** Get current media playback rate */
  getPlaybackRate(): number;
  /** Get current playback time in seconds */
  getCurrentTime(): number;
  /** Get total media duration in seconds */
  getDuration(): number;
  /** Get buffered TimeRanges */
  getBuffered(): TimeRanges | null;
  /** Set video quality by level index (-1 = Auto) */
  setQuality(index: number): void;
  /** Get available video qualities */
  getQualities(): QualityOption[];
  /** Dynamically update subtitles tracks */
  setSubtitles(tracks: SubtitleTrack[]): void;
  /** Toggle subtitles on / off */
  toggleCaptions(): void;
  /** Toggle full-screen mode */
  toggleFullscreen(): Promise<void>;
  /** Toggle Picture-in-Picture or floating miniplayer */
  togglePiP(): Promise<void>;
  /** Toggle in-page floating miniplayer */
  toggleFloatingMode(force?: boolean): Promise<void>;
  /** Toggle real-time dynamic ambient cinema glow */
  toggleAmbientGlow(): void;
  /** Adjust screen brightness filter (0.2 to 1.5) */
  setBrightness(val: number): void;
  /** Get current brightness level */
  getBrightness(): number;
  /** Load a new source with metadata */
  setSource(source: string | { src: string }, metadata?: { title?: string; subtitle?: string; poster?: string }): void;
  /** Display temporary HUD feedback pill */
  showHUD(iconSvg: string, text: string): void;
  /** Display error card */
  showError(message: string): void;
  /** Hide error card */
  hideError(): void;
  /** Retry loading media */
  retry(): void;
  /** Attach event listener */
  on(event: PlayerEvent | string, fn: (...args: any[]) => void): void;
  /** Remove event listener */
  off(event: PlayerEvent | string, fn: (...args: any[]) => void): void;
  /** Emit custom event */
  emit(event: PlayerEvent | string, ...args: any[]): void;
  /** Destroy player instance and clean up all listeners and DOM */
  destroy(): void;

  // Static properties and helper sub-modules
  static icons: Record<string, string>;
  static LiquidEngine: typeof LiquidEngine;
  static SourceManager: typeof SourceManager;
  static UIManager: typeof UIManager;
  static formatTime(seconds: number): string;
  static formatRemainingTime(current: number, duration: number): string;
  static clamp(val: number, min: number, max: number): number;
}

export default LiQuPlayer;
