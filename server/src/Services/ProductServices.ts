
import ProductMaster, { ProductMasterInput } from "../Models/ProductMaster";
import { buildMeta, notDeletedFilter, type ListQuery } from "../utils/query";

type ProductListQuery = Partial<ListQuery> & {
    brandId?: string | string[];
    packagingTypeId?: string | string[];
    minPrice?: number;
    maxPrice?: number;
    shop?: boolean | string;
};

const toIdArray = (value: unknown): string[] => {
    if (Array.isArray(value)) return value.flatMap((item) => toIdArray(item));
    if (typeof value !== "string") return [];
    return value.split(",").map((item) => item.trim()).filter(Boolean);
};

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeStockFields = <T extends Record<string, any>>(data: T): T => {
    const next = { ...data } as any;
    if (next.stockRemaining !== undefined && next.TotalStock === undefined) {
        next.TotalStock = next.stockRemaining;
    } else if (next.TotalStock !== undefined && next.stockRemaining === undefined) {
        next.stockRemaining = next.TotalStock;
    }
    return next;
};

// Create Product
export const CreateProductMaster = async (data: ProductMasterInput) => {
    try {
        const payload = normalizeStockFields(data as any);
        if (payload.stockRemaining === undefined && payload.TotalStock === undefined) {
            payload.TotalStock = 0;
            payload.stockRemaining = 0;
        }
        const product = new ProductMaster(payload);
        return await product.save();
    } catch (error) {
        throw error;
    }
};

// Get All Products
export const GetAllProductMaster = async (query?: ProductListQuery) => {
    try {
        const base: Record<string, any> = { ...notDeletedFilter };
        if (query?.isActive !== undefined) base.isActive = query.isActive;
        if (query?.isDisplay !== undefined) base.isDisplay = query.isDisplay;
        if (query?.shop === true || query?.shop === "true") {
            base.isActive = true;
            base.isDisplay = true;
        }

        const andFilters: any[] = [base];

        const search = typeof query?.search === "string" ? query.search.trim() : "";
        if (search) {
            const terms = search.split(/\s+/).filter(Boolean);
            const searchFields = ["Name", "BrandName", "Size", "ModelCode"];
            for (const term of terms) {
                const regex = new RegExp(escapeRegex(term), "i");
                andFilters.push({ $or: searchFields.map((field) => ({ [field]: regex })) });
            }
        }

        const brandIds = toIdArray(query?.brandId);
        if (brandIds.length) {
            andFilters.push({ Company_Id: { $in: brandIds } });
        }

        const packagingTypeIds = toIdArray(query?.packagingTypeId);
        if (packagingTypeIds.length) {
            andFilters.push({ Packagingtype_Id: { $in: packagingTypeIds } });
        }

        const minPrice = Number(query?.minPrice);
        const maxPrice = Number(query?.maxPrice);
        if (Number.isFinite(minPrice) || Number.isFinite(maxPrice)) {
            const priceFilter: Record<string, number> = {};
            if (Number.isFinite(minPrice)) priceFilter.$gte = minPrice;
            if (Number.isFinite(maxPrice)) priceFilter.$lte = maxPrice;
            andFilters.push({ Price: priceFilter });
        }

        const filter = andFilters.length === 1 ? andFilters[0] : { $and: andFilters };
        const sort = query?.sort ?? { createdAt: -1 };

        if (query?.paginate) {
            const page = Number(query?.page) > 0 ? Math.floor(Number(query.page)) : 1;
            const limit = 8;
            const skip = (page - 1) * limit;
            const isShop = query?.shop === true || query?.shop === "true";
            const boundsFilter = isShop
                ? { ...notDeletedFilter, isActive: true, isDisplay: true }
                : { ...notDeletedFilter };
            const [items, total, bounds] = await Promise.all([
                ProductMaster.find(filter).sort(sort).skip(skip).limit(limit),
                ProductMaster.countDocuments(filter),
                ProductMaster.aggregate<{ _id: null; maxPrice: number }>([
                    { $match: boundsFilter },
                    { $group: { _id: null, maxPrice: { $max: "$Price" } } }
                ])
            ]);
            const meta = {
                ...buildMeta(total, page, limit),
                priceMax: bounds[0]?.maxPrice ?? 0
            };
            return { items, meta };
        }

        return await ProductMaster.find(filter).sort(sort);
    } catch (error) {
        throw error;
    }
};

// Get Product By ID
export const GetProductMasterById = async (id: string) => {
    try {
        return await ProductMaster.findOne({
            _id: id,
            isDeleted: false
        });
    } catch (error) {
        throw error;
    }
};

// Update Product
export const UpdateProductMaster = async (
    id: string,
    data: ProductMasterInput
) => {
    try {
        const payload = normalizeStockFields(data as any);
        return await ProductMaster.findOneAndUpdate(
            { _id: id, isDeleted: false },
            {
                ...payload,
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        );
    } catch (error) {
        throw error;
    }
};

// Soft Delete Product
export const DeleteProductMaster = async (id: string, updatedBy: string) => {
    try {
        return await ProductMaster.findOneAndUpdate(
            { _id: id, isDeleted: false },
            {
                isDeleted: true,
                updatedBy,
                updatedAt: new Date()
            },
            { new: true }
        );
    } catch (error) {
        throw error;
    }
};

// Change Active Status
export const ChangeProductActiveStatus = async (
    id: string,
    isActive: boolean,
    updatedBy: string
) => {
    try {
        return await ProductMaster.findOneAndUpdate(
            { _id: id, isDeleted: false },
            {
                isActive,
                updatedBy,
                updatedAt: new Date()
            },
            { new: true }
        );
    } catch (error) {
        throw error;
    }
};

// Change Display Status
export const ChangeProductDisplayStatus = async (
    id: string,
    isDisplay: boolean,
    updatedBy: string
) => {
    try {
        return await ProductMaster.findOneAndUpdate(
            { _id: id, isDeleted: false },
            {
                isDisplay,
                updatedBy,
                updatedAt: new Date()
            },
            { new: true }
        );
    } catch (error) {
        throw error;
    }
};
