import { Router, Request, Response } from 'express';
import { Screen } from '../core/screen';
import { ExpressUtil } from '../utils/express.util';
import { EntityQuery } from '../../framework/core/engine/entity/entity.query';

const courseController: Router = Router();

courseController.get("/", (req: Request, res: Response) => {
    EntityQuery.from("Engine").cache(true).queryList().then(engines => {
        Screen.create("course/index", req, res).appendContext({
            engines: engines
        }).renderQuietly();
    });
})

courseController.get("/list/:engineId", (req: Request, res: Response) => {
    EntityQuery.from("Course").where({ "engineId": req.params.engineId }).queryList().then(courses => {
        Screen.create("course/list", req, res).appendContext({
            courses: courses
        }).renderQuietly();
    });
})

courseController.get('/:courseId', (req: Request, res: Response) => {
    EntityQuery.from("Course").where({ "courseId": req.params.courseId }).queryFirst().then(course => {
        Screen.create('course/teacher', req, res).appendContext({
            headerTitle: course.get("name"),
            course: course
        }).renderQuietly();
    }).catch(err => {
        ExpressUtil.handleGenericError(req, res, err);
    });
})

export { courseController };