export type AppState = 'settings' | 'idle' | 'incoming' | 'active';

export interface CallerSettings {
  name: string;
  image: string;
  videoUrl: string;
  delaySeconds: number;
}
