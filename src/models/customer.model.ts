import mongoose from "mongoose";
import {CustomerInterface} from "../types/SchemaTypes";


let customerSchema = new mongoose.Schema<CustomerInterface>({
    nic:{type:String, required:true},
    fullName:{type:String, required:true},
    email:{type:String, required:true},
    phoneNumber:{type:Number, required:true},
});

let CustomerModel = mongoose.model('customer',customerSchema);
export default CustomerModel;