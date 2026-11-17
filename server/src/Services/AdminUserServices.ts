import { hash } from "bcryptjs";
import AdminUserMaster from "../Models/AdminUserMaster";
// Create Admin User
export const CreateAdminUserMaster = async (data: any) => {
    try {
        const hashedPassword = await hash(data.password, 10);

        const adminUser = await AdminUserMaster.create({
            ...data,
            password: hashedPassword
        });

        const { password, ...safeAdminUser } = adminUser.toObject();

        return safeAdminUser;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Get All Admin Users
export const GetAllAdminUserMaster = async () => {
    try {
        const adminUsers = await AdminUserMaster.find({
            isDeleted: false
        })
            .select("-password")
            .sort({ createdAt: -1 });

        return adminUsers;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Get Admin User By ID
export const GetAdminUserMasterById = async (id: string) => {
    try {
        const adminUser = await AdminUserMaster.findOne({
            _id: id,
            isDeleted: false
        }).select("-password");

        return adminUser;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Update Admin User
export const UpdateAdminUserMaster = async (
    id: string,
    data: any
) => {
    try {
        const updateData = { ...data };

        if (updateData.password) {
            updateData.password = await hash(updateData.password, 10);
        } else {
            delete updateData.password;
        }

        const adminUser = await AdminUserMaster.findByIdAndUpdate(
            {
                _id: id,
                isDeleted: false
            },
            {
                ...updateData,
                updatedAt: new Date()
            },
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        return adminUser;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Soft Delete Admin User
export const DeleteAdminUserMaster = async (id: string) => {
    try {
        const adminUser = await AdminUserMaster.findOneAndUpdate(
            { _id: id, isDeleted: false },
            {
                isDeleted: true,
                updatedAt: new Date()
            },
            { new: true }
        ).select("-password");

        return adminUser;
    } catch (error: any) {
        throw new Error(error.message);
    }
};