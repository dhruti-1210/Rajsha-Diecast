import ScaleSize, { IScaleSize } from "../Models/ScaleSize";

// Create Scale Size
export const CreateScaleSize = async (
    data: Partial<IScaleSize>
) => {
    try {
        const scaleSize = await ScaleSize.create(data);
        return scaleSize;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Get All Scale Sizes
export const GetAllScaleSize = async () => {
    try {
        const scaleSizes = await ScaleSize.find({
            isDeleted: false
        }).sort({ createdAt: -1 });

        return scaleSizes;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Get Scale Size By ID
export const GetScaleSizeById = async (id: string) => {
    try {
        const scaleSize = await ScaleSize.findOne({
            _id: id,
            isDeleted: false
        });

        return scaleSize;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Update Scale Size
export const UpdateScaleSize = async (
    id: string,
    data: Partial<IScaleSize>
) => {
    try {
        const scaleSize = await ScaleSize.findOneAndUpdate(
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

        return scaleSize;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Delete Scale Size (Soft Delete)
export const DeleteScaleSize = async (
    id: string,
    updatedBy: string
) => {
    try {
        const scaleSize = await ScaleSize.findOneAndUpdate(
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

        return scaleSize;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Change Active Status
export const ChangeScaleSizeActiveStatus = async (
    id: string,
    isActive: boolean,
    updatedBy: string
) => {
    try {
        const scaleSize = await ScaleSize.findOneAndUpdate(
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

        return scaleSize;
    } catch (error: any) {
        throw new Error(error.message);
    }
};