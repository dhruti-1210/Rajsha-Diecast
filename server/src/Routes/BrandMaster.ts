
import { Router } from "express";
import {
   CreateBrandController,
   GetAllBrandsController,
   GetBrandByIdController,
   UpdateBrandController,
   DeleteBrandController,
  ChangeActiveStatusController
} from "../controller/BrandMasterController";

const router = Router();

router.post("/create", CreateBrandController);
router.get("/list", GetAllBrandsController);
router.get("/:id", GetBrandByIdController);
router.put("/update/:id", UpdateBrandController);
router.delete("/delete/:id", DeleteBrandController);
router.patch("/status/:id", ChangeActiveStatusController);

export default router;
