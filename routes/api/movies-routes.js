
const moviesController = require("../../controllers/movies-controller");

const {schemas} = require("../../models/movie");

const Router = require("../../classes/Router");


class MoviesRoutes extends Router {
  

    initRouter(){
        this.router.use(this.authenticate)

        this.router.get("/",  moviesController.getAll)
        this.router.get("/:id",this.isValidId, moviesController.getById)
        this.router.post("/", this.validateBody(schemas.movieAddSchema), moviesController.addMovie)

        this.router.put("/:id", this.isValidId, this.validateBody(schemas.updateMovieById), moviesController.updateMovieById)
        this.router.patch("/:id/favorite", this.isValidId, this.validateBody(schemas.updateFavoriteMovieSchema))

        this.router.delete("/:id", this.isValidId, moviesController.deleteMovieById)
    }
}


module.exports = new MoviesRoutes().router;