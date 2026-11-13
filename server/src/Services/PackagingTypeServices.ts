
import PackagingType, { IPackagingType } from "../Models/PackagingTypeMaster";

// Create Packaging Type
export const CreatePackagingType = async (data: Partial<IPackagingType>) => {
    try {
        const packagingType = new PackagingType(data);
        return await packagingType.save();
    } catch (error) {
        throw error;
    }
};

// Get All Packaging Types
export const GetAllPackagingTypes = async () => {
    try {
        return await PackagingType.find({ isDeleted: false }).sort({ createdAt: -1 });
    } catch (error) {
        throw error;
    }
};

// Get Packaging Type By ID
export const GetPackagingTypeById = async (id: string) => {
    try {
        return await PackagingType.findOne({
            _id: id,
            isDeleted: false
        });
    } catch (error) {
        throw error;
    }
};

// Update Packaging Type
export const UpdatePackagingType = async (
    id: string,
    data: Partial<IPackagingType>
) => {
    try {
        return await PackagingType.findOneAndUpdate(
            { _id: id, isDeleted: false },
            {
                ...data,
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        );
    } catch (error) {
        throw error;
    }
};

// Soft Delete Packaging Type
export const DeletePackagingType = async (id: string, updatedBy: string) => {
    try {
        return await PackagingType.findOneAndUpdate(
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
export const ChangePackagingTypeActiveStatus = async (
    id: string,
    isActive: boolean,
    updatedBy: string
) => {
    try {
        return await PackagingType.findOneAndUpdate(
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
