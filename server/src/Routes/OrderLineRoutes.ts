
import { Router } from "express";
import {
    CreateOrderLineMasterController,
    GetAllOrderLineMasterController,
    GetOrderLineMasterByIdController,
    UpdateOrderLineMasterController,
    DeleteOrderLineMasterController,
    ChangeOrderLineActiveStatusController,
    ChangeOrderLineDisplayStatusController
} from "../controller/OrderLineController";

const router = Router();

router.post("/create", CreateOrderLineMasterController);
router.get("/list", GetAllOrderLineMasterController);
router.get("/:id", GetOrderLineMasterByIdController);
router.put("/update/:id", UpdateOrderLineMasterController);
router.delete("/delete/:id", DeleteOrderLineMasterController);
router.patch("/status/:id", ChangeOrderLineActiveStatusController);
router.patch("/display-status/:id", ChangeOrderLineDisplayStatusController);

export default router;
