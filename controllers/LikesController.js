import Authorizations from '../authorizations.js';
import Repository from '../models/repository.js';
import Controller from './Controller.js';
import LikesModel from "../models/like.js";

class Likes extends Controller {
    constructor(HttpContext) {
        super(HttpContext, new Repository(new LikesModel()));
        //this.photoLikesRepository = new Repository(new PhotoLikeModel());
    }

    handleLike(idPub) {
        if(idPub) {

        }
    }

}