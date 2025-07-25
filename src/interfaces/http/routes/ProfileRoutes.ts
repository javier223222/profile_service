import { Router } from 'express';
import { ProfileController } from '../ProfileController';

export class ProfileRoutes {
    private router: Router;
    private profileController: ProfileController;

    constructor(profileController: ProfileController) {
        this.router = Router();
        this.profileController = profileController;
        this.setupRoutes();
    }

    private setupRoutes(): void {
       
        this.router.post(
            '/users/:userId/avatar/upload',
            this.profileController.uploadProfileImage.bind(this.profileController)
        );

     
        this.router.put(
            '/users/:userId/avatar/url',
            this.profileController.updateProfileImageByUrl.bind(this.profileController)
        );
    }

    getRouter(): Router {
        return this.router;
    }
}
