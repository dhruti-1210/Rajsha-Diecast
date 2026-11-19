
import { Router } from "express";
import {
    CreatePackagingTypeController,
    GetAllPackagingTypesController,
    GetPackagingTypeByIdController,
    UpdatePackagingTypeController,
    DeletePackagingTypeController,
    ChangePackagingTypeActiveStatusController
} from "../controller/PackagingTypeController";
import { adminSessionMiddleware } from "../middleware/authMiddleWare";

const router = Router();

router.post("/create", adminSessionMiddleware, CreatePackagingTypeController);
router.get("/list", GetAllPackagingTypesController);
router.get("/:id", GetPackagingTypeByIdController);
router.put("/update/:id", adminSessionMiddleware, UpdatePackagingTypeController);
router.delete("/delete/:id", adminSessionMiddleware, DeletePackagingTypeController);
router.patch("/status/:id", adminSessionMiddleware, ChangePackagingTypeActiveStatusController);

export default router;
