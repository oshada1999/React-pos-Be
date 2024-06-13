import express from "express";
import * as LogInDetailController from "../controllers/logInDetail.controller"
import * as VerifyToken from "../middlewares/verifyToken"

let router = express.Router();

router.post('/save', VerifyToken.verifyToken, LogInDetailController.addLoginDetail);//query string ?time=

router.get('/get/all', VerifyToken.verifyToken, LogInDetailController.getAllLoginRecodes);
//query string ?size=10&page=1

router.get('/get/all/:username', VerifyToken.verifyToken, LogInDetailController.getAllLoginRecodesByUsername);
//path variable and //query string ?size=10&page=1

router.get('/get/recode', VerifyToken.verifyToken, LogInDetailController.getLoginRecodeById)//query string ?id=

router.put('/update', VerifyToken.verifyToken, LogInDetailController.updateLoginRecode)
export default router;