import type { Request } from "express";

export type ListQuery = {
  page: number;
  limit: number;
  skip: number;
  search: string;
  sort: Record<string, 1 | -1>;
  isActive?: boolean;
  isDisplay?: boolean;
  all: boolean;
  paginate: boolean;
};

const toBoolean = (value: unknown): boolean | undefined => {
  if (value === undefined || value === null || value === "") return undefined;
  if (value === true || value === "true" || value === "1") return true;
  if (value === false || value === "false" || value === "0") return false;
  return undefined;
};

export function parseListQuery(req: Request, defaults?: { limit?: number; maxLimit?: number; sort?: Record<string, 1 | -1> }): ListQuery {
  const limitDefault = defaults?.limit ?? 20;
  const maxLimit = defaults?.maxLimit ?? 100;
  const pageRaw = Number(req.query.page ?? 1);
  const limitRaw = Number(req.query.limit ?? limitDefault);
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;
  const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(Math.floor(limitRaw), maxLimit) : limitDefault;
  const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
  const explicitPaginate = req.query.page !== undefined || req.query.limit !== undefined || req.query.search !== undefined || req.query.paginate !== undefined || req.query.all !== undefined;
  const all = toBoolean(req.query.all) === true;
  const paginateFlag = toBoolean(req.query.paginate);
  const paginate = all ? false : (paginateFlag ?? explicitPaginate);
  return {
    page,
    limit,
    skip: (page - 1) * limit,
    search,
    sort: defaults?.sort ?? { createdAt: -1 },
    isActive: toBoolean(req.query.isActive),
    isDisplay: toBoolean(req.query.isDisplay),
    all,
    paginate
  };
}

export function buildSearchFilter(search: string, fields: string[]) {
  if (!search || fields.length === 0) return {};
  const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escaped, "i");
  return { $or: fields.map((field) => ({ [field]: regex })) };
}

export function buildMeta(total: number, page: number, limit: number) {
  return { total, page, limit, totalPages: Math.max(1, Math.ceil(total / Math.max(limit, 1))) };
}

export const notDeletedFilter = {
  $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }]
};
