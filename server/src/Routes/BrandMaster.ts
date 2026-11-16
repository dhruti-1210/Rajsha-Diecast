
import { Router } from "express";
import {
    CreateCompanyController,
    GetAllCompaniesController,
    GetCompanyByIdController,
    UpdateCompanyController,
    DeleteCompanyController,
    ChangeActiveStatusController
} from "../controller/BrandMasterController";

const router = Router();

router.post("/create", CreateCompanyController);
router.get("/list", GetAllCompaniesController);
router.get("/:id", GetCompanyByIdController);
router.put("/update/:id", UpdateCompanyController);
router.delete("/delete/:id", DeleteCompanyController);
router.patch("/status/:id", ChangeActiveStatusController);

export default router;
