import { Router, Request, Response } from 'express';
import Executor from '../core/executor';
import { ExpressUtil } from '../utils/express.util';
import { GenericValue } from '../../framework/core/engine/entity/generic.value';
import { EntityQuery } from '../../framework/core/engine/entity/entity.query';

const apiController: Router = Router();
const safeJSON = ExpressUtil.safeJSONMiddleware;

apiController.post('/execute/:courseId', (req: Request, res: Response) => {
    Executor.executeJavaScript(req, res);
})

apiController.post('/append/:courseId', safeJSON(async (req: Request, res: Response) => {
    const course = await EntityQuery.from("Course").where({ "courseId": req.params.courseId }).queryFirst();
    const value = new GenericValue("CourseSnapshot", {
        courseId: course.get("courseId"),
        timestamp: new Date(req.body.timestamp),
        editorValue: req.body.value,
        deltas: req.body.deltas
    })
    await value.insert();
    res.json({ status: "ok" });
}))

export { apiController };