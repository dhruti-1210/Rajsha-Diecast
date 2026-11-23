import FooterLinkGroup, {
    IFooterLinkGroup
} from "../Models/footerLinkGroupMaster";
import { buildMeta, buildSearchFilter, notDeletedFilter, type ListQuery } from "../utils/query";

export type FooterLinkGroupListResult = {
    items: IFooterLinkGroup[];
    meta: { page: number; limit: number; total: number; totalPages: number };
};

// Create Footer Link Group
export const CreateFooterLinkGroup = async (
    data: Partial<IFooterLinkGroup>
) => {
    const footerLinkGroup = await FooterLinkGroup.create(data);
    return footerLinkGroup;
};

// Get All Footer Link Groups
export const GetAllFooterLinkGroup = async (query?: Partial<ListQuery> | any): Promise<IFooterLinkGroup[] | FooterLinkGroupListResult> => {
    const baseFilter: any = { ...notDeletedFilter };
    if (query?.isActive !== undefined) baseFilter.isActive = query.isActive;
    if (query?.isDisplay !== undefined) baseFilter.isDisplay = query.isDisplay;

    const search = typeof query?.search === "string" ? query.search.trim() : "";
    const filter = search ? { $and: [baseFilter, buildSearchFilter(search, ["FooterLinkGroupName"])] } : baseFilter;
    const sort = query?.sort ?? { createdAt: -1 };

    if (query?.paginate) {
        const page = Number(query.page) > 0 ? Number(query.page) : 1;
        const limit = Number(query.limit) > 0 ? Number(query.limit) : 20;
        const skip = Number.isFinite(query.skip) ? Number(query.skip) : (page - 1) * limit;
        const [items, total] = await Promise.all([
            FooterLinkGroup.find(filter).sort(sort).skip(skip).limit(limit),
            FooterLinkGroup.countDocuments(filter)
        ]);
        return { items, meta: buildMeta(total, page, limit) };
    }

    const items = await FooterLinkGroup.find(filter).sort(sort);
    return items;
};

// Get Footer Link Group By ID
export const GetFooterLinkGroupById = async (id: string) => {
    const footerLinkGroup = await FooterLinkGroup.findOne({
        _id: id,
        ...notDeletedFilter
    });
    return footerLinkGroup;
};

// Update Footer Link Group
export const UpdateFooterLinkGroup = async (
    id: string,
    data: Partial<IFooterLinkGroup>
) => {
    const footerLinkGroup = await FooterLinkGroup.findOneAndUpdate(
        {
            _id: id,
            ...notDeletedFilter
        },
        {
            ...data
        },
        {
            new: true,
            runValidators: true
        }
    );
    return footerLinkGroup;
};

// Delete Footer Link Group (Soft Delete)
export const DeleteFooterLinkGroup = async (
    id: string,
    updatedBy: string
) => {
    const footerLinkGroup = await FooterLinkGroup.findOneAndUpdate(
        {
            _id: id,
            ...notDeletedFilter
        },
        {
            isDeleted: true,
            updatedBy
        },
        { new: true }
    );
    return footerLinkGroup;
};

// Change Active Status
export const ChangeFooterLinkGroupActiveStatus = async (
    id: string,
    isActive: boolean,
    updatedBy: string
) => {
    const footerLinkGroup = await FooterLinkGroup.findOneAndUpdate(
        {
            _id: id,
            ...notDeletedFilter
        },
        {
            isActive,
            updatedBy
        },
        { new: true }
    );
    return footerLinkGroup;
};

// Change Display Status
export const ChangeFooterLinkGroupDisplayStatus = async (
    id: string,
    isDisplay: boolean,
    updatedBy: string
) => {
    const footerLinkGroup = await FooterLinkGroup.findOneAndUpdate(
        {
            _id: id,
            ...notDeletedFilter
        },
        {
            isDisplay,
            updatedBy
        },
        { new: true }
    );
    return footerLinkGroup;
};
