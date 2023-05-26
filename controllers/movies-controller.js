const {Movie} = require("../models/movie");
const {Controller} = require("../classes");

class MovieController extends Controller {
    
    getAll = this.ctrlWrapper(async (req, res) => {
        const {_id: owner} = req.user;
        const {page = 1, limit = 10} = req.query;
        const skip = (page - 1) * limit;

        const result = await this.model.find({owner}, "-createdAt -updatedAt", {skip, limit});
    
        res.json(result);
    })

    getById = this.ctrlWrapper(async (req, res) => {
        const { id } = req.params;
        const {_id: owner} = req.user;
    
        const result = await this.model.findById(id);
    
        if (!result) {
            throw this.createError(404, `Movie with id=${id} not found`);
        }
    
        if(result.owner !== owner) {
            throw this.createError(400);
        }
    
        res.json(result);
    })

    addMovie = this.ctrlWrapper(async (req, res) => {
        const {_id: owner} = req.user;
        const result = await Movie.create({...req.body, owner});
        res.status(201).json(result);
    })

    updateMovieById = this.ctrlWrapper(async (req, res) => {
        const { id } = req.params;
        const result = await Movie.findByIdAndUpdate(id, req.body, {new: true});
        if (!result) {
            throw HttpError(404, `Movie with id=${id} not found`);
        }
    
        res.json(result);
    })

    updateMovieFavorite = this.ctrlWrapper(async (req, res) => {
        const { id } = req.params;
        const result = await Movie.findByIdAndUpdate(id, req.body, {new: true});
        if (!result) {
            throw HttpError(404, `Movie with id=${id} not found`);
        }
    
        res.json(result);
    })

    deleteMovieById = this.ctrlWrapper(async (req, res) => {
        const { id } = req.params;
        const result = await Movie.findByIdAndDelete(id);
        if (!result) {
            throw HttpError(404, `Movie with id=${id} not found`);
        }
    
        res.json({
            message: "Delete success",
            result,
        });
    })
}

module.exports = new MovieController(Movie);
