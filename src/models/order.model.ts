import mongoose from "mongoose";
import {OrderDetailsInterface, OrderInterface} from "../types/SchemaTypes";

let orderDetailSchema = new mongoose.Schema<OrderDetailsInterface>({
    itemId:{type: String, required: true},
    qty:{type: Number, required: true},
    unitPrice:{type: Number, required:true},
    amount:{type: Number, required: true}
});

let orderSchema = new mongoose.Schema<OrderInterface>({
    date:{type: Date, required:true},
    totalQty:{type: Number, required:true},
    totalAmount:{type: Number, required:true},
    customerId:{type: String, required:true},
    orderDetails:{type:[orderDetailSchema]}
});

let OrderModel = mongoose.model('order',orderSchema);
export default OrderModel;