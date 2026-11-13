
import UserMaster, { IUserMaster } from "../Models/userMaster";

// Create User
export const createUser = async (data: Partial<IUserMaster>) => {
    try {
        const user = new UserMaster(data);
        return await user.save();
    } catch (error) {
        throw error;
    }
};

// Get All Users
export const getAllUsers = async () => {
    try {
        return await UserMaster.find({
            isDeleted: false
        }).sort({ createdAt: -1 });
    } catch (error) {
        throw error;
    }
};

// Get User By ID
export const getUserById = async (id: string) => {
    try {
        return await UserMaster.findOne({
            _id: id,
            isDeleted: false
        });
    } catch (error) {
        throw error;
    }
};

// Update User
export const updateUser = async (
    id: string,
    data: Partial<IUserMaster>
) => {
    try {
        return await UserMaster.findOneAndUpdate(
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

// Soft Delete User
export const deleteUser = async (
    id: string,
    updatedBy: string
) => {
    try {
        return await UserMaster.findOneAndUpdate(
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

// Change User Status
export const changeUserStatus = async (
    id: string,
    isActive: boolean,
    updatedBy: string
) => {
    try {
        return await UserMaster.findOneAndUpdate(
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
