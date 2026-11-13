import mongoose , {Schema , Document} from "mongoose";

export interface IBudget extends Document {
    budgetPrice: string;

    createdAt: Date;
    updatedAt: Date;
    updatedBy: string;
    createdBy: string;
    isActive: boolean;
    isDeleted: boolean;
}

const BudgetSchema: Schema = new Schema(
    {
        budgetPrice: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        },
        updatedBy: {
            type: String,
            required: true
        },
        createdBy: {
            type: String,
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    }
)

const Budget = mongoose.model<IBudget>('Budget', BudgetSchema);

export default Budget;
