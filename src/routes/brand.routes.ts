import express from "express";
import * as VerifyToken from "../middlewares/verifyToken";
import * as BrandController from "../controllers/brand.controller"
import {upload, uploadPic} from "../middlewares/imageUplode";

let router = express.Router();

router.post('/save', VerifyToken.verifyToken, uploadPic.single('file'), BrandController.createBrand)

router.put('/update', VerifyToken.verifyToken , uploadPic.single('file'), BrandController.updateBrand)

router.get('/get/all/category/:category', VerifyToken.verifyToken, BrandController.getAllBrandsByCategory)

router.get('/get/all', VerifyToken.verifyToken, BrandController.getAllBrands) // query string -> ?size=,page=,category=

router.get('/get/brand/:brand', VerifyToken.verifyToken, BrandController.getBrand)

router.delete('/delete/:brand', VerifyToken.verifyToken, BrandController.deleteBrand)

export default router;