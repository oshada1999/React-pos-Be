import multer from 'multer'
import path from 'path'

export const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        const formDataKeys = Object.keys(req.body);

        console.log('FormData keys:', formDataKeys);

        // if (formDataKeys[0]==='user'){
        //     console.log("users inno ne");
        //     cb(null, 'src/media/images/user')
        // }else if (formDataKeys[0]==='item'){
        //     console.log("item inno ne");
        // }else {
        //     cb(null, 'src/media/images')
        // }

        console.log(formDataKeys[0])

        let path = getPath(formDataKeys[0]);

        cb(null, path)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname)

        // let user_data = JSON.parse(req.body.user);
        // console.log(user_data.username);

        // console.log(file)

        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const getPath = (key :string) :string => {
    console.log(key)
    switch (key) {
        case 'user':
            return 'src/media/images/users';
        case 'item':
            return 'src/media/images/items';
        case 'brand':
            return 'src/media/images/brands';
        default:
            return 'src/media/images';
    }
}


export const uploadPic = multer({
    storage: storage,
    fileFilter(req: any, file: Express.Multer.File, callback: multer.FileFilterCallback) {
        // console.log(file.originalname)
        // console.log(file)
        if (file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/gif'){
            callback(null,true)
        }else {
            callback(null,false)
            req.fileError = 'File format is not valid'
        }
    }
})

export const upload = multer({ storage: storage })