import ReactPlayer from 'react-player'

export declare class ReactPlayerType extends ReactPlayer {
  static canPlay(url: string): boolean
  static canEnablePIP(url: string): boolean
  static addCustomPlayer(player: ReactPlayer): void
  static removeCustomPlayers(): void
  seekTo(amount: number, type?: 'seconds' | 'fraction'): void
  getCurrentTime(): number
  getSecondsLoaded(): number
  getDuration(): number
  getInternalPlayer(key?: string): Record<string, any>
  showPreview(): void
}
