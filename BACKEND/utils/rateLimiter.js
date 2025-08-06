class RateLimiter {
  constructor(maxCalls = 25, windowMs = 1000) { // 25 calls per second (buffer for safety)
    this.maxCalls = maxCalls;
    this.windowMs = windowMs;
    this.calls = [];
  }

  async waitForSlot() {
    const now = Date.now();
    
    // Remove calls outside the current window
    this.calls = this.calls.filter(callTime => now - callTime < this.windowMs);
    
    // If we're at the limit, wait
    if (this.calls.length >= this.maxCalls) {
      const oldestCall = Math.min(...this.calls);
      const waitTime = this.windowMs - (now - oldestCall) + 10; // Add 10ms buffer
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return this.waitForSlot(); // Recursive call after waiting
    }
    
    // Record this call
    this.calls.push(now);
  }
}

module.exports = new RateLimiter();