import ReviewsMaster, { IReviewsMaster } from "../Models/ReviewMaster";

// Create Reviews
export const CreateReviewsMaster = async (data: Partial<IReviewsMaster>) => {
    try {
        const reviews = await ReviewsMaster.create(data);
        return reviews;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Get All Reviews
export const GetAllReviewsMaster = async () => {
    try {
        const reviews = await ReviewsMaster.find({ isDeleted: false })
            .sort({ createdAt: -1 });

        return reviews;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const GetDisplayedReviewsMaster = async () => {
    try {
        return await ReviewsMaster.find({
            isDeleted: false,
            isActive: true,
            isDisplay: true
        }).sort({ createdAt: -1 });
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const GetReviewsMasterByUserId = async (userId: string) => {
    try {
        return await ReviewsMaster.find({
            user_id: userId,
            isDeleted: false
        }).sort({ createdAt: -1 });
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Get Reviews By ID
export const GetReviewsMasterById = async (id: string) => {
    try {
        const reviews = await ReviewsMaster.findOne({
            _id: id,
            isDeleted: false
        });

        return reviews;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Update Reviews
export const UpdateReviewsMaster = async (
    id: string,
    data: Partial<IReviewsMaster>
) => {
    try {
        const reviews = await ReviewsMaster.findOneAndUpdate(
            { _id: id, isDeleted: false },
            {
                ...data,
                updatedAt: new Date()
            },
            {
                new: true,
                runValidators: true
            }
        );

        return reviews;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Delete Reviews (Soft Delete)
export const DeleteReviewsMaster = async (
    id: string,
    updatedBy: string
) => {
    try {
        const reviews = await ReviewsMaster.findOneAndUpdate(
            { _id: id, isDeleted: false },
            {
                isDeleted: true,
                updatedBy,
                updatedAt: new Date()
            },
            { new: true }
        );

        return reviews;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Change Active Status
export const ChangeReviewsActiveStatus = async (
    id: string,
    isActive: boolean,
    updatedBy: string
) => {
    try {
        const reviews = await ReviewsMaster.findOneAndUpdate(
            { _id: id, isDeleted: false },
            {
                isActive,
                updatedBy,
                updatedAt: new Date()
            },
            { new: true }
        );

        return reviews;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Change Display Status
export const ChangeReviewsDisplayStatus = async (
    id: string,
    isDisplay: boolean,
    updatedBy: string
) => {
    try {
        const reviews = await ReviewsMaster.findOneAndUpdate(
            { _id: id, isDeleted: false },
            {
                isDisplay,
                updatedBy,
                updatedAt: new Date()
            },
            { new: true }
        );

        return reviews;
    } catch (error: any) {
        throw new Error(error.message);
    }
};