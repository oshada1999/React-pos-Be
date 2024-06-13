import express, {Router} from "express";
import * as ItemController from "../controllers/item.controller"
import * as VerifyToken from "../middlewares/verifyToken"
import {upload, uploadPic} from "../middlewares/imageUplode";

let router = express.Router();

router.post('/save', VerifyToken.verifyToken,  uploadPic.single('file'), ItemController.saveItem)

router.get('/get/all', VerifyToken.verifyToken, ItemController.getAllItems)

router.get('/get', VerifyToken.verifyToken,  ItemController.getItemById) // query string -> ?code=

router.get('/get/search', VerifyToken.verifyToken,  ItemController.getItemByName) // query string -> ?name=

router.put('/update', VerifyToken.verifyToken, uploadPic.single('file'),  ItemController.updateItem)

router.delete('/delete', VerifyToken.verifyToken,  ItemController.deleteItem)  // query string -> ?id=

export default router