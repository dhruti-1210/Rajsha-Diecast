
import { Router } from "express";
import {
    CreatePackagingTypeController,
    GetAllPackagingTypesController,
    GetPackagingTypeByIdController,
    UpdatePackagingTypeController,
    DeletePackagingTypeController,
    ChangePackagingTypeActiveStatusController
} from "../controller/PackagingTypeController";

const router = Router();

router.post("/create", CreatePackagingTypeController);
router.get("/list", GetAllPackagingTypesController);
router.get("/:id", GetPackagingTypeByIdController);
router.put("/update/:id", UpdatePackagingTypeController);
router.delete("/delete/:id", DeletePackagingTypeController);
router.patch("/status/:id", ChangePackagingTypeActiveStatusController);

export default router;
