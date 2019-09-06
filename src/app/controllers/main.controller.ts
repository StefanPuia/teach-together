import { Router, Request, Response } from 'express';
import Screen from '../core/screen';

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
    Screen.create('main/index', req, res).renderQuietly();
});

export default router;