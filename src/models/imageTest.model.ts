import mongoose from "mongoose";
import {TestImageInterface} from "../types/SchemaTypes";


let imageSchema = new mongoose.Schema<TestImageInterface>({
    image:{type:String,required:true}
});

let ImageModel = mongoose.model('image',imageSchema);
export default ImageModel