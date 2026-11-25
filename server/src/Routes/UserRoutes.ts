
import { NextFunction, Request, Response, Router } from "express";

import {
    createUserController,
    getAllUsersController,
    getUserByIdController,
    updateUserController,
    deleteUserController,
    changeUserStatusController
} from "../controller/UserMasterController";
import {
    getUserSessionController,
    logoutUserController,
    requestUserOtpController,
    saveUserProfileController,
    verifyUserOtpController
} from "../controller/UserAuthController";
import { adminSessionMiddleware, authMiddleware } from "../middleware/authMiddleWare";

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

router.use("/auth", (_req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    next();
});

router.post("/auth/request-otp", requireClientOrigin, requestUserOtpController);
router.post("/auth/verify-otp", requireClientOrigin, verifyUserOtpController);
router.get("/auth/session", authMiddleware, getUserSessionController);
router.post("/auth/logout", requireClientOrigin, logoutUserController);
router.put(
    "/auth/profile",
    requireClientOrigin,
    authMiddleware,
    saveUserProfileController
);

router.post("/create", createUserController);

router.get("/list", adminSessionMiddleware, getAllUsersController);

router.get("/:id", getUserByIdController);

router.put("/update/:id", updateUserController);

router.delete("/delete/:id", deleteUserController);

router.patch("/status/:id", adminSessionMiddleware, changeUserStatusController);

export default router;
