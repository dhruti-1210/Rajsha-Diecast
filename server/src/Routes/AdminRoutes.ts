import { Router } from "express";

import {
    CreateAdminUserMasterController,
    GetAllAdminUserMasterController,
    GetAdminUserMasterByIdController,
    UpdateAdminUserMasterController,
    DeleteAdminUserMasterController
} from "../controller/adminUserMasterController";

const router = Router();

router.post("/create", CreateAdminUserMasterController);

router.get("/list", GetAllAdminUserMasterController);

router.get("/:id", GetAdminUserMasterByIdController);

router.put("/update/:id", UpdateAdminUserMasterController);

router.delete("/delete/:id", DeleteAdminUserMasterController);

export default router;