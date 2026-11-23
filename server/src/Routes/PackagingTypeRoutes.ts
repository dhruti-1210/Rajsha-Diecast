import { Router } from "express";
import {
    createPackagingTypeController,
    getAllPackagingTypesController,
    getPackagingTypeByIdController,
    updatePackagingTypeController,
    deletePackagingTypeController,
    changePackagingTypeStatusController
} from "../controller/PackagingTypeController";
import { adminSessionMiddleware } from "../middleware/authMiddleWare";

const router = Router();

router.post("/create", adminSessionMiddleware, createPackagingTypeController);
router.get("/list", getAllPackagingTypesController);
router.get("/:id", getPackagingTypeByIdController);
router.put("/update/:id", adminSessionMiddleware, updatePackagingTypeController);
router.delete("/delete/:id", adminSessionMiddleware, deletePackagingTypeController);
router.patch("/status/:id", adminSessionMiddleware, changePackagingTypeStatusController);

export default router;
