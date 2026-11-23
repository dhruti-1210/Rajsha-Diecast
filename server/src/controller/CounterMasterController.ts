import { Request, Response } from "express";
import { GetCounterMaster } from "../Services/CounterMasterServices";
import { sendError, sendSuccess } from "../utils/http";

export const GetCounterMasterController = async (_req: Request, res: Response) => {
    try {
        const counters = await GetCounterMaster();
        return sendSuccess(res, 200, "Counters fetched successfully", counters);
    } catch (error) {
        return sendError(res, error);
    }
};
