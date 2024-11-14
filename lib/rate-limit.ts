export interface RateLimitConfig {
  interval: number;
  maxRequests: number;
  uniqueTokenPerInterval?: number;
}

export function rateLimit(config: RateLimitConfig) {
  const windowSize = config.interval;
  const maxRequests = config.maxRequests;
  const cache = new Map();

  return {
    check: (request: Request) => {
      const ip = request.headers.get('x-forwarded-for') || 'anonymous';
      const tokenCount = cache.get(ip) || [0];
      const currentTime = Date.now();
      const clearBefore = currentTime - windowSize;

      if (tokenCount[0] > maxRequests) {
        return Promise.reject('Rate limit exceeded');
      }

      cache.set(ip, [tokenCount[0] + 1, currentTime]);

      return Promise.resolve();
    },
  };
}