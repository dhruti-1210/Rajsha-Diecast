
import { Router } from "express";

import {
    createBannerController,
    getAllBannersController,
    getBannerByIdController,
    updateBannerController,
    deleteBannerController,
    changeBannerStatusController
} from "../controller/BannerMasterController";

const router = Router();

router.post("/create", createBannerController);

router.get("/list", getAllBannersController);

router.get("/:id", getBannerByIdController);

router.put("/update/:id", updateBannerController);

router.delete("/delete/:id", deleteBannerController);

router.patch("/status/:id", changeBannerStatusController);

export default router;


