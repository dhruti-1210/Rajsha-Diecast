
import CollectionType, { ICollectionType } from "../Models/CollectionTypeMaster";

// Create Collection Type
export const createCollectionType = async (
    data: Partial<ICollectionType>
) => {
    try {
        const collectionType = new CollectionType(data);
        return await collectionType.save();
    } catch (error) {
        throw error;
    }
};

// Get All Collection Types
export const getAllCollectionTypes = async () => {
    try {
        return await CollectionType.find({
            isDeleted: false
        }).sort({ createdAt: -1 });
    } catch (error) {
        throw error;
    }
};

// Get Collection Type By ID
export const getCollectionTypeById = async (id: string) => {
    try {
        return await CollectionType.findOne({
            _id: id,
            isDeleted: false
        });
    } catch (error) {
        throw error;
    }
};

// Update Collection Type
export const updateCollectionType = async (
    id: string,
    data: Partial<ICollectionType>
) => {
    try {
        return await CollectionType.findOneAndUpdate(
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

// Soft Delete Collection Type
export const deleteCollectionType = async (
    id: string,
    updatedBy: string
) => {
    try {
        return await CollectionType.findOneAndUpdate(
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

// Change Collection Type Status
export const changeCollectionTypeStatus = async (
    id: string,
    isActive: boolean,
    updatedBy: string
) => {
    try {
        return await CollectionType.findOneAndUpdate(
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

// Change Collection Type Display Status
export const changeCollectionTypeDisplayStatus = async (
    id: string,
    isDisplay: boolean,
    updatedBy: string
) => {
    try {
        return await CollectionType.findOneAndUpdate(
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
