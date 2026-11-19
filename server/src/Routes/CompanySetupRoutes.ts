import { Router } from "express";

import {
    CreateCompanySetupController,
    GetAllCompanySetupController,
    GetCompanySetupByIdController,
    UpdateCompanySetupController,
    DeleteCompanySetupController
} from "../controller/CompanySetupServices";
import { adminSessionMiddleware } from "../middleware/authMiddleWare";

const router = Router();

// Create Company Setup
router.post("/create", adminSessionMiddleware, CreateCompanySetupController);

// Get All Company Setup
router.get("/list", GetAllCompanySetupController);

// Get Company Setup By ID
router.get("/:id", GetCompanySetupByIdController);

// Update Company Setup
router.patch("/update/:id", adminSessionMiddleware, UpdateCompanySetupController);

// Delete Company Setup
router.delete("/delete/:id", adminSessionMiddleware, DeleteCompanySetupController);

export default router;