import TransactionHistory, { ITransactionHistory } from "../Models/TransactionHistoryMaster";

// Create Transaction History
export const CreateTransactionHistory = async (
    data: Partial<ITransactionHistory>
) => {
    try {
        const transaction = await TransactionHistory.create(data);
        return transaction;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Get All Transaction History
export const GetAllTransactionHistory = async () => {
    try {
        const transactions = await TransactionHistory.find({
            isDeleted: false
        })
            .populate("user_id", "name email mobile address _id")
            .populate("order_Master_id", "_id TrackingId Total PaymentStatus")
            .sort({ createdAt: -1 });

        return transactions;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Get Transaction History By ID
export const GetTransactionHistoryById = async (id: string) => {
    try {
        const transaction = await TransactionHistory.findOne({
            _id: id,
            isDeleted: false
        })
            .populate("user_id", "name email mobile address _id")
            .populate("order_Master_id", "_id TrackingId Total PaymentStatus");

        return transaction;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Update Transaction History
export const UpdateTransactionHistory = async (
    id: string,
    data: Partial<ITransactionHistory>
) => {
    try {
        const transaction = await TransactionHistory.findOneAndUpdate(
            {
                _id: id,
                isDeleted: false
            },
            {
                ...data,
                updatedAt: new Date()
            },
            {
                new: true,
                runValidators: true
            }
        );

        return transaction;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Delete Transaction History (Soft Delete)
export const DeleteTransactionHistory = async (
    id: string,
    updatedBy: string
) => {
    try {
        const transaction = await TransactionHistory.findOneAndUpdate(
            {
                _id: id,
                isDeleted: false
            },
            {
                isDeleted: true,
                updatedBy,
                updatedAt: new Date()
            },
            { new: true }
        );

        return transaction;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Change Active Status
export const ChangeTransactionActiveStatus = async (
    id: string,
    isActive: boolean,
    updatedBy: string
) => {
    try {
        const transaction = await TransactionHistory.findOneAndUpdate(
            {
                _id: id,
                isDeleted: false
            },
            {
                isActive,
                updatedBy,
                updatedAt: new Date()
            },
            { new: true }
        );

        return transaction;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Change Display Status
export const ChangeTransactionDisplayStatus = async (
    id: string,
    isDisplay: boolean,
    updatedBy: string
) => {
    try {
        const transaction = await TransactionHistory.findOneAndUpdate(
            {
                _id: id,
                isDeleted: false
            },
            {
                isDisplay,
                updatedBy,
                updatedAt: new Date()
            },
            { new: true }
        );

        return transaction;
    } catch (error: any) {
        throw new Error(error.message);
    }
};