import { Router, Request, Response } from 'express';
import { Screen } from '../core/screen';

const userController: Router = Router();

userController.get('/settings', (req: Request, res: Response) => {
    Screen.create('user/settings', req, res).renderQuietly();
});

export { userController };