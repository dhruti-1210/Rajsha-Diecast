import { Router } from "express";
import { GetCounterMasterController } from "../controller/CounterMasterController";

const router = Router();

router.get("/list", GetCounterMasterController);

export default router;
