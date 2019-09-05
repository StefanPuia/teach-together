import { Router, Request, Response } from 'express';
import BaseUtil from '../utils/base.util';
import Executor from '../core/executor';

const router: Router = Router();

router.post('/execute/:courseId', (req: Request, res: Response) => {
    Executor.executeJavaScript(req, res);
})

export default router;