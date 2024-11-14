interface ErrorEvent {
  message: string;
  stack?: string;
  context?: any;
  timestamp: number;
}

class Monitoring {
  private static instance: Monitoring;
  private errorQueue: ErrorEvent[] = [];
  private readonly maxQueueSize = 100;
  private readonly flushInterval = 5000; // 5 seconds

  private constructor() {
    this.startFlushInterval();
  }

  public static getInstance(): Monitoring {
    if (!Monitoring.instance) {
      Monitoring.instance = new Monitoring();
    }
    return Monitoring.instance;
  }

  public captureError(error: Error, context?: any) {
    const errorEvent: ErrorEvent = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: Date.now(),
    };

    this.errorQueue.push(errorEvent);

    if (this.errorQueue.length >= this.maxQueueSize) {
      this.flush();
    }
  }

  public captureMetric(name: string, value: number, tags?: Record<string, string>) {
    // Implement metric tracking logic
    console.log(`Metric: ${name} = ${value}`, tags);
  }

  private startFlushInterval() {
    setInterval(() => this.flush(), this.flushInterval);
  }

  private async flush() {
    if (this.errorQueue.length === 0) return;

    const errors = [...this.errorQueue];
    this.errorQueue = [];

    try {
      await fetch('/api/monitoring/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ errors }),
      });
    } catch (error) {
      console.error('Failed to flush errors:', error);
      // Re-add failed errors to the queue
      this.errorQueue.unshift(...errors);
    }
  }
}

export const monitoring = Monitoring.getInstance();