import express from "express";
import * as VerifyToken from "../middlewares/verifyToken";
import * as CustomerController from "../controllers/customer.controller";

let router = express.Router();

router.post('/save', VerifyToken.verifyToken, CustomerController.addCustomer)

router.get('/get/all', VerifyToken.verifyToken, CustomerController.getAllCustomers)

router.get('/get/customer/:nic', VerifyToken.verifyToken, CustomerController.getCustomerByNic) //path variable

router.put('/update', VerifyToken.verifyToken, CustomerController.updateCustomer)

router.delete('/delete', VerifyToken.verifyToken, CustomerController.deleteCustomer) // query string -> ?nic=

export default router;