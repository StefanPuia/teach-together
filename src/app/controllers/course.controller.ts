import { Router, Request, Response } from 'express';
import Screen from '../core/screen';
import { Engine } from '../core/entity/engine';
import { Course } from '../core/entity/course';
import ExpresssUtil from '../utils/express.util';

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
    Engine.findAll().then(engines => {
        Screen.create("course/index", req, res).appendContext({
            engines: engines
        }).renderQuietly();
    });
})

router.get("/list/:engineId", (req: Request, res: Response) => {
    Course.findAll("engine_id = ?", [req.params.engineId]).then(courses => {
        Screen.create("course/list", req, res).appendContext({
            courses: courses
        }).renderQuietly();
    });
})

router.get('/:courseId', (req: Request, res: Response) => {
    Course.create().find(req.params.courseId).then(course => {
        Screen.create('course/teacher', req, res).appendContext({
            headerTitle: course.name,
        }).renderQuietly();
    }).catch(err => {
        ExpresssUtil.handleGenericError(req, res, err);
    });
})

export default router;