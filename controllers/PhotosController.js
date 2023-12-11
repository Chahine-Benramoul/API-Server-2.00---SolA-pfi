import Authorizations from '../authorizations.js';
import Repository from '../models/repository.js';
import PhotoModel from '../models/photo.js';
//import PhotoLikeModel from '../models/photoLike.js';
import Controller from './Controller.js';
import * as utilities from "../utilities.js";
import TokensManager from '../tokensManager.js';
import AccountsController from './AccountsController.js';

export default
    class Photos extends Controller {
    constructor(HttpContext) {
        super(HttpContext, new Repository(new PhotoModel()), Authorizations.user());
        //this.photoLikesRepository = new Repository(new PhotoLikeModel());
    }
    
    get(id){
        if (id != undefined) {
            if (Authorizations.readGranted(this.HttpContext, Authorizations.user())){
                let photo = this.repository.get(id);
                let currentUserToken = TokensManager.find(this.HttpContext.req.headers['authorization'].replace('Bearer ', ''));
                let userPhotoId = photo.OwnerId;
                // admin devrait voir photo not shared ??
                let show = photo.Shared || (currentUserToken.User.Id == userPhotoId) || Authorizations.granted(this.HttpContext, Authorizations.admin());
                if(show)
                    this.HttpContext.response.JSON(photo);
                else
                    this.HttpContext.response.unAuthorized("Unauthorized access");
            }

            else
                this.HttpContext.response.unAuthorized("Unauthorized access");
        }
        else {
            // pas sur de la partie ici Authorizations.user()
            if (Authorizations.granted(this.HttpContext, Authorizations.user()))
                this.HttpContext.response.JSON(this.repository.getAll(this.HttpContext.path.params), this.repository.ETag, true, Authorizations.user());
            else
                this.HttpContext.response.unAuthorized("Unauthorized access");
        }
    }

    test(id){
        if (id != undefined) {
            if (Authorizations.readGranted(this.HttpContext, Authorizations.user()))
                this.HttpContext.response.JSON(this.repository.get(id));
            else
                this.HttpContext.response.unAuthorized("Unauthorized access");
        }
        else {
            // pas sur de la partie ici Authorizations.user()
            if (Authorizations.granted(this.HttpContext, Authorizations.user()))
                this.HttpContext.response.JSON(this.repository.getAll(this.HttpContext.path.params), this.repository.ETag, true, Authorizations.user());
            else
                this.HttpContext.response.unAuthorized("Unauthorized access");
        }
    }

    modify(photo){

    }
    // on vient override le POST du controller par defaut pour custom notre approche
    post(photo){
        if(this.repository != null){
            photo.Date = utilities.nowInSeconds();
            if(!photo.Shared)
                photo.Shared = false;
            else
                photo.Shared = true;
            let newPhoto = this.repository.add(photo);
            if(this.repository.model.state.isValid){
                this.HttpContext.response.created(newPhoto);
            }else{
                if (this.repository.model.state.inConflict)
                    this.HttpContext.response.conflict(this.repository.model.state.errors);
                else
                    this.HttpContext.response.badRequest(this.repository.model.state.errors);
            }
        }else
            this.HttpContext.response.notImplemented();
    }
    remove(id){
        // a tester...
        // on veut que le proprio ou admin puisse envler sa photo
        if(Authorizations.writeGranted(this.HttpContext,Authorizations.user()))
        {
            super.remove(id);
        }
    }
}