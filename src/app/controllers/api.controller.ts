import { Router, Request, Response } from 'express';
import Util from '../utils/util';
import Executor from '../core/executor';

const router: Router = Router();

router.post('/execute/:courseId', Util.addUserPref, (req: Request, res: Response) => {
    Executor.executeJavaScript(req, res);
})

export default router;