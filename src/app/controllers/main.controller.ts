import { Router, Request, Response } from 'express';
import { Screen } from '../core/screen';

const mainController: Router = Router();

mainController.get('/', (req: Request, res: Response) => {
    Screen.create('main/index', req, res).renderQuietly();
});

export { mainController };