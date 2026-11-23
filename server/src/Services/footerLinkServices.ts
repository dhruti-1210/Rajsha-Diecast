import FooterLinkMaster from "../Models/FooterLinkMaster";
import { buildMeta, buildSearchFilter, notDeletedFilter, type ListQuery } from "../utils/query";

export type FooterLinkListResult = {
    items: any[];
    meta: { page: number; limit: number; total: number; totalPages: number };
};

// Create Footer Link
export const CreateFooterLinkMaster = async (data: any) => {
    const footerLink = await FooterLinkMaster.create(data);
    return footerLink;
};

// Get All Footer Links
export const GetAllFooterLinkMaster = async (query?: Partial<ListQuery> & { FooterLinkGroupId?: string } | any) => {
    const baseFilter: any = { ...notDeletedFilter };
    if (query?.isActive !== undefined) baseFilter.isActive = query.isActive;
    if (query?.isDisplay !== undefined) baseFilter.isDisplay = query.isDisplay;
    if (query?.FooterLinkGroupId) baseFilter.FooterLinkGroupId = query.FooterLinkGroupId;

    const search = typeof query?.search === "string" ? query.search.trim() : "";
    const filter = search
        ? { $and: [baseFilter, buildSearchFilter(search, ["FooterLinkName", "FooterLinkUrl"])] }
        : baseFilter;
    const sort = query?.sort ?? { createdAt: -1 };

    if (query?.paginate) {
        const page = Number(query.page) > 0 ? Number(query.page) : 1;
        const limit = Number(query.limit) > 0 ? Number(query.limit) : 20;
        const skip = Number.isFinite(query.skip) ? Number(query.skip) : (page - 1) * limit;
        const [items, total] = await Promise.all([
            FooterLinkMaster.find(filter).populate("FooterLinkGroupId").sort(sort).skip(skip).limit(limit),
            FooterLinkMaster.countDocuments(filter)
        ]);
        return { items, meta: buildMeta(total, page, limit) } as FooterLinkListResult;
    }

    const items = await FooterLinkMaster.find(filter).populate("FooterLinkGroupId").sort(sort);
    return items;
};

// Get Footer Link By ID
export const GetFooterLinkMasterById = async (id: string) => {
    const footerLink = await FooterLinkMaster.findOne({
        _id: id,
        isDeleted: false
    }).populate("FooterLinkGroupId");
    return footerLink;
};

// Update Footer Link
export const UpdateFooterLinkMaster = async (
    id: string,
    data: any
) => {
    const footerLink = await FooterLinkMaster.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { ...data },
        { new: true, runValidators: true }
    );
    return footerLink;
};

// Soft Delete Footer Link
export const DeleteFooterLinkMaster = async (id: string, updatedBy?: string) => {
    const footerLink = await FooterLinkMaster.findOneAndUpdate(
        { _id: id, isDeleted: false },
        {
            isDeleted: true,
            ...(updatedBy ? { updatedBy } : {})
        },
        { new: true }
    );
    return footerLink;
};

// Change Active Status
export const ChangeFooterLinkMasterActiveStatus = async (
    id: string,
    isActive: boolean,
    updatedBy?: string
) => {
    const footerLink = await FooterLinkMaster.findOneAndUpdate(
        { _id: id, isDeleted: false },
        {
            isActive,
            ...(updatedBy ? { updatedBy } : {})
        },
        { new: true }
    );
    return footerLink;
};

// Change Display Status
export const ChangeFooterLinkMasterDisplayStatus = async (
    id: string,
    isDisplay: boolean,
    updatedBy?: string
) => {
    const footerLink = await FooterLinkMaster.findOneAndUpdate(
        { _id: id, isDeleted: false },
        {
            isDisplay,
            ...(updatedBy ? { updatedBy } : {})
        },
        { new: true }
    );
    return footerLink;
};
