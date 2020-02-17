import { Router, Request, Response } from 'express';
import { Screen } from '../core/screen';
import { ExpressUtil } from '../utils/express.util';
import { EntityQuery } from '../../framework/core/engine/entity/entity.query';
import { GenericValue } from '../../framework/core/engine/entity/generic.value';

const courseController: Router = Router();
const safe = ExpressUtil.safeMiddleware;

courseController.get("/", safe(async (req: Request, res: Response) => {
    const engines = await EntityQuery.from("Engine").cache().queryList();
    Screen.create("course/engines", req, res).appendContext({
        headerTitle: "Courses: Engines",
        engines: engines
    }).renderQuietly();
}));

courseController.get("/list/:engineId", safe(async (req: Request, res: Response) => {
    const engine = await EntityQuery.from("Engine").cache().where({ "engineId": req.params.engineId }).queryFirst();
    const courses = await EntityQuery.from("Course").where({ "engineId": engine.get("engineId") })
        .cache().orderBy("-createdStamp").queryList();
    Screen.create("course/list", req, res).appendContext({
        headerTitle: "Courses: " + engine.get("name"),
        courses: courses
    }).renderQuietly();
}));

courseController.get('/create', (req: Request, res: Response) => {
    Screen.create('course/create', req, res).appendContext({
        headerTitle: "Create Course"
    }).renderQuietly();
});

courseController.get('/join/:courseId', safe(async (req: Request, res: Response) => {
    const course = await EntityQuery.from("Course").where({ "courseId": req.params.courseId }).queryFirst();
    const userLoginCourse = await EntityQuery.from("UserLoginCourse")
        .where({ "courseId": req.params.courseId, "userLoginId": req.session!.userLoginId }).queryFirst();
    if (course) {
        if (!userLoginCourse) {
            await new GenericValue("UserLoginCourse", {
                "courseId": req.params.courseId,
                "userLoginId": req.session!.userLoginId
            }).insert();
        }
        res.redirect(req.baseUrl + "/" + req.params.courseId);
    } else {
        throw new Error("That course does not exist.");
    }
}));

courseController.get('/:courseId', safe(async (req: Request, res: Response) => {
    const course = await EntityQuery.from("Course").where({ "courseId": req.params.courseId }).queryFirst();
    Screen.create('course/index', req, res).appendContext({
        headerTitle: course.get("name"),
        course: course
    }).renderQuietly();
}));

export { courseController };