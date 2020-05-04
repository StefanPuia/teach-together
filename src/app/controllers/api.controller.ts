import { Router, Request, Response } from 'express';
import Executor from '../core/executor';
import { ExpressUtil } from '../utils/express.util';
import { GenericValue } from '../../framework/core/engine/entity/generic.value';
import { EntityQuery } from '../../framework/core/engine/entity/entity.query';
import { SecurityUtil } from '../utils/security.util';
import { EntityEngine } from '../../framework/core/engine/entity/entity.engine';
import { EntityDynamicQuery } from '../../framework/core/engine/entity/entity.dynamic.query';

const apiController: Router = Router();
const safeJSON = ExpressUtil.safeJSONMiddleware;

apiController.post('/execute/:courseId', safeJSON(async (req: Request, res: Response) => {
    const course = await EntityQuery.from("Course").where({ "courseId": req.params.courseId }).queryFirst();
    Executor.execute(course.get("engineId"), req, res);
}));

apiController.post('/append/:courseId', safeJSON(async (req: Request, res: Response) => {
    const course = await EntityQuery.from("Course").where({ "courseId": req.params.courseId }).queryFirst();
    if (course.get("visibility") == true) {
        throw new Error(`Course has been published already.`);
    }
    const value = new GenericValue("CourseSnapshot", {
        courseId: course.get("courseId"),
        timestamp: new Date(req.body.timestamp),
        editorValue: req.body.value,
        deltas: req.body.deltas
    })
    await value.insert();
    res.json({ status: "ok" });
}))

apiController.delete('/chat/:courseId', safeJSON(async (req: Request, res: Response) => {
    const isCourseOwner = await SecurityUtil.isCourseOwner(req.params.courseId, req.session!.userLoginId);
    if (!isCourseOwner) {
        throw new Error(`Logged user not an owner to selected course.`);
    }
    const chatEntries = await EntityQuery.from("ChatLog").where({ "courseId": req.params.courseId }).queryList();
    await EntityEngine.delete(chatEntries);
    res.json({ status: "ok" });
}))

apiController.post('/stoprecording/:courseId', safeJSON(async (req: Request, res: Response) => {
    const course = await EntityQuery.from("Course").where({ "courseId": req.params.courseId }).queryFirst();
    const isCourseOwner = await SecurityUtil.isCourseOwner(req.params.courseId, req.session!.userLoginId);
    if (!isCourseOwner) {
        throw new Error(`Logged user not an owner to selected course.`);
    }
    course.set("visibility", true);
    course.update();
    res.json({ status: "ok" });
}))

apiController.get('/playback/:courseId', safeJSON(async (req: Request, res: Response) => {
    const dbSnapshots = await EntityQuery.from("CourseSnapshot").where({ "courseId": req.params.courseId }).orderBy("timestamp").queryList();
    const snapshots: Array<{t: number, d: any, q: number}> = dbSnapshots.map(s => JSON.parse(s.get("deltas"))).reduce((list, s) => { return [...list, ...s] }, []);
    if (snapshots.length) {
        snapshots[0].q = 0;
        for (let i = 1; i < snapshots.length; i++) {
            let size = snapshots[i].t - snapshots[i - 1].t;
            snapshots[i].q = size > 5000 ? 5000 : size;
        }
    }
    res.json({
        status: "ok",
        snapshots: snapshots
    });
}))

apiController.get('/chatlog/:courseId', safeJSON(async (req: Request, res: Response) => {
    const course = await EntityQuery.from("Course").where({ "courseId": req.params.courseId }).queryFirst();
    const owners = await EntityQuery.from("CourseOwner").where({ "courseId": course.get("courseId") }).cache().queryList();
    const chatLog = await EntityDynamicQuery.from("CL", "ChatLog")
        .select("UL.fullName", "UL.userName", "UL.picture", "CL.*")
        .innerJoin("UL", "UserLogin", "userLoginId", "CL.userLoginId")
        .where({ "CL.courseId": course.get("courseId") })
        .orderBy("CL.timestamp").queryList();
    const messages: Array<GenericObject> = [];

    for (const log of chatLog) {
        messages.push({
            id: log.get("id"),
            name: log.get("fullName") || log.get("userName"),
            avatar: log.get("picture"),
            text: log.get("text"),
            position: log.get("userLoginId") == req.session!.userLoginId ? "right" : "left",
            time: log.get("timestamp"),
            userLoginId: log.get("userLoginId"),
            ownerMessage: !!owners.find(own => own.get("userLoginId") == log.get("userLoginId"))
        });
    }
    res.json({
        status: "ok",
        chatLog: messages
    });
}))

export { apiController };