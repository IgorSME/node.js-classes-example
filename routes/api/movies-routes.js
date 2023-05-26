
const moviesController = require("../../controllers/movies-controller");

const {schemas} = require("../../models/movie");

const Router = require("../../classes/Router");

class MoviesRoutes extends Router {
  
constructor(){
    super()
    this.initRouter()
}

    initRouter(){
        this.router.use(this.authenticate)

        this.router.get("/",  moviesController.getAll)
        this.router.get("/:id",this.isValidId, moviesController.getById)
        this.router.post("/", schemas.validatedMovieAddBody, moviesController.addMovie)

        this.router.put("/:id", this.isValidId, schemas.validatedMovieUpdateBody, moviesController.updateMovieById)
        this.router.patch("/:id/favorite", this.isValidId, schemas.validatedMovieUpdateBody, moviesController.updateMovieFavorite)

        this.router.delete("/:id", this.isValidId, moviesController.deleteMovieById)

    }

    getRouter () {
        return this.router;
      }
}

module.exports =new MoviesRoutes();
