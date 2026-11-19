
import { Router } from "express";
import {
   CreateBrandController,
   GetAllBrandsController,
   GetBrandByIdController,
   UpdateBrandController,
   DeleteBrandController,
  ChangeActiveStatusController
} from "../controller/BrandMasterController";
import { adminSessionMiddleware } from "../middleware/authMiddleWare";

const router = Router();

router.post("/create", adminSessionMiddleware, CreateBrandController);
router.get("/list", GetAllBrandsController);
router.get("/:id", GetBrandByIdController);
router.put("/update/:id", adminSessionMiddleware, UpdateBrandController);
router.delete("/delete/:id", adminSessionMiddleware, DeleteBrandController);
router.patch("/status/:id", adminSessionMiddleware, ChangeActiveStatusController);

export default router;
