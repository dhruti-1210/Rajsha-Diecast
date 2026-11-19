import { NextFunction, Request, Response, Router } from "express";

import {
    CreateAdminUserMasterController,
    GetAllAdminUserMasterController,
    GetAdminUserMasterByIdController,
    UpdateAdminUserMasterController,
    DeleteAdminUserMasterController
} from "../controller/adminUserMasterController";
import {
    getAdminSessionController,
    loginAdminController,
    logoutAdminController
} from "../controller/adminAuthController";
import { adminSessionMiddleware } from "../middleware/authMiddleWare";

const router = Router();

const requireClientOrigin = (req: Request, res: Response, next: NextFunction) => {
    const clientOrigin = (
        process.env.CLIENT_URL || "http://localhost:3001"
    ).replace(/\/+$/, "");
    if (req.get("origin") !== clientOrigin) {
        return res.status(403).json({
            success: false,
            message: "Request origin is not allowed."
        });
    }
    next();
};

router.post("/login", requireClientOrigin, loginAdminController);
router.get("/session", adminSessionMiddleware, getAdminSessionController);
router.post("/logout", requireClientOrigin, logoutAdminController);

router.use(adminSessionMiddleware);

router.post("/create", CreateAdminUserMasterController);

router.get("/list", GetAllAdminUserMasterController);

router.get("/:id", GetAdminUserMasterByIdController);

router.put("/update/:id", UpdateAdminUserMasterController);

router.delete("/delete/:id", DeleteAdminUserMasterController);

export default router;