import { Router } from "express";

import {
    CreateCompanySetupController,
    GetAllCompanySetupController,
    GetCompanySetupByIdController,
    UpdateCompanySetupController,
    DeleteCompanySetupController
} from "../controller/CompanySetupServices";

const router = Router();

// Create Company Setup
router.post("/create", CreateCompanySetupController);

// Get All Company Setup
router.get("/list", GetAllCompanySetupController);

// Get Company Setup By ID
router.get("/:id", GetCompanySetupByIdController);

// Update Company Setup
router.patch("/update/:id", UpdateCompanySetupController);

// Delete Company Setup
router.delete("/delete/:id", DeleteCompanySetupController);

export default router;