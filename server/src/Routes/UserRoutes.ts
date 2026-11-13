
import { Router } from "express";

import {
    createUserController,
    getAllUsersController,
    getUserByIdController,
    updateUserController,
    deleteUserController,
    changeUserStatusController
} from "../controller/UserMasterController";

const router = Router();

router.post("/create", createUserController);

router.get("/list", getAllUsersController);

router.get("/:id", getUserByIdController);

router.put("/update/:id", updateUserController);

router.delete("/delete/:id", deleteUserController);

router.patch("/status/:id", changeUserStatusController);

export default router;
