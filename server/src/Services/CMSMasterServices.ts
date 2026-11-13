
import CmsMaster, { ICmsMaster } from "../Models/CmsMaster";

// Create CMS
export const createCms = async (data: Partial<ICmsMaster>) => {
    try {
        const cms = new CmsMaster(data);
        return await cms.save();
    } catch (error) {
        throw error;
    }
};

// Get All CMS
export const getAllCms = async () => {
    try {
        return await CmsMaster.find({
            isDeleted: false
        }).sort({ createdAt: -1 });
    } catch (error) {
        throw error;
    }
};

// Get CMS By ID
export const getCmsById = async (id: string) => {
    try {
        return await CmsMaster.findOne({
            _id: id,
            isDeleted: false
        });
    } catch (error) {
        throw error;
    }
};

// Update CMS
export const updateCms = async (
    id: string,
    data: Partial<ICmsMaster>
) => {
    try {
        return await CmsMaster.findOneAndUpdate(
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
    } catch (error) {
        throw error;
    }
};

// Soft Delete CMS
export const deleteCms = async (
    id: string,
    updatedBy: string
) => {
    try {
        return await CmsMaster.findOneAndUpdate(
            {
                _id: id,
                isDeleted: false
            },
            {
                isDeleted: true,
                updatedBy,
                updatedAt: new Date()
            },
            {
                new: true
            }
        );
    } catch (error) {
        throw error;
    }
};

// Change CMS Status
export const changeCmsStatus = async (
    id: string,
    isActive: boolean,
    updatedBy: string
) => {
    try {
        return await CmsMaster.findOneAndUpdate(
            {
                _id: id,
                isDeleted: false
            },
            {
                isActive,
                updatedBy,
                updatedAt: new Date()
            },
            {
                new: true
            }
        );
    } catch (error) {
        throw error;
    }
};

// Change CMS Display Status
export const changeCmsDisplayStatus = async (
    id: string,
    isDisplay: boolean,
    updatedBy: string
) => {
    try {
        return await CmsMaster.findOneAndUpdate(
            {
                _id: id,
                isDeleted: false
            },
            {
                isDisplay,
                updatedBy,
                updatedAt: new Date()
            },
            {
                new: true
            }
        );
    } catch (error) {
        throw error;
    }
};
