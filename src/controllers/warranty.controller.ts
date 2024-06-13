import mongoose from "mongoose";
import express from "express";
import {CustomResponse} from "../dtos/custom.response";
import WarrantyModel from "../models/warranty.model";
import {WarrantyInterface} from "../types/SchemaTypes";

export const addWarranty = async (req :express.Request, res :any) => {
    try {

        let warrantyModel = new WarrantyModel({
            itemId:req.body.itemId,
            orderId:req.body.orderId,
            description:req.body.description,
            startDate:req.body.startDate,
            expireDate:req.body.expireDate
        });

        let warranty :WarrantyInterface | null = await warrantyModel.save();

        if (warranty){
            res.status(200).send(
                new CustomResponse(
                    200, "Warranty saved successfully",warranty
                )
            );
        }else {
            res.status(200).send(
                new CustomResponse(
                    500, "Something went wrong"
                )
            );
        }

    } catch (error) {
        res.status(500).send(
            new CustomResponse(500,`Error : ${error}`)
        )
    }
}

export const getAllWarranty = async (req :express.Request, res :any) => {
    try {

        let query_string :any = req.query;
        let size :number = query_string.size;
        let page :number = query_string.page;

        let countDocuments :number = await WarrantyModel.countDocuments();
        let totalPages :number = Math.ceil(countDocuments / size);

        let warrantyList :WarrantyInterface[] | null =
            await WarrantyModel.find().limit(size).skip(size * (page - 1));

        res.status(200).send(
            new CustomResponse(200, "Warranty found.", warrantyList, totalPages)
        )

    } catch (error) {
        res.status(500).send(
            new CustomResponse(500,`Error : ${error}`)
        )
    }
}

export const getWarrantyByOrderId = async (req :express.Request, res :any) => {
    try {

        let query :any = req.query;
        let orderId :string = query.orderId;

        let warranty :WarrantyInterface | null =
            await WarrantyModel.findOne({orderId:orderId});

        if (warranty) {
            res.status(200).send(
                new CustomResponse(200, "Warranty found.", warranty)
            )
        } else {
            res.status(404).send(
                new CustomResponse(404, "Warranty not found!")
            )
        }

    } catch (error) {
        res.status(500).send(
            new CustomResponse(500,`Error : ${error}`)
        )
    }
}