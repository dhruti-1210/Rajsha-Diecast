import Checkout, { ICheckout } from "../Models/CheckoutModel";

// Create Checkout
export const CreateCheckout = async (
    data: Partial<ICheckout>
) => {
    try {
        const checkout = await Checkout.create(data);
        return checkout;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Get All Checkout
export const GetAllCheckout = async () => {
    try {
        const checkout = await Checkout.find()
            .populate("order_Master_id")
            .sort({ createdAt: -1 });

        return checkout;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Get Checkout By ID
export const GetCheckoutById = async (id: string) => {
    try {
        const checkout = await Checkout.findById(id)
            .populate("order_Master_id");

        return checkout;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Update Checkout Status
export const UpdateCheckoutStatus = async (
    id: string,
    status: string,
    updatedBy: string
) => {
    try {
        const statusStages = [
            "isPLACED",
            "isPROCESSING",
            "isSHIPPED",
            "isTransist",
            "isDELIVERED"
        ];

        const statusIndex = statusStages.indexOf(status);

        if (statusIndex === -1) {
            throw new Error("Invalid checkout status");
        }

        const statusUpdate: any = {};

        statusStages.forEach((stage, index) => {
            statusUpdate[stage] = index <= statusIndex;
        });

        const checkout = await Checkout.findByIdAndUpdate(
            id,
            {
                ...statusUpdate,
                updatedBy,
                updatedAt: new Date()
            },
            {
                new: true,
                runValidators: true
            }
        ).populate("order_Master_id");

        return checkout;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Soft Delete Checkout
export const DeleteCheckout = async (id: string) => {
    try {
        const checkout = await Checkout.findByIdAndUpdate(
            id,
            { isDeleted: true, updatedAt: new Date() },
            { new: true }
        );
        return checkout;
    } catch (error: any) {
        throw new Error(error.message);
    }
};