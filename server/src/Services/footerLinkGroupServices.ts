import FooterLinkGroup, {
    IFooterLinkGroup
} from "../Models/footerLinkGroupMaster";

// Create Footer Link Group
export const CreateFooterLinkGroup = async (
    data: Partial<IFooterLinkGroup>
) => {
    try {
        const footerLinkGroup = await FooterLinkGroup.create(data);
        return footerLinkGroup;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Get All Footer Link Groups
export const GetAllFooterLinkGroup = async () => {
    try {
        const footerLinkGroups = await FooterLinkGroup.find({
            isDeleted: false
        }).sort({ createdAt: -1 });

        return footerLinkGroups;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Get Footer Link Group By ID
export const GetFooterLinkGroupById = async (id: string) => {
    try {
        const footerLinkGroup = await FooterLinkGroup.findOne({
            _id: id,
            isDeleted: false
        });

        return footerLinkGroup;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Update Footer Link Group
export const UpdateFooterLinkGroup = async (
    id: string,
    data: Partial<IFooterLinkGroup>
) => {
    try {
        const footerLinkGroup = await FooterLinkGroup.findOneAndUpdate(
            {
                _id: id,
                isDeleted: false
            },
            {
                ...data,
                updatedAt: new Date()
            },
            {
                new: true,
                runValidators: true
            }
        );

        return footerLinkGroup;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Delete Footer Link Group (Soft Delete)
export const DeleteFooterLinkGroup = async (
    id: string,
    updatedBy: string
) => {
    try {
        const footerLinkGroup = await FooterLinkGroup.findOneAndUpdate(
            {
                _id: id,
                isDeleted: false
            },
            {
                isDeleted: true,
                updatedBy,
                updatedAt: new Date()
            },
            { new: true }
        );

        return footerLinkGroup;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Change Active Status
export const ChangeFooterLinkGroupActiveStatus = async (
    id: string,
    isActive: boolean,
    updatedBy: string
) => {
    try {
        const footerLinkGroup = await FooterLinkGroup.findOneAndUpdate(
            {
                _id: id,
                isDeleted: false
            },
            {
                isActive,
                updatedBy,
                updatedAt: new Date()
            },
            { new: true }
        );

        return footerLinkGroup;
    } catch (error: any) {
        throw new Error(error.message);
    }
};