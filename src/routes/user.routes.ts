import express, {Router} from "express";
import * as UserController from "../controllers/user.controller"
import * as VerifyToken from "../middlewares/verifyToken"
import {upload, uploadPic} from "../middlewares/imageUplode";

let router = express.Router();

// Create user
router.post('/save',  uploadPic.single('file'), UserController.createUser)

router.put('/update', VerifyToken.verifyToken, uploadPic.single('file'), UserController.updateUser)

router.get('/get/all', VerifyToken.verifyToken, UserController.getAllUser)

router.delete('/delete', VerifyToken.verifyToken, UserController.deleteUser)

router.post('/auth', UserController.authUser)

// router.post('/image', VerifyToken.verifyToken,  upload.single('file'), UserController.handleImage)
router.post('/image', VerifyToken.verifyToken, uploadPic.single('file'), UserController.handleImage)

export default router;