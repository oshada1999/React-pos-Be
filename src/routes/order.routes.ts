import express from "express";
import * as VerifyToken from '../middlewares/verifyToken'
import * as OrderController from '../controllers/order.controller'

let router = express.Router();

router.post('/save', VerifyToken.verifyToken, OrderController.createOrder)

router.put('/update', VerifyToken.verifyToken, OrderController.updateOrder)

router.get('/get/all', VerifyToken.verifyToken, OrderController.getAllOrders)//query string?size=page=

router.get('/get/order', VerifyToken.verifyToken, OrderController.getOrderById)//query string ?order=

router.delete('/delete', VerifyToken.verifyToken, OrderController.deleteOrder)//query string ?order

export default router;