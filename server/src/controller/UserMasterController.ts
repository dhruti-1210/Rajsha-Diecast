
import { Request, Response } from "express";

import {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    changeUserStatus
} from "../Services/UserMasterServices";

// Create User
export const createUserController = async (
    req: Request,
    res: Response
) => {
    try {
        const user = await createUser(req.body);

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Users
export const getAllUsersController = async (
    req: Request,
    res: Response
) => {
    try {
        const users = await getAllUsers();

        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: users
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get User By ID
export const getUserByIdController = async (
    req: Request,
    res: Response
) => {
    try {
        const user = await getUserById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: user
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update User
export const updateUserController = async (
    req: Request,
    res: Response
) => {
    try {
        const user = await updateUser(
            req.params.id,
            req.body
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//Soft Delete User
export const deleteUserController = async (
    req: Request,
    res: Response
) => {
    try {
        const { updatedBy } = req.body;

        const user = await deleteUser(
            req.params.id,
            updatedBy
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: user
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Change User Status
export const changeUserStatusController = async (
    req: Request,
    res: Response
) => {
    try {
        const { isActive, updatedBy } = req.body;

        const user = await changeUserStatus(
            req.params.id,
            isActive,
            updatedBy
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User status changed successfully",
            data: user
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
