import User from '../models/user'
import multer from 'multer';
import path from 'path';
import CustomErrorHandler from '../services/CustomErrorHandler';
import fs from 'fs';
import bcrypt from 'bcrypt';
import userSchema from '../validators/userValidator';

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1e9
        )}${path.extname(file.originalname)}`;
        // 3746674586-836534453.png
        cb(null, uniqueName);
    },
});

const handleMultipartData = multer({
    storage,
    limits: { fileSize: 1000000 * 5 },
}).single('image'); // 5mb

const userController = {
    async register(req, res, next) {
        // Multipart form data
        handleMultipartData(req, res, async (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message));
            }
            const filePath = req.file.path;
            // validation
            const { error } = userSchema.validate(req.body);
            if (error) {
                // Delete the uploaded file
                fs.unlink(`${appRoot}/${filePath}`, (err) => {
                    if (err) {
                        return next(
                            CustomErrorHandler.serverError(err.message)
                        );
                    }
                });

                return next(error);
                // rootfolder/uploads/filename.png
            }

            const { name, email,  password,orders } = req.body;
            // Hash password
             const hashedPassword = await bcrypt.hash(password, 10);
            let document;
            try {
                document = await User.create({
                    name,
                    email,
                    password: hashedPassword,
                    image: filePath,
                    orders,
                });
            } catch (err) {
                return next(err);
            }
            res.status(201).json(document);
        });
    },
      //update api 

    update(req, res, next) {
        handleMultipartData(req, res, async (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message));
            }
            let filePath;
            if (req.file) {
                filePath = req.file.path;
            }

            // validation
            const { error } = userSchema.validate(req.body);
            if (error) {
                // Delete the uploaded file
                if (req.file) {
                    fs.unlink(`${appRoot}/${filePath}`, (err) => {
                        if (err) {
                            return next(
                                CustomErrorHandler.serverError(err.message)
                            );
                        }
                    });
                }

                return next(error);
                // rootfolder/uploads/filename.png
            }

            const { name,email , password , orders} = req.body;
            let document;
            try {
                document = await User.findOneAndUpdate(
                    { _id: req.params.id },
                    {
                        name,
                        email,
                        password,
                        ...(req.file && { image: filePath }),
                        orders ,
                    },
                    { new: true }
                );
            } catch (err) {
                return next(err);
            }
            res.status(201).json(document);
        });
    }, 
       //delete api
    async delete(req, res, next) {
        const document = await User.findOneAndRemove({ _id: req.params.id });
        if (!document) {
            return next(new Error('Nothing to delete'));
        }
        // image delete
        const imagePath = document._doc.image;
        
        fs.unlink(`${appRoot}/${imagePath}`, (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError());
            }
            return res.json(document);
        });
    },
    // ALL USER DETAILS
    async  details(req, res, next) {
        let documents;
       
        try {
            documents = await User.find()
                .select('-updatedAt -__v')
                .sort({ _id: -1 });
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json(documents);
    },
    //ONE USER DETAIL
    async detail(req, res, next) {
        let document;
        try {
            document = await User.findOne({ _id: req.params.id }).select(
                '-updatedAt -__v'
            );
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json(document);
    },
    async getimage(req, res, next) {
        let documents;
        try {
            documents = await User.findOne({_id: req.params.image})
            
                
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        console.log(documents)
        return res.json(documents);
        

    },
};

export default userController;
