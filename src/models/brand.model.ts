import * as mongoose from "mongoose";
import * as SchemaType from "../types/SchemaTypes";

let brandSchema =
    new mongoose.Schema<SchemaType.BrandInterface>({
    name:{type:String, required:true},
    category:{type:[String], required:true},
    image:{type:String, required:true}
});

let BrandModel = mongoose.model('brand',brandSchema);
export default BrandModel;