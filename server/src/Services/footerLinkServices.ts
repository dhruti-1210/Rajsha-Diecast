
import FooterLinkMaster from "../Models/FooterLinkMaster";

// Create Footer Link
export const CreateFooterLinkMaster = async (data: any) => {
    try {
        const footerLink = await FooterLinkMaster.create(data);
        return footerLink;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Get All Footer Links
export const GetAllFooterLinkMaster = async () => {
    try {
        const footerLinks = await FooterLinkMaster.find({
            isDeleted: false
        })
            .populate("FooterLinkGroupId")
            .sort({ createdAt: -1 });

        return footerLinks;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Get Footer Link By ID
export const GetFooterLinkMasterById = async (id: string) => {
    try {
        const footerLink = await FooterLinkMaster.findOne({
            _id: id,
            isDeleted: false
        }).populate("FooterLinkGroupId");

        return footerLink;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Update Footer Link
export const UpdateFooterLinkMaster = async (
    id: string,
    data: any
) => {
    try {
        const footerLink = await FooterLinkMaster.findOneAndUpdate(
            { _id: id, isDeleted: false },
            {
                ...data,
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        );

        return footerLink;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Soft Delete Footer Link
export const DeleteFooterLinkMaster = async (id: string) => {
    try {
        const footerLink = await FooterLinkMaster.findOneAndUpdate(
            { _id: id, isDeleted: false },
            {
                isDeleted: true,
                updatedAt: new Date()
            },
            { new: true }
        );

        return footerLink;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Change Active Status
export const ChangeFooterLinkMasterActiveStatus = async (
    id: string,
    isActive: boolean,
    updatedBy?: string
) => {
    try {
        const footerLink = await FooterLinkMaster.findOneAndUpdate(
            { _id: id, isDeleted: false },
            {
                isActive,
                updatedBy,
                updatedAt: new Date()
            },
            { new: true }
        );

        return footerLink;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Change Display Status
export const ChangeFooterLinkMasterDisplayStatus = async (
    id: string,
    isDisplay: boolean,
    updatedBy?: string
) => {
    try {
        const footerLink = await FooterLinkMaster.findOneAndUpdate(
            { _id: id, isDeleted: false },
            {
                isDisplay,
                updatedBy,
                updatedAt: new Date()
            },
            { new: true }
        );

        return footerLink;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
