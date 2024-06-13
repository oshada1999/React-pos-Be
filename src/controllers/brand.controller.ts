import {CustomResponse} from "../dtos/custom.response";
import BrandModel from "../models/brand.model";
import {BrandInterface} from "../types/SchemaTypes";
import fs from "fs";
import CustomerModel from "../models/customer.model";


export const createBrand = async (req : any, res:any) => {

    if (req.fileError){
        res.status(401).send(
            new CustomResponse(401,"Image format not allow")
        )
    }else {
        let fileName:string = req.file.filename;
        let brand_data = JSON.parse(req.body.brand);

        try {

            let brand_by_name : BrandInterface | null= await BrandModel.findOne({name:brand_data.name});

            if (brand_by_name){
                fs.unlinkSync(req.file.path);

                res.status(409).send(
                    new CustomResponse(409,"Brand already used!")
                )
            }else {
                //save brand in database--------------------------------------------------------------------------

                let brandModel = new BrandModel({
                    name:brand_data.name,
                    category:brand_data.category,
                    image: `brands/${fileName}`
                });

                let new_brand : BrandInterface | null = await brandModel.save();

                if (new_brand){
                    res.status(200).send(
                        new CustomResponse(
                            200, "Brand saved successfully",new_brand
                        )
                    );
                }else {
                    fs.unlinkSync(req.file.path);
                    res.status(500).send(
                        new CustomResponse(500,`Something went wrong!`)
                    )
                }
            }



        }catch (error){
            //delete image
            fs.unlinkSync(req.file.path);
            res.status(500).send(
                new CustomResponse(500,`Error : ${error}`)
            )
        }
    }

}

export const updateBrand = async (req : any, res:any) => {

    if (req.fileError){
        res.status(401).send(
            new CustomResponse(401,"Image format not allow")
        )
    }else {
        let fileName:string = req.file.filename;
        let brand_data = JSON.parse(req.body.brand);

        try {
            let brand_by_name : BrandInterface | null= await BrandModel.findOne({name:brand_data.name});

            console.log(brand_by_name)

            if (brand_by_name){

                //update brad details --------------------------------------------------------------------

                await BrandModel.findByIdAndUpdate(
                    {_id:brand_data.id},
                    {
                        name:brand_data.name,
                        category:brand_data.category,
                        image: `brands/${fileName}`
                    }
                ).then(success => {
                    if (success){
                        //delete old image---------------------------------
                        // fs.unlinkSync('src/media/images/brands/'+brand_by_name?.image);

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

            }else {
                //delete image
                fs.unlinkSync(req.file.path);
                res.status(409).send(
                    new CustomResponse(409,"Brand not found!")
                )
            }

        }catch (error){
            //delete image
            fs.unlinkSync(req.file.path);
            res.status(500).send(
                new CustomResponse(500,`Error : ${error}`)
            )
        }

    }

}

export const getBrand = async (req : any, res:any) => {

    try {

        let brand_by_name : BrandInterface | null= await BrandModel.findOne({name:req.params.brand});

        if (brand_by_name) {
            res.status(200).send(
                new CustomResponse(200,"Brand found successfully",brand_by_name)
            )
        } else {
            res.status(404).send(
                new CustomResponse(404,"Brand not fount!!!")
            )
        }

    }catch (error){
        res.status(500).send(
            new CustomResponse(500,`Error : ${error}`)
        )
    }

}

export const getAllBrandsByCategory = async (req :any, res:any) => {

    try {

        let brand_list : BrandInterface[] = await BrandModel.find({category:req.params.category});

        res.status(200).send(
            new CustomResponse(
                200,
                "Brands found successfully.",
                brand_list)
        )

    }catch (error){
        res.status(500).send(
            new CustomResponse(500,`Error : ${error}`)
        )
    }

}

export const getAllBrands = async (req : any, res:any) => {

    try {

        let query_string :any = req.query;
        let size :number = query_string.size;
        let page :number = query_string.page;
        let category :string = query_string.category;

        let documentCount :number = await BrandModel.countDocuments();
        let brand_list = [];

        console.log(category+" : "+size)

        if (category==='All' && size!=-1){
            console.log(1)
            brand_list = await BrandModel.find().limit(size).skip(size * (page - 1));

        } else if (size==-1 && category!='All'){
            console.log(2)
            documentCount = await BrandModel.countDocuments({category:category});
            brand_list = await BrandModel.find({category:category});

        } else if (category==='All' && size==-1){
            console.log(3)
            brand_list = await BrandModel.find();

        } else {
            console.log(4)
            documentCount = await BrandModel.countDocuments({category:category});
            brand_list = await BrandModel.find({category:category}).limit(size).skip(size * (page - 1));
        }

        let totalPages :number = Math.ceil(documentCount / size);



        res.status(200).send(
            new CustomResponse(
                200,
                "Brands found successfully.",
                brand_list,
                totalPages)
        )

    }catch (error){
        res.status(500).send(
            new CustomResponse(500,`Error : ${error}`)
        )
    }

}

export const deleteBrand = async (req : any, res:any) => {
    try {

        let brand_by_name : BrandInterface | null= await BrandModel.findOne({name:req.params.brand});

        if (brand_by_name){

            await BrandModel.deleteOne({name:req.params.brand})
                .then(success => {

                fs.unlinkSync(`src/media/images/${brand_by_name?.image}`);
                res.status(200).send(
                    new CustomResponse(200, "Brand delete successfully")
                );
            })
                .catch(error => {
                    console.log(error)
                    res.status(500).send(
                        new CustomResponse(500, `Something went wrong : ${error}`)
                    );
                })

        }else {
            res.status(404).send(
                new CustomResponse(404,`Brand not found!`)
            )
        }

    }catch (error){
        res.status(500).send(
            new CustomResponse(500,`Error : ${error}`)
        )
    }
}