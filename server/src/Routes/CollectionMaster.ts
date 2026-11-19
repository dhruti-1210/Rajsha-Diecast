
import { Router } from "express";

import {
    createCollectionTypeController,
    getAllCollectionTypesController,
    getCollectionTypeByIdController,
    updateCollectionTypeController,
    deleteCollectionTypeController,
    changeCollectionTypeStatusController,
    changeCollectionTypeDisplayStatusController
} from "../controller/CollectionMasterController";
import { adminSessionMiddleware } from "../middleware/authMiddleWare";

const router = Router();

router.post("/create", adminSessionMiddleware, createCollectionTypeController);

router.get("/list", getAllCollectionTypesController);

router.get("/:id", getCollectionTypeByIdController);

router.put("/update/:id", adminSessionMiddleware, updateCollectionTypeController);

router.delete("/delete/:id", adminSessionMiddleware, deleteCollectionTypeController);

router.patch("/status/:id", adminSessionMiddleware, changeCollectionTypeStatusController);

router.patch(
    "/display-status/:id",
    adminSessionMiddleware,
    changeCollectionTypeDisplayStatusController
);

export default router;
