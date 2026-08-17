
/**
 * Simple Token Bucket Rate Limiter
 * Limits client-side calls to prevent hitting 429s immediately.
 */
class RateLimiter {
    private tokens: number;
    private maxTokens: number;
    private refillRate: number; // Tokens per second
    private lastRefill: number;

    constructor(maxTokens: number, refillRate: number) {
        this.tokens = maxTokens;
        this.maxTokens = maxTokens;
        this.refillRate = refillRate;
        this.lastRefill = Date.now();
    }

    private refill() {
        const now = Date.now();
        const elapsed = (now - this.lastRefill) / 1000;
        const newTokens = elapsed * this.refillRate;
        
        if (newTokens > 0) {
            this.tokens = Math.min(this.maxTokens, this.tokens + newTokens);
            this.lastRefill = now;
        }
    }

    public async waitForToken(): Promise<void> {
        this.refill();

        if (this.tokens >= 1) {
            this.tokens -= 1;
            return Promise.resolve();
        }

        // Wait until enough tokens are available
        const waitTime = ((1 - this.tokens) / this.refillRate) * 1000;
        console.warn(`[RateLimiter] Throttling request for ${Math.round(waitTime)}ms`);
        
        return new Promise(resolve => {
            setTimeout(() => {
                this.refill();
                this.tokens -= 1;
                resolve();
            }, waitTime);
        });
    }
}

// 15 requests per minute burst, refill 1 request every 4 seconds (approx 15 RPM sustained)
export const geminiRateLimiter = new RateLimiter(15, 0.25);
