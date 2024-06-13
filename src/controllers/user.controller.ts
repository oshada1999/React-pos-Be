import express from "express";
import * as process from "process";
import bcrypt from "bcryptjs"
import {CustomResponse} from "../dtos/custom.response";
import UserModel from "../models/user.model";
import {UserInterface} from "../types/SchemaTypes";
import jwt, {Secret} from "jsonwebtoken";
import userModel from "../models/user.model";
import ImageModel from "../models/imageTest.model";
import fs from 'fs'

export const createUser = async (req : any, res:any) => {

    if (req.fileError){
        res.status(401).send(
            new CustomResponse(401,"Image format not allow")
        )
    } else {

        let fileName:string = req.file.filename;
        let user_data = JSON.parse(req.body.user);

        // console.log(req.body)

        try {

            let user_by_email : UserInterface | null = await UserModel.findOne({email:user_data.email});

            // console.log(user_by_email)

            if (user_by_email){
                //delete image
                fs.unlinkSync(req.file.path);

                res.status(409).send(
                    new CustomResponse(409,"Email already used!")
                )
            }else {

                let user_by_username : UserInterface | null = await UserModel.findOne({username:user_data.username});

                if (user_by_username){
                    //delete image
                    fs.unlinkSync(req.file.path);

                    res.status(409).send(
                        new CustomResponse(409,"Username already used!")
                    )

                }else {

                    bcrypt.hash(user_data.password, 8, async function (err, hash :string) {

                        let userModel =  new UserModel({
                            username: user_data.username,
                            fullName: user_data.fullName,
                            email: user_data.email,
                            phoneNumber: user_data.phoneNumber,
                            password: hash,
                            role:user_data.role,
                            proPic: `users/${fileName}`
                        });

                        let user: UserInterface | null = await userModel.save()

                        if (user){
                            user.password="";
                            res.status(200).send(
                                new CustomResponse(
                                    200, "User saved successfully",user
                                )
                            );
                        }else {
                            //delete image
                            fs.unlinkSync(req.file.path);
                            res.status(500).send(
                                new CustomResponse(500,`Something went wrong!`)
                            )
                        }

                    })

                }

            }


        }catch (error){
            res.status(500).send(
                new CustomResponse(500,`Error : ${error}`)
            )
        }

    }


}

export const updateUser = async (req :any, res :any) => {
    try {

        if (req.fileError){
            res.status(401).send(
                new CustomResponse(401,"Image format not allow")
            )
        } else {

            let fileName:string = req.file.filename;
            let user_data = JSON.parse(req.body.user);

            let user_by_username :UserInterface | null = await userModel.findOne({_id: user_data.id});

            if (user_by_username){

                bcrypt.hash(user_data.password, 8, async function (err, hash :string) {

                    await UserModel.findByIdAndUpdate(
                        {_id:user_data.id},
                        {
                            username:user_data.username,
                            fullName:user_data.fullName,
                            email:user_data.email,
                            phoneNumber:user_data.phoneNumber,
                            password:hash,
                            role:user_data.role,
                            proPic:`users/${fileName}`
                        }
                    ).then( success => {
                        // success object is old object
                        if (success){
                            //delete old image
                            // @ts-ignore
                            // fs.unlinkSync('src/media/images/users/'+user_by_username.proPic);
                            fs.unlinkSync('src/media/images/'+user_by_username.proPic);
                            res.status(200).send(
                                new CustomResponse(200,"User update successfully")
                            )
                        }

                    }).catch(error => {
                        //delete image
                        fs.unlinkSync(req.file.path);
                        res.status(500).send(
                            new CustomResponse(500,`Error : ${error}`)
                        )
                    })

                })

            }else {
                //delete image
                fs.unlinkSync(req.file.path);
                res.status(404).send(
                    new CustomResponse(404,`User not found!!!`)
                )
            }

        }


    }catch (error){
        res.status(500).send(
            new CustomResponse(500,`Error : ${error}`)
        )
    }
}

export const deleteUser = async (req :express.Request, res :any) => {
    try {

        let query_string :any = req.query;
        let id :string = query_string.id;

        //is my account or not
        if (res.tokenData.user._id == id || res.tokenData.user.role === "admin"){
            //if is not my account then check user role is admin

            let user_by_id : UserInterface | null = await UserModel.findOne({_id:id});

            if (user_by_id) {
                await UserModel.deleteOne({_id:id}).then( success => {

                    //delete user image -----------------------------------------------------------
                    // @ts-ignore
                    // fs.unlinkSync(`src/media/images/users/${user_by_id.proPic}`);
                    fs.unlinkSync(`src/media/images/${user_by_id.proPic}`);
                    res.status(200).send(
                        new CustomResponse(200, "User delete successfully")
                    );
                }).catch(error => {
                    res.status(500).send(
                        new CustomResponse(500, `Something went wrong : ${error}`)
                    );
                })
            }else {
                res.status(404).send(
                    new CustomResponse(404,"User not found!")
                )
            }

        }else {
            res.status(401).send(
                new CustomResponse(401,"Access Denied")
            )
        }

    }catch (error){
        res.status(500).send(
            new CustomResponse(500,`Error : ${error}`)
        )
    }
}

export const getAllUser = async (req :express.Request, res :express.Response) => {
    try {

        let query_string :any=req.query;
        let size :number = query_string.size;
        let page :number = query_string.page;

        let documentsCount :number = await UserModel.countDocuments();
        let totalPages :number = Math.ceil(documentsCount / size);

        let userList  =
            await UserModel.find().limit(size).skip(size * (page - 1));

        userList.map(u => {
            u.password=""
        })

        res.status(200).send(
            new CustomResponse(
                200,
                "Users found",
                userList,
                totalPages
            )
        )

    } catch (error){
        res.status(500).send(
            new CustomResponse(500,`Error : ${error}`)
        )
    }
}

export const authUser = async (req :express.Request, res :any) => {

    try {

        let user : UserInterface | null = await UserModel.findOne({username:req.body.username});

        if (user){

            let isMache :boolean = await bcrypt.compare(req.body.password, user.password);

            if (isMache) {
                generateToken(user,res);
            }else {
                res.status(401).json(
                    new CustomResponse(401,"Wrong Password!!!")
                )
            }

        } else {
            res.status(404).send(
                new CustomResponse(404, "User not found!")
            )
        }

    }catch (error){
        res.status(500).send(
            new CustomResponse(500,`Error : ${error}`)
        )
    }

}

const generateToken = (user: UserInterface, res :express.Response) => {
    user.password = "";
    let expiresIn = "1w";

    jwt.sign({user}, process.env.SECRET as Secret, {expiresIn}, (error :any,token :any) => {
        if (error){
            res.status(500).send(
                new CustomResponse(500,`Something went wrong : ${error}`)
            )
        } else {

            let res_body={
                user: user,
                accessToken: token
            }

            res.status(200).send(
                new CustomResponse(200,"Access",res_body)
            );

        }
    });
}

export const handleImage = async (req :any, res :any) => {

    if (req.fileError){
        res.status(401).send(
            new CustomResponse(401,"Image format not allow")
        )
    } else {
        let fileName:string = req.file.filename;
        let body = JSON.parse(req.body.user);
        console.log(body);

        let imageModel = new ImageModel({
            image:fileName
        });

        await imageModel.save().then(s => {

            console.log(s)
            if (s){
                res.status(200).send(
                    new CustomResponse(200,"Image saved")
                )
            }

            // fs.unlinkSync(req.file.path);


        }).catch(e => {
            console.log(e)
        })
    }






}