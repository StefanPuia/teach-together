import { Router, Request, Response } from 'express';
import { Screen } from '../core/screen';
import { EntityDynamicQuery } from '../../framework/core/engine/entity/entity.dynamic.query';
import { ExpressUtil } from '../../framework/utils/express.util';

const mainController: Router = Router();
const safe = ExpressUtil.safeMiddleware;

mainController.get('/', safe(async (req: Request, res: Response) => {
    const courses = await EntityDynamicQuery.select("ULC.userLoginId", "C.*")
        .from("ULC", "UserLoginCourse")
        .innerJoin("C", "Course", "courseId", "ULC.courseId")
        .where({ "ULC.userLoginId": req.session!.userLoginId })
        .queryList();

    Screen.create('main/index', req, res).appendContext({
        courses: courses
    }).renderQuietly();
}));

export { mainController };