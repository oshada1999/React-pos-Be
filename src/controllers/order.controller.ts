import express from "express";
import {CustomResponse} from "../dtos/custom.response";
import OrderModel from "../models/order.model";
import {ItemInterface, OrderDetailsInterface} from "../types/SchemaTypes";
import ItemModel from "../models/item.model";
import {db} from "../index";
import {MongoClient} from 'mongodb'
import process from "process";


export const createOrder =  async (req :express.Request, res :any) => {

    const transactionOptions = {
        readConcern: { level: 'snapshot' },
        writeConcern: { w: 'majority' },
        readPreference: 'primary'
    };

    // const uri = 'mongodb://localhost:27017';
    const client = new MongoClient(process.env.MONGO_URL as string);

    await client.connect();
    const session = client.startSession();

    try {
        session.startTransaction();
        const itemsCollection = client.db('nextGenIt').collection('orders');


        //-------------------- update items -----------------------------------------------------------------

        let orderDetails: OrderDetailsInterface[] = req.body.orderDetails;


        for (let item of orderDetails){

            console.log("item : "+item.itemId)

            let item_by_id =
                await itemsCollection.findOne({code:item.itemId},{session});

            // @ts-ignore// let item_by_id = await ItemModel.findOne({code:item.itemId}).session(session).exec()

            console.log("item_by_id : "+item_by_id);

            if (item_by_id) {
                // let qty_On_hand :number = item_by_id.qty;
                // let qty_in_order:number = item.qty;
                let update_qty :number = (item_by_id.qty - item.qty);

                console.log(item_by_id.qty)
                console.log(item.qty)

                await itemsCollection.updateOne(
                    {code:item.itemId},
                    {$set:{qty:update_qty}},
                    {session}
                )

                // // @ts-ignore
                // await ItemModel.findByIdAndUpdate({_id:item_by_id._id}, {$set:{qty:update_qty}}).session(session).exec()

            }else {
                // await session.abortTransaction();
                // res.status(500).send(
                //     new CustomResponse(500,`Error : Something wrong with item`)
                // )
                throw new Error(`Error : Something wrong with item`)
            }
        }

        //-------------------- update items -----------------------------------------------------------------

        const ordersCollection = client.db('nextGenIt').collection('orders');

        // let orderModel = new OrderModel({
        //     date:req.body.date,
        //     totalQty:req.body.totalQty,
        //     totalAmount:req.body.totalAmount,
        //     customerId:req.body.customerId,
        //     orderDetails:req.body.orderDetails
        // });
        //
        // let newVar = await orderModel.save();

        let insertOne = await ordersCollection.insertOne({
            date:req.body.date,
            totalQty:req.body.totalQty,
            totalAmount:req.body.totalAmount,
            customerId:req.body.customerId,
            orderDetails:req.body.orderDetails
        },{session});



        if (insertOne) {
            await session.commitTransaction();
            res.status(200).send(
                new CustomResponse(200,`hari`)
            )
        }else {
            res.status(500).send(
                new CustomResponse(500,`wade kela una`)
            )
        }


    }catch(e){
        console.log(e)
        res.status(500).send(
            new CustomResponse(500,`wade kela una : ${e}`)
        )
        await session.abortTransaction();

    }finally {
        await session.endSession();
    }






    // try {
    //
    //     let orderDetails: OrderDetailsInterface[] = req.body.orderDetails;
    //
    //     console.log(orderDetails)
    //     // console.log(orderDetails[1])
    //
    //
    //     for (let item of orderDetails){
    //
    //         console.log("item : "+item.itemId)
    //
    //         // @ts-ignore
    //         let item_by_id : ItemInterface | null = await ItemModel.find({_id:item.itemId});
    //
    //         console.log("item_by_id : "+item_by_id)
    //
    //         if (item_by_id) {
    //             let qty_On_hand :number = item_by_id.qty;
    //             let qty_in_order:number = item.qty;
    //             let update_qty :number = Math.ceil(qty_On_hand - qty_in_order);
    //
    //             console.log(typeof update_qty)
    //
    //             await ItemModel.updateOne(
    //                 {_id:item.itemId},
    //                 {
    //                     description:item_by_id.description,
    //                     category:item_by_id.category,
    //                     brand:item_by_id.brand,
    //                     price:item_by_id.price,
    //                     qty:update_qty,
    //                     warranty:item_by_id.warranty,
    //                     itemPic:item_by_id.itemPic
    //                 }
    //             )
    //         }
    //     }
    //
    //     let orderModel = new OrderModel({
    //         date:req.body.date,
    //         totalQty:req.body.totalQty,
    //         totalAmount:req.body.totalAmount,
    //         customerId:req.body.customerId,
    //         orderDetails:req.body.orderDetails
    //     });
    //
    //     let newVar = await orderModel.save();
    //
    //     if (newVar) {
    //         res.status(200).send(
    //             new CustomResponse(200,`hari`)
    //         )
    //     }else {
    //         res.status(500).send(
    //             new CustomResponse(200,`wade kela una`)
    //         )
    //     }
    //
    //
    // } catch (error) {
    //     res.status(500).send(
    //         new CustomResponse(500,`Error : ${error}`)
    //     )
    // }
}

export const updateOrder = async (req :express.Request, res :any) => {
    try {

    }catch (error) {
        res.status(500).send(
            new CustomResponse(500,`Error : ${error}`)
        )
    }
}

export const deleteOrder = async (req :express.Request, res :any) => {
    try {
        let query:any = req.query;
        let orderId :string = query.order;

        let order_by_id = await OrderModel.findOne({_id:orderId});

        if (order_by_id){
            await OrderModel.deleteOne({_id:orderId}).then(success => {
                res.status(200).send(
                    new CustomResponse(200,"Order deleted successfully")
                );
            }).catch(error => {
                res.status(500).send(
                    new CustomResponse(500,`Error : ${error}`)
                )
            })
        }else {
            res.status(404).send(
                new CustomResponse(404,`Order not found!!!`)
            )
        }

    }catch (error) {
        res.status(500).send(
            new CustomResponse(500,`Error : ${error}`)
        )
    }
}

export const getAllOrders = async (req :express.Request, res :any) => {
    try {

        let query:any = req.query;
        let size :number = query.size;
        let page :number = query.page;

        let documentCount: number = await OrderModel.countDocuments();
        let totalPages :number = Math.ceil(documentCount / size);

        let order_list = await OrderModel.find().limit(size).skip(size * (page - 1));

        res.status(200).send(
            new CustomResponse(200,"Order found successfully",order_list,totalPages)
        )

    }catch (error) {
        res.status(500).send(
            new CustomResponse(500,`Error : ${error}`)
        )
    }
}

export const getOrderById = async (req :express.Request, res :any) => {
    try {

        let query:any = req.query;
        let orderId :string = query.order;

        let order_by_id = await OrderModel.findOne({_id:orderId});

        if (order_by_id){
            res.status(200).send(
                new CustomResponse(200,"Order found successfully",order_by_id)
            );
        }else {
            res.status(404).send(
                new CustomResponse(404,`Order not found!!!`)
            )
        }

    }catch (error) {
        res.status(500).send(
            new CustomResponse(500,`Error : ${error}`)
        )
    }
}

const isExitsOrder = async (orderId:string, res:any)=> {
    try {

        await OrderModel.findOne({_id:orderId}).then(success => {
            return success;
        }).catch(error => {
            res.status(500).send(
                new CustomResponse(500,`Error can't find: ${error}`)
            )
        })

    }catch (error){
        res.status(500).send(
            new CustomResponse(500,`Error : ${error}`)
        )
    }
}

