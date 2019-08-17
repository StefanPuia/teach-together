import { Router, Request, Response } from 'express';
import DatabaseUtil from '../../framework/utils/database.util';
import Screen from '../../framework/core/screen';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    Screen.create('main/index', req, res).appendContext({
        test: 1,
        url: req.url
    }).beforeRender((req, res, context, callback) => {
        Promise.all([
            DatabaseUtil.transactPromise('select * from user'),
            DatabaseUtil.transactPromise('select * from progress'),
        ]).then(values => {
            context.users = values[0];
            context.progress = values[1];
            callback();
        }).catch(callback);
    }).renderQuietly();
});

export default router;