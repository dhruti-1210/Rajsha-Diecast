
import Company, { ICompany } from "../Models/BrandMaster";

// Create Company
export const CreateCompany = async (data: Partial<ICompany>) => {
    try {
        const company = new Company(data);
        return await company.save();
    } catch (error) {
        throw error;
    }
};

// Get All Companies
export const GetAllCompanies = async () => {
    try {
        return await Company.find({ isDeleted: false }).sort({ createdAt: -1 });
    } catch (error) {
        throw error;
    }
};

// Get Company By ID
export const GetCompanyById = async (id: string) => {
    try {
        return await Company.findOne({ _id: id, isDeleted: false });
    } catch (error) {
        throw error;
    }
};

// Update Company
export const UpdateCompany = async (id: string, data: Partial<ICompany>) => {
    try {
        return await Company.findOneAndUpdate(
            { _id: id, isDeleted: false },
            {
                ...data,
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        );
    } catch (error) {
        throw error;
    }
};

// Soft Delete Company
export const DeleteCompany = async (id: string, updatedBy: string) => {
    try {
        return await Company.findOneAndUpdate(
            { _id: id, isDeleted: false },
            {
                isDeleted: true,
                updatedBy,
                updatedAt: new Date()
            },
            { new: true }
        );
    } catch (error) {
        throw error;
    }
};

// Change Active Status
export const ChangeActiveStatus = async (
    id: string,
    isActive: boolean,
    updatedBy: string
) => {
    try {
        return await Company.findOneAndUpdate(
            { _id: id, isDeleted: false },
            {
                isActive,
                updatedBy,
                updatedAt: new Date()
            },
            { new: true }
        );
    } catch (error) {
        throw error;
    }
};
