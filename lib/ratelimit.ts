import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Two budgets per identifier (typically client IP):
//   - 30 requests per 60 seconds  (burst)
//   - 200 requests per 24 hours    (daily cap)
//
// If UPSTASH_REDIS_REST_URL isn't set we silently no-op so local dev
// doesn't require an Upstash account. Production WILL want this — add
// the two env vars in Vercel and rate limiting kicks in automatically.

let burst: Ratelimit | null = null;
let daily: Ratelimit | null = null;
let initialised = false;

function init() {
  if (initialised) return;
  initialised = true;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "[ratelimit] UPSTASH_REDIS_REST_URL/TOKEN not set — running without rate limiting. Set both in Vercel env vars to enable.",
      );
    }
    return;
  }
  const redis = new Redis({ url, token });
  burst = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, "60 s"),
    analytics: true,
    prefix: "skillorbit:burst",
  });
  daily = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(200, "24 h"),
    analytics: true,
    prefix: "skillorbit:daily",
  });
}

export type RateLimitResult = {
  allowed: boolean;
  scope?: "burst" | "daily";
  reset?: number;
  remaining?: number;
};

export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
  init();
  if (!burst || !daily) return { allowed: true };

  const b = await burst.limit(identifier);
  if (!b.success) {
    return { allowed: false, scope: "burst", reset: b.reset, remaining: b.remaining };
  }
  const d = await daily.limit(identifier);
  if (!d.success) {
    return { allowed: false, scope: "daily", reset: d.reset, remaining: d.remaining };
  }
  return { allowed: true, remaining: Math.min(b.remaining, d.remaining) };
}

// Best-effort client identifier from the request. Vercel sets
// `x-forwarded-for`; fall back to `x-real-ip` then a constant.
export function clientIdFromRequest(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "anonymous";
}
