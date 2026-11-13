
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

const router = Router();

router.post("/create", createCollectionTypeController);

router.get("/list", getAllCollectionTypesController);

router.get("/:id", getCollectionTypeByIdController);

router.put("/update/:id", updateCollectionTypeController);

router.delete("/delete/:id", deleteCollectionTypeController);

router.patch("/status/:id", changeCollectionTypeStatusController);

router.patch(
    "/display-status/:id",
    changeCollectionTypeDisplayStatusController
);

export default router;
