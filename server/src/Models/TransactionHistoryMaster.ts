
import mongoose, { Schema, Document } from "mongoose";

export interface ITransactionHistory extends Document {
    order_Master_id: mongoose.Types.ObjectId;
    txnAmount: number;

    user_id?: mongoose.Types.ObjectId;
    checksumHash?: string;
    transactionStatus?: string;

    requestJson?: string;
    responseJson?: string;

    initiatedAt?: Date;
    completedAt?: Date;

    callbackUrl?: string;
    gatewayName?: string;

    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;

    isActive: boolean;
    isDisplay: boolean;
    isDeleted: boolean;
}

const TransactionHistorySchema: Schema = new Schema(
    {
        order_Master_id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "OrderMaster"
        },
        txnAmount: {
            type: Number,
            required: true,
            default: 0
        },
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "userMaster"
        },
        checksumHash: {
            type: String,
            default: ""
        },
        transactionStatus: {
            type: String,
            default: "Pending"
        },
        requestJson: {
            type: Schema.Types.Mixed,
            default: null
        },
        responseJson: {
            type: Schema.Types.Mixed,
            default: null
        },
        initiatedAt: {
            type: Date
        },
        completedAt: {
            type: Date
        },
        callbackUrl: {
            type: String,
            default: ""
        },
        gatewayName: {
            type: String,
            default: ""
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        },
        createdBy: {
            type: String,
            required: true
        },
        updatedBy: {
            type: String,
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        isDisplay: {
            type: Boolean,
            default: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    }
);

const TransactionHistory = mongoose.model<ITransactionHistory>(
    "TransactionHistory",
    TransactionHistorySchema
);

export default TransactionHistory;
