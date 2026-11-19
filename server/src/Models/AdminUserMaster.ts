import mongoose, {Schema, Document} from "mongoose";

export interface IAdminUserMaster extends Document {
    email: string;
    password: string;

    createdAt: Date;
    updatedAt: Date;

    isDeleted: boolean;
}

const AdminUserMasterSchema: Schema = new Schema(
    {
        email:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            lowercase:true
        },

        password:{
            type:String,
            required:true,
            select:false
        },

        createdAt:{
            type:String,
            default:Date.now

        },
        updatedAt:{
            type:String,
            default:Date.now
        },
        isDeleted: {
            type: Boolean,
            default: false
        }

        },

        {

        timestamps: true

        }
    
)

const AdminUserMaster = mongoose.model<IAdminUserMaster>(
    "AdminUserMaster",
    AdminUserMasterSchema
);

export default AdminUserMaster;