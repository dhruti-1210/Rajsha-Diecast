import CompanySetup, { ICompanySetup } from "../Models/CompanySetup";

// Create Company Setup
export const CreateCompanySetup = async (
    data: Partial<ICompanySetup>
) => {
    try {
        const companySetup = await CompanySetup.create(data);
        return companySetup;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Get All Company Setup
export const GetAllCompanySetup = async () => {
    try {
        const companySetup = await CompanySetup.find({ isDeleted: { $ne: true } }).sort({
            createdAt: -1
        });

        return companySetup;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Get Company Setup By ID
export const GetCompanySetupById = async (id: string) => {
    try {
        const companySetup = await CompanySetup.findById(id);
        return companySetup;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Update Company Setup
export const UpdateCompanySetup = async (
    id: string,
    data: Partial<ICompanySetup>
) => {
    try {
        const companySetup = await CompanySetup.findByIdAndUpdate(
            id,
            {
                ...data,
                updatedAt: new Date()
            },
            {
                new: true,
                runValidators: true
            }
        );

        return companySetup;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Soft Delete Company Setup
export const DeleteCompanySetup = async (id: string) => {
    try {
        const companySetup = await CompanySetup.findByIdAndUpdate(
            id,
            { isDeleted: true, updatedAt: new Date() },
            { new: true }
        );

        return companySetup;
    } catch (error: any) {
        throw new Error(error.message);
    }
};