import { Request, Response } from "express";
import { GetCounterMaster } from "../Services/CounterMasterServices";

export const GetCounterMasterController = async (_req: Request, res: Response) => {
    try {
        const counters = await GetCounterMaster();
        return res.status(200).json({
            success: true,
            message: "Counters fetched successfully",
            data: counters
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
