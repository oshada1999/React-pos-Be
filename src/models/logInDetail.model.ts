import mongoose from "mongoose";
import {LogInDetailInterface} from "../types/SchemaTypes";

let logInDetailSchema = new mongoose.Schema<LogInDetailInterface>({
    username:{type: String, required:true},
    role:{type: String, required:true},
    logInDate:{type: Date, required:true},
    logOutDate:{type: Date, required:false}
});

let LogInDetailModel = mongoose.model('logInDetail',logInDetailSchema);
export default LogInDetailModel;