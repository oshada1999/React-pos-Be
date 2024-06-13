import * as mongoose from "mongoose";
import * as SchemaTypes from "../types/SchemaTypes";

const itemSchema = new mongoose.Schema<SchemaTypes.ItemInterface>({
    code:{type:String, required:true},
    name:{type:String, required:true},
    description:{type:String, required:true},
    category:{type:String, required:true},
    brand:{type:String, required:true},
    regularPrice:{type:Number, required:true},
    salePrice:{type:Number, required:true},
    qty:{type:Number, required:true},
    warranty:{type:String, required:true},
    stockStatus:{type:Boolean, required:true},
    itemPic:{type:String, required:true}
})

const ItemModel = mongoose.model('item',itemSchema);
export default ItemModel;