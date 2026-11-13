
import { Router } from "express";

import {
    createBudgetController,
    getAllBudgetsController,
    getBudgetByIdController,
    updateBudgetController,
    deleteBudgetController,
    changeBudgetStatusController
} from "../controller/BudgetMasterController";

const router = Router();

router.post("/create", createBudgetController);

router.get("/list", getAllBudgetsController);

router.get("/:id", getBudgetByIdController);

router.put("/update/:id", updateBudgetController);

router.delete("/delete/:id", deleteBudgetController);

router.patch("/status/:id", changeBudgetStatusController);

export default router;
