import { Router } from "express";
import { createBudgetController, getAllBudgetsController, getBudgetByIdController, updateBudgetController, deleteBudgetController, changeBudgetStatusController } from "../controller/BudgetMasterController";
import { adminSessionMiddleware } from "../middleware/authMiddleWare";

const router = Router();

router.post("/create", adminSessionMiddleware, createBudgetController);
router.get("/list", getAllBudgetsController);
router.get("/:id", getBudgetByIdController);
router.put("/update/:id", adminSessionMiddleware, updateBudgetController);
router.delete("/delete/:id", adminSessionMiddleware, deleteBudgetController);
router.patch("/status/:id", adminSessionMiddleware, changeBudgetStatusController);

export default router;
