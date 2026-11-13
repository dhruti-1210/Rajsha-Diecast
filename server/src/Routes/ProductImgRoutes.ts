import { Router } from "express";

import {
    CreateProductImgMasterController,
    GetAllProductImgMasterController,
    GetProductImgMasterByIdController,
    GetProductImgMasterByProductIdController,
    UpdateProductImgMasterController,
    DeleteProductImgMasterController,
    ChangeProductImgActiveStatusController
} from "../controller/ProductImgController";

const router = Router();

// Create Product Image
router.post("/create", CreateProductImgMasterController);

// Get All Product Images
router.get("/list", GetAllProductImgMasterController);

// Get Product Images By Product ID
router.get("/product/:productId", GetProductImgMasterByProductIdController);

// Get Product Image By ID
router.get("/:id", GetProductImgMasterByIdController);

// Update Product Image
router.put("/update/:id", UpdateProductImgMasterController);

// Delete Product Image
router.delete("/delete/:id", DeleteProductImgMasterController);

// Change Active Status
router.patch("/status/:id", ChangeProductImgActiveStatusController);

export default router;