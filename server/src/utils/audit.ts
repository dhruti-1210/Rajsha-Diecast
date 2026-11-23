import type { Request } from "express";

export function getRequestActor(req: Request, fallback?: unknown): string {
  const user = (req as any).user as { id?: string; username?: string; userName?: string } | undefined;
  const fromBody = typeof fallback === "string" && fallback.trim() ? fallback.trim() : undefined;
  return user?.username?.trim() || user?.userName?.trim() || user?.id || fromBody || "system";
}

export function pickAllowed<T extends Record<string, any>>(source: T, allowed: string[]) {
  const out: Record<string, any> = {};
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(source, key) && source[key] !== undefined) {
      out[key] = source[key];
    }
  }
  return out;
}
