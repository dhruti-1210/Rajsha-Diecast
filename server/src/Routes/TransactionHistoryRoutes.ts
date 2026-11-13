import { Router } from "express";

import {
    CreateTransactionHistoryController,
    GetAllTransactionHistoryController,
    GetTransactionHistoryByIdController,
    UpdateTransactionHistoryController,
    DeleteTransactionHistoryController,
    ChangeTransactionActiveStatusController,
    ChangeTransactionDisplayStatusController
} from "../controller/TransactionHistoryController";

const router = Router();

// Create Transaction History
router.post("/create", CreateTransactionHistoryController);

// Get All Transaction History
router.get("/list", GetAllTransactionHistoryController);

// Get Transaction History By ID
router.get("/:id", GetTransactionHistoryByIdController);

// Update Transaction History
router.put("/update/:id", UpdateTransactionHistoryController);

// Delete Transaction History
router.delete("/delete/:id", DeleteTransactionHistoryController);

// Change Active Status
router.patch("/status/:id", ChangeTransactionActiveStatusController);

// Change Display Status
router.patch("/display-status/:id", ChangeTransactionDisplayStatusController);

export default router;