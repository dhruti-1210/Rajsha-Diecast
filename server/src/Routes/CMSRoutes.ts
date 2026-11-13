
import { Router } from "express";

import {
    createCmsController,
    getAllCmsController,
    getCmsByIdController,
    updateCmsController,
    deleteCmsController,
    changeCmsStatusController,
    changeCmsDisplayStatusController
} from "../controller/CMSMasterController";

const router = Router();

router.post("/create", createCmsController);

router.get("/list", getAllCmsController);

router.get("/:id", getCmsByIdController);

router.put("/update/:id", updateCmsController);

router.delete("/delete/:id", deleteCmsController);

router.patch("/status/:id", changeCmsStatusController);

router.patch("/display-status/:id", changeCmsDisplayStatusController);

export default router;
