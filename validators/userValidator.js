import Joi from 'joi';

const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    image: Joi.string(),
    orders:Joi.string(),
});

export default userSchema;