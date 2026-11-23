import { Request, Response, NextFunction } from "express";

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function createRateLimiter(options?: { windowMs?: number; max?: number }) {
  const windowMs = options?.windowMs ?? 60_000;
  const max = options?.max ?? 120;
  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const key = `${req.ip || "unknown"}:${req.baseUrl || ""}${req.path || ""}`;
    const bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }
    if (bucket.count >= max) {
      return res.status(429).json({ success: false, message: "Too many requests. Please try again later." });
    }
    bucket.count += 1;
    return next();
  };
}

export const authRateLimiter = createRateLimiter({ windowMs: 15 * 60_000, max: 50 });
export const apiMutationRateLimiter = createRateLimiter({ windowMs: 60_000, max: 180 });
