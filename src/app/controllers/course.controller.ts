import { Router, Request, Response } from 'express';
import { Screen } from '../core/screen';
import { Engine } from '../core/entity/engine';
import { Course } from '../core/entity/course';
import { ExpressUtil } from '../utils/express.util';

const courseController: Router = Router();

courseController.get("/", (req: Request, res: Response) => {
    Engine.findAll().then(engines => {
        Screen.create("course/index", req, res).appendContext({
            engines: engines
        }).renderQuietly();
    });
})

courseController.get("/list/:engineId", (req: Request, res: Response) => {
    Course.findAll("engine_id = ?", [req.params.engineId]).then(courses => {
        Screen.create("course/list", req, res).appendContext({
            courses: courses
        }).renderQuietly();
    });
})

courseController.get('/:courseId', (req: Request, res: Response) => {
    Course.create().find(req.params.courseId).then(course => {
        Screen.create('course/teacher', req, res).appendContext({
            headerTitle: course.name,
            course: course
        }).renderQuietly();
    }).catch(err => {
        ExpressUtil.handleGenericError(req, res, err);
    });
})

export { courseController };