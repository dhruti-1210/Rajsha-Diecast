import { Router } from "express";

import {
    CreateCartController,
    GetAllCartController,
    GetCartByIdController,
    UpdateCartController,
    DeleteCartController
} from "../controller/CartController";
import { authMiddleware } from "../middleware/authMiddleWare";

const router = Router();

router.use(authMiddleware);

// Create Cart
router.post("/create", CreateCartController);

// Get All Cart
router.get("/list", GetAllCartController);

// Get Cart By ID
router.get("/:id", GetCartByIdController);

// Update Cart
router.put("/update/:id", UpdateCartController);

// Delete Cart
router.delete("/delete/:id", DeleteCartController);

export default router;