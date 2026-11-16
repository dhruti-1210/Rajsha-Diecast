import mongoose, { Schema, Document } from "mongoose";

export interface ICounterMaster extends Document {
    counterTitle: string;
    counterValue: number;
    counterSuffix: string;
    counterLabel: string;
    sortOrder: number;

    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;

    isActive: boolean;
    isDisplay: boolean;
}

const CounterMasterSchema: Schema = new Schema({
    counterTitle: {
        type: String,
        required: true,
        trim: true
    },
    counterValue: {
        type: Number,
        required: true,
        min: 0
    },
    counterSuffix: {
        type: String,
        default: ""
    },
    counterLabel: {
        type: String,
        required: true,
        trim: true
    },
    sortOrder: {
        type: Number,
        default: 0
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
        default: false
    }
});

const CounterMaster = mongoose.model<ICounterMaster>(
    "CounterMaster",
    CounterMasterSchema
);

export default CounterMaster;