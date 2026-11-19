
import { Router } from "express";
import {
    CreateProductMasterController,
    GetAllProductMasterController,
    GetProductMasterByIdController,
    UpdateProductMasterController,
    DeleteProductMasterController,
    ChangeProductActiveStatusController,
    ChangeProductDisplayStatusController
} from "../controller/ProductMasterController";
import { adminSessionMiddleware } from "../middleware/authMiddleWare";

const router = Router();

router.post("/create", adminSessionMiddleware, CreateProductMasterController);
router.get("/list", GetAllProductMasterController);
router.get("/:id", GetProductMasterByIdController);
router.put("/update/:id", adminSessionMiddleware, UpdateProductMasterController);
router.delete("/delete/:id", adminSessionMiddleware, DeleteProductMasterController);
router.patch("/status/:id", adminSessionMiddleware, ChangeProductActiveStatusController);
router.patch("/display-status/:id", adminSessionMiddleware, ChangeProductDisplayStatusController);

export default router;
