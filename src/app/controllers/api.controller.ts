import { Router, Request, Response } from 'express';
import Executor from '../core/executor';

const apiController: Router = Router();

apiController.post('/execute/:courseId', (req: Request, res: Response) => {
    Executor.executeJavaScript(req, res);
})

export { apiController };