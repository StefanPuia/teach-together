import { Router, Request, Response } from 'express';
import Screen from '../../framework/core/screen';
import { User } from '../core/entity/user';

const router: Router = Router();

router.get('/:courseId', (req: Request, res: Response) => {
    Promise.all([
        User.findAll()
    ]).then((values) => {
        Screen.create('course/teacher', req, res).appendContext({
            headerTitle: "Course",
            allUsers: values[1]
        }).renderQuietly();
    }).catch(err => {
        res.send(err);
    })
})

export default router;