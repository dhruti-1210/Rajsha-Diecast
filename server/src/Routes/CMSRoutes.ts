
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
import { adminSessionMiddleware } from "../middleware/authMiddleWare";

const router = Router();

router.post("/create", adminSessionMiddleware, createCmsController);

router.get("/list", getAllCmsController);

router.get("/:id", getCmsByIdController);

router.put("/update/:id", adminSessionMiddleware, updateCmsController);

router.delete("/delete/:id", adminSessionMiddleware, deleteCmsController);

router.patch("/status/:id", adminSessionMiddleware, changeCmsStatusController);

router.patch("/display-status/:id", adminSessionMiddleware, changeCmsDisplayStatusController);

export default router;
