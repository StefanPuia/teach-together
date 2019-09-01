import { Router, Request, Response } from 'express';
import Screen from '../../framework/core/screen';
import { User } from '../core/user';
import Util from '../utils/util';

const router: Router = Router();

router.get('/:courseId', Util.addUserPref, (req: CourseRequest, res: Response) => {
    Promise.all([
        new User().findAll()
    ]).then((values) => {
        Screen.create('course/teacher', req, res).appendContext({
           allUsers: values[1]
        }).renderQuietly();
    }).catch(err => {
        res.send(err);
    })
})

export default router;

export interface CourseRequest extends Request {
    params: GenericObject
}