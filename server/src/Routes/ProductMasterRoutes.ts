
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

const router = Router();

router.post("/create", CreateProductMasterController);
router.get("/list", GetAllProductMasterController);
router.get("/:id", GetProductMasterByIdController);
router.put("/update/:id", UpdateProductMasterController);
router.delete("/delete/:id", DeleteProductMasterController);
router.patch("/status/:id", ChangeProductActiveStatusController);
router.patch("/display-status/:id", ChangeProductDisplayStatusController);

export default router;
