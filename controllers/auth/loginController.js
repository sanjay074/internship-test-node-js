import Joi from 'joi';
import  User from '../../models/user';
import CustomErrorHandler from '../../services/CustomErrorHandler';
import bcrypt from 'bcrypt';
const loginController = {
    async login(req, res, next) {
        // Validation
        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        });
        const { error } = loginSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return next(CustomErrorHandler.wrongCredentials());
            }
            // compare the password
            const match = await bcrypt.compare(req.body.password, user.password);
            if (!match) {
                return next(CustomErrorHandler.wrongCredentials());
            }

        } catch(err) {
            return next(err);
        }
        res.status(200).json({message:"User is login"})
    },
    
};


export default loginController;