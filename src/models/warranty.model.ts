import mongoose from "mongoose";
import {WarrantyInterface} from "../types/SchemaTypes"

let warrantySchema = new mongoose.Schema<WarrantyInterface>({
    itemId:{type: String, required: true},
    orderId:{type: String, required: true},
    description:{type: String, required: true},
    startDate:{type: Date, required: true, default: Date.now()},
    expireDate:{type: Date, required: true},
});

const WarrantyModel = mongoose.model('warranty',warrantySchema);
export default WarrantyModel;