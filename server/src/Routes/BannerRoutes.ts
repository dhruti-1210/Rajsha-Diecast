
import { Router } from "express";

import {
    createBannerController,
    getAllBannersController,
    getBannerByIdController,
    updateBannerController,
    deleteBannerController,
    changeBannerStatusController
} from "../controller/BannerMasterController";
import { adminSessionMiddleware } from "../middleware/authMiddleWare";

const router = Router();

router.post("/create", adminSessionMiddleware, createBannerController);

router.get("/list", getAllBannersController);

router.get("/:id", getBannerByIdController);

router.put("/update/:id", adminSessionMiddleware, updateBannerController);

router.delete("/delete/:id", adminSessionMiddleware, deleteBannerController);

router.patch("/status/:id", adminSessionMiddleware, changeBannerStatusController);

export default router;


