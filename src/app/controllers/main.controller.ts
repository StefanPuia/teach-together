import { Router, Request, Response } from 'express';
import { Screen } from '../core/screen';
import { EntityDynamicQuery } from '../../framework/core/engine/entity/entity.dynamic.query';
import { ExpressUtil } from '../../framework/utils/express.util';
import { EntityQuery } from '../../framework/core/engine/entity/entity.query';
import { ConditionBuilder } from '../../framework/core/engine/entity/condition.builder';
import { SecurityUtil } from '../utils/security.util';

const mainController: Router = Router();
const safe = ExpressUtil.safeMiddleware;

mainController.get('/', safe(async (req: Request, res: Response) => {
    const userLoginId = req.session!.userLoginId;
    const createdCourses = await EntityDynamicQuery.select("CO.userLoginId", "C.*", "E.name as engineName")
            .from("CO", "CourseOwner")
            .innerJoin("C", "Course", "courseId", "CO.courseId")
            .innerJoin("E", "Engine", "engineId", "C.engineId")
            .where({ "CO.userLoginId": userLoginId })
            .queryList();

    const joinedCond = ConditionBuilder.create()
            .eq("ULC.userLoginId", userLoginId)
            .notEq("C.createdBy", userLoginId)
    const joinedCourses = await EntityDynamicQuery.select("ULC.userLoginId", "C.*")
        .from("ULC", "UserLoginCourse")
        .innerJoin("C", "Course", "courseId", "ULC.courseId")
        .where(joinedCond)
        .queryList();

    Screen.create('main/index', req, res).appendContext({
        joinedCourses: joinedCourses.map(course => course.getData()),
        createdCourses: createdCourses.map(course => course.getData())
    }).renderQuietly();
}));

mainController.get('/feedback', SecurityUtil.ensurePermission("SUPER_VIEW"), safe(async (req: Request, res: Response) => {
    const feedback = await EntityQuery.from("Feedback").queryList();
    Screen.create('main/feedback', req, res).appendContext({
        feedback: feedback.map(fb => fb.getData())
    }).renderQuietly();
}));

export { mainController };