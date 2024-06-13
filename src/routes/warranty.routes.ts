import express from "express";
import * as VerifyToken from "../middlewares/verifyToken";
import * as WarrantyController from "../controllers/warranty.controller";

let router = express.Router();

router.post('/save', VerifyToken.verifyToken, WarrantyController.addWarranty);

router.get('/get/all', VerifyToken.verifyToken, WarrantyController.getAllWarranty);

router.get('/get/warranty', VerifyToken.verifyToken, WarrantyController.getWarrantyByOrderId) //query string -> ?orderId=


export default router;