import { Router, Request, Response } from 'express';
import DatabaseUtil from '../../framework/utils/database.util';
import Screen from '../../framework/core/screen';
import Util from '../utils/util';

const router: Router = Router();

router.get('/', Util.addUserPref, (req: Request, res: Response) => {
    Screen.create('main/index', req, res).appendContext({
        test: 1,
        url: req.url
    }).beforeRender((req, res, context, callback) => {
        Promise.all([
            DatabaseUtil.transactPromise('select * from user')
        ]).then(values => {
            context.users = values[0];
            callback();
        }).catch(callback);
    }).renderQuietly();
});

export default router;