import mongoose, { Document, Schema, Model, Types } from "mongoose";
import { ReusableModel, ReusableUserModel } from "@/utils/interface";

export interface IUserAddressDocument extends ReusableModel, Document {
    userId: Types.ObjectId;
    doorNumber: string;
    contactInfo: string;
    street: string;
    village: string;
    city: string;
    state: string;
    country: string;
    pinNumber: number;
    default: Boolean; // Add this field

}

const userAddressSchema: Schema<IUserAddressDocument> = new Schema<IUserAddressDocument>({
    userId: { type: Schema.Types.ObjectId, ref: "minimumuserdata", required: true },
    doorNumber: { type: String },
    contactInfo: { type: String },
    street: { type: String },
    village: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    pinNumber: { type: Number },
    default: { type: Boolean, default: false }, // Add this field

});

let UserAddressModel: Model<IUserAddressDocument>;
try {
    UserAddressModel = mongoose.model<IUserAddressDocument>("userAddressData");
} catch (error) {
    UserAddressModel = mongoose.model<IUserAddressDocument>("userAddressData", userAddressSchema);
}

export default UserAddressModel;
