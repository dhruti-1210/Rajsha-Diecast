
import Budget, { IBudget } from "../Models/BudgetMaster";

// Create Budget
export const createBudget = async (data: Partial<IBudget>) => {
    try {
        const budget = new Budget(data);
        return await budget.save();
    } catch (error) {
        throw error;
    }
};

// Get All Budgets
export const getAllBudgets = async () => {
    try {
        return await Budget.find({
            isDeleted: false
        }).sort({ createdAt: -1 });
    } catch (error) {
        throw error;
    }
};

// Get Budget By ID
export const getBudgetById = async (id: string) => {
    try {
        return await Budget.findOne({
            _id: id,
            isDeleted: false
        });
    } catch (error) {
        throw error;
    }
};

// Update Budget
export const updateBudget = async (
    id: string,
    data: Partial<IBudget>
) => {
    try {
        return await Budget.findOneAndUpdate(
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
    } catch (error) {
        throw error;
    }
};

// Soft Delete Budget
export const deleteBudget = async (
    id: string,
    updatedBy: string
) => {
    try {
        return await Budget.findOneAndUpdate(
            {
                _id: id,
                isDeleted: false
            },
            {
                isDeleted: true,
                updatedBy,
                updatedAt: new Date()
            },
            {
                new: true
            }
        );
    } catch (error) {
        throw error;
    }
};

// Change Budget Status
export const changeBudgetStatus = async (
    id: string,
    isActive: boolean,
    updatedBy: string
) => {
    try {
        return await Budget.findOneAndUpdate(
            {
                _id: id,
                isDeleted: false
            },
            {
                isActive,
                updatedBy,
                updatedAt: new Date()
            },
            {
                new: true
            }
        );
    } catch (error) {
        throw error;
    }
};
