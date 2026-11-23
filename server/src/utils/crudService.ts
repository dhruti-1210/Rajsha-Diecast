import { buildMeta, buildSearchFilter, notDeletedFilter, type ListQuery } from "./query";

export async function listDocuments(model: any, query: Partial<ListQuery> | any, options?: { searchFields?: string[]; populate?: any; baseFilter?: Record<string, any> }) {
  const base: any = { ...notDeletedFilter, ...(options?.baseFilter || {}) };
  if (query?.isActive !== undefined) base.isActive = query.isActive;
  if (query?.isDisplay !== undefined) base.isDisplay = query.isDisplay;
  const search = typeof query?.search === "string" ? query.search.trim() : "";
  const filter = search && options?.searchFields?.length
    ? { $and: [base, buildSearchFilter(search, options.searchFields)] }
    : base;
  const sort = query?.sort ?? { createdAt: -1 };

  if (query?.paginate) {
    const page = Number(query.page) > 0 ? Number(query.page) : 1;
    const limit = Number(query.limit) > 0 ? Number(query.limit) : 20;
    const skip = Number.isFinite(query.skip) ? Number(query.skip) : (page - 1) * limit;
    let findQuery = model.find(filter).sort(sort).skip(skip).limit(limit);
    if (options?.populate) findQuery = findQuery.populate(options.populate);
    const [items, total] = await Promise.all([findQuery, model.countDocuments(filter)]);
    return { items, meta: buildMeta(total, page, limit) };
  }

  let findAll = model.find(filter).sort(sort);
  if (options?.populate) findAll = findAll.populate(options.populate);
  return await findAll;
}

export async function findActiveById(model: any, id: string, populate?: any) {
  let q = model.findOne({ _id: id, ...notDeletedFilter });
  if (populate) q = q.populate(populate);
  return await q;
}

export async function updateActiveById(model: any, id: string, data: Record<string, any>) {
  return await model.findOneAndUpdate({ _id: id, ...notDeletedFilter }, data, { new: true, runValidators: true });
}

export async function softDeleteById(model: any, id: string, updatedBy: string) {
  return await model.findOneAndUpdate({ _id: id, ...notDeletedFilter }, { isDeleted: true, updatedBy }, { new: true });
}

export async function setActiveStatusById(model: any, id: string, isActive: boolean, updatedBy: string) {
  return await model.findOneAndUpdate({ _id: id, ...notDeletedFilter }, { isActive, updatedBy }, { new: true });
}

export async function setDisplayStatusById(model: any, id: string, isDisplay: boolean, updatedBy: string) {
  return await model.findOneAndUpdate({ _id: id, ...notDeletedFilter }, { isDisplay, updatedBy }, { new: true });
}
