
import UserMaster, { IUserMaster } from "../Models/userMaster";

const userAuthFields: (keyof IUserMaster)[] = [
    "emailVerified",
    "otpHash",
    "otpExpiresAt",
    "otpResendAvailableAt",
    "otpAttempts",
    "authSessionTokenHash",
    "authSessionExpiresAt"
];

const withoutAuthFields = (data: Partial<IUserMaster>) => {
    const safeData = { ...data };
    for (const field of userAuthFields) {
        delete safeData[field];
    }
    return safeData;
};

// Create User
export const createUser = async (data: Partial<IUserMaster>) => {
    try {
        const user = new UserMaster(withoutAuthFields(data));
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
        })
            .select("-password -otpHash -otpExpiresAt -otpResendAvailableAt -otpAttempts -authSessionTokenHash -authSessionExpiresAt")
            .sort({ createdAt: -1 });
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
        const emailChanged = data.email !== undefined;
        const invalidateAuth = emailChanged || data.isActive === false || data.isDeleted === true;
        return await UserMaster.findOneAndUpdate(
            {
                _id: id,
                isDeleted: false
            },
            {
                $set: {
                    ...withoutAuthFields(data),
                    ...(emailChanged ? { emailVerified: false } : {}),
                    updatedAt: new Date()
                },
                ...(invalidateAuth
                    ? {
                        $unset: {
                            authSessionTokenHash: 1,
                            authSessionExpiresAt: 1,
                            otpHash: 1,
                            otpExpiresAt: 1,
                            otpResendAvailableAt: 1,
                            otpAttempts: 1
                        }
                    }
                    : {})
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
                $set: {
                    isDeleted: true,
                    updatedBy,
                    updatedAt: new Date()
                },
                $unset: {
                    authSessionTokenHash: 1,
                    authSessionExpiresAt: 1,
                    otpHash: 1,
                    otpExpiresAt: 1,
                    otpResendAvailableAt: 1,
                    otpAttempts: 1
                }
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
                $set: {
                    isActive,
                    updatedBy,
                    updatedAt: new Date()
                },
                ...(!isActive
                    ? {
                        $unset: {
                            authSessionTokenHash: 1,
                            authSessionExpiresAt: 1,
                            otpHash: 1,
                            otpExpiresAt: 1,
                            otpResendAvailableAt: 1,
                            otpAttempts: 1
                        }
                    }
                    : {})
            },
            {
                new: true
            }
        );
    } catch (error) {
        throw error;
    }
};
