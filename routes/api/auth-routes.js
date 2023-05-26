const authControllers = require("../../controllers/auth-controllers");

const {schemas} = require("../../models/user");

const Router = require("../../classes/Router");


class AuthRoutes extends Router {
    constructor(){
        super()
        this.initRouter()
    }

    initRouter(){
        this.router.post("/register", schemas.validatedUserRegisterBody, authControllers.register)

        this.router.post("/login", schemas.validatedUserLoginBody, authControllers.login);

        this.router.get("/current", this.authenticate, authControllers.getCurrent);

        this.router.post("/logout", this.authenticate, authControllers.logout);
    }
    
    getRouter () {
        return this.router;
      }
}

module.exports = new AuthRoutes();