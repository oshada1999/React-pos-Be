import * as mongoose from "mongoose";
import * as SchemaType from "../types/SchemaTypes";

const userSchema = new mongoose.Schema<SchemaType.UserInterface>({
    username:{type:String, required:true},
    fullName:{type:String, required:true},
    email:{type:String, required:true},
    phoneNumber:{type:Number, required:true},
    password:{type:String, required:true},
    role:{type:String, required:true},
    proPic:{type:String, required:true}
})

const UserModel = mongoose.model('user', userSchema);
export default UserModel;