
// src/lib/analytics/live-feed.ts

export interface FeedEvent {
  id: string;
  type: string;
  data: any;
  timestamp: number;
}

export class LiveFeedStream {
  private listeners: ((event: FeedEvent) => void)[] = [];

  constructor() {
    // Simulación de WebSocket o SSE
    if (typeof window !== 'undefined') {
      setInterval(() => {
        this.emit({
          id: Math.random().toString(36),
          type: 'neural_pulse',
          data: { status: 'synchronized' },
          timestamp: Date.now()
        });
      }, 10000);
    }
  }

  public subscribe(callback: (event: FeedEvent) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private emit(event: FeedEvent) {
    this.listeners.forEach(l => l(event));
  }
}

export const earLiveStream = new LiveFeedStream();
