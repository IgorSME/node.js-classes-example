const express = require("express");
const jwt = require("jsonwebtoken");
const {isValidObjectId} = require("mongoose");
const {User} = require('../models/user');

const {SECRET_KEY} = process.env;

class Router {
    constructor() {
        
        this.router = express.Router();
    }

    authenticate = async (req, res, next)=> {
        const {authorization = ""} = req.headers;
        const [bearer, token] = authorization.split(" ");
    
        if(bearer !== "Bearer") {
            next( this.createError(401))
        }
    
        try {
            const {id} = jwt.verify(token, SECRET_KEY);
            const user = await User.findById(id);
            if(!user || !user.token) {
                next(this.createError(401))
            }
            req.user = user;
            next();
        }
        catch {
            next(this.createError(401))
        }
    }

    validateBody = schema => {
        const func = (req, res, next) => {
            const { error } = schema.validate(req.body);
            if (error) {
                next(this.createError(400, error.message));
            }
            next()
        };
    
        return func;
    }

    isValidId = (req, res, next)=> {
        const {id} = req.params;
        if(!isValidObjectId(id)) {
            next(this.createError(404, `${id} is not valid id`))
        }
    
        next();
    }
}

module.exports = Router;