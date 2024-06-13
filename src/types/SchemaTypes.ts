import * as mongoose from "mongoose";

export interface UserInterface extends mongoose.Document{
    username: string,
    fullName: string,
    email: string,
    phoneNumber: number,
    password: string,
    role: string,
    proPic: string
}


export interface ItemInterface extends mongoose.Document{
    code: string,
    name:string,
    description: string,
    category: string,
    brand: string,
    regularPrice: number,
    salePrice: number,
    qty: number;
    warranty: string,
    stockStatus: boolean
    itemPic: string
}

export interface WarrantyInterface extends mongoose.Document{
    itemId: string,
    orderId: string,
    description: string,
    startDate: Date,
    expireDate: Date
}

export interface CustomerInterface {
    nic:string,
    fullName:string,
    email:string,
    phoneNumber:number
}

export interface LogInDetailInterface {
    username:string,
    role:string,
    logInDate:Date,
    logOutDate:Date
}

export interface OrderDetailsInterface{
    itemId:string,
    qty:number,
    unitPrice:number
    amount:number
}

export interface OrderInterface {
    date:Date,
    totalQty:number,
    totalAmount:number,
    customerId:string,
    orderDetails:OrderDetailsInterface[]
}

export interface BrandInterface {
    name:string,
    category:string[]
    image:string
}

export interface TestImageInterface {
    image:string
}
