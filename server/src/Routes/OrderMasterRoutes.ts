
import { Router } from "express";
import {
    CreateOrderMasterController,
    GetAllOrderMasterController,
    GetOrderMasterByIdController,
    UpdateOrderMasterController,
    DeleteOrderMasterController,
    ChangeOrderActiveStatusController,
    ChangeOrderDisplayStatusController
} from "../controller/OrderMasterController";

const router = Router();

router.post("/create", CreateOrderMasterController);
router.get("/list", GetAllOrderMasterController);
router.get("/:id", GetOrderMasterByIdController);
router.put("/update/:id", UpdateOrderMasterController);
router.delete("/delete/:id", DeleteOrderMasterController);
router.patch("/status/:id", ChangeOrderActiveStatusController);
router.patch("/display-status/:id", ChangeOrderDisplayStatusController);

export default router;
