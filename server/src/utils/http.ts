export type ApiMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
  meta?: ApiMeta;
};

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export const asyncHandler = <T extends (req: any, res: any, next?: any) => Promise<any>>(handler: T) =>
  (req: any, res: any, next: any) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };

export function sendSuccess<T>(res: any, status: number, message: string, data: T, meta?: ApiMeta) {
  const body: ApiSuccess<T> = { success: true, message, data };
  if (meta) body.meta = meta;
  return res.status(status).json(body);
}

export function sendError(res: any, error: unknown) {
  if (error instanceof ApiError) {
    return res.status(error.status).json({
      success: false,
      message: error.message,
      ...(error.details ? { details: error.details } : {})
    });
  }

  const err = error as any;
  if (err?.name === "ValidationError") {
    return res.status(400).json({ success: false, message: err.message || "Validation failed" });
  }
  if (err?.name === "CastError") {
    return res.status(400).json({ success: false, message: "Invalid identifier" });
  }

  const message = error instanceof Error ? error.message : "Internal server error";
  return res.status(500).json({ success: false, message });
}

export function assertFound<T>(value: T | null | undefined, message = "Resource not found"): T {
  if (value == null) throw new ApiError(404, message);
  return value;
}
