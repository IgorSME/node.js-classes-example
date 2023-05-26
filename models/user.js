const {Schema, model} = require("mongoose");
const Joi = require("joi");

const handleMongooseError = require("./handleMongooseError");

const emailRegexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;


const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        match: emailRegexp,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        minlength: 6,
        required: true,
    },
    token: {
        type: String,
        default: ""
    }
}, {versionKey: false, timestamps: true});

userSchema.post("save", handleMongooseError);

const userRegisterSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
});

const userLoginSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
});

const  validateBody = schema => {
    const func = (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            next(this.createError(400, error.message));
        }
        next()
    };

    return func;
}


const schemas = {
    validatedUserRegisterBody : validateBody(userRegisterSchema),
    validatedUserLoginBody: validateBody(userLoginSchema),
};

const User = model("user", userSchema);

module.exports = {
    User,
    schemas,
}

