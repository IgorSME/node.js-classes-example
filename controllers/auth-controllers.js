const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {Controller} = require("../classes");

const {User} = require("../models/user");

const {SECRET_KEY} = process.env;

class AuthController extends Controller {
     register = this.ctrlWrapper(async (req, res)=> {
        const {email, password} = req.body;
        const user = await this.model.findOne({email});
        if(user) {
            throw this.createError(409, "Email already exist");
        }
    
        const hashPassword = await bcrypt.hash(password, 10);
    
        const result = await this.model.create({...req.body, password: hashPassword});
    
        res.status(201).json({
            name: result.name,
            email: result.email,
        })
    })
    
     login = this.ctrlWrapper(async(req, res)=> {
        const {email, password} = req.body;
        const user = await this.model.findOne({email});
        if(!user) {
            throw this.createError(401);
        }
    
        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare) {
            throw this.createError(401);
        }
    
        const {_id: id} = user;
    
        const payload = {
            id,
        }
    
        const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "23h"});
        await this.model.findByIdAndUpdate(id, {token});
    
        res.json({
            token, 
            user: {
                name: user.name,
                email: user.email,
            }
        })
    })
    
     getCurrent = this.ctrlWrapper(async(req, res)=> {
        const {name, email} = req.user;
    
        res.json({
            user: {
                name,
                email,
            }
        })
    })
    
     logout = this.ctrlWrapper(async(req, res)=> {
        const {_id} = req.user;
        await this.model.findByIdAndUpdate(_id, {token: ""});
    
        res.json({
            message: "Logout success"
        })
    })
}

module.exports = new AuthController(User);

