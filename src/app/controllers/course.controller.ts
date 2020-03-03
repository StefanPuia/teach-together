import { Router, Request, Response } from 'express';
import { Screen } from '../core/screen';
import { ExpressUtil } from '../utils/express.util';
import { EntityQuery } from '../../framework/core/engine/entity/entity.query';
import { GenericValue } from '../../framework/core/engine/entity/generic.value';
import { EntityDynamicQuery } from '../../framework/core/engine/entity/entity.dynamic.query';
import { CourseWebsocketController } from './websocket/course.ws';
import { ConditionBuilder } from '../../framework/core/engine/entity/condition.builder';
import { EntityEngine } from '../../framework/core/engine/entity/entity.engine';

const courseController: Router = Router();
const safe = ExpressUtil.safeMiddleware;

courseController.get("/", safe(async (req: Request, res: Response) => {
    const query = `select E.*, count(1) as courses
        from engine as E
        inner join course using(engine_id)
        group by E.engine_id`;
    const engines = await EntityEngine.transactPromise(query, [], true, true);
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
        courses: courses.map(course => course.getData())
    }).renderQuietly();
}));

courseController.get('/create', safe(async (req: Request, res: Response) => {
    const engines = await EntityQuery.from("Engine").queryList();
    Screen.create('course/create', req, res).appendContext({
        headerTitle: "Create Course",
        engines: engines.map(eng => eng.getData())
    }).renderQuietly();
}));

courseController.post('/create', safe(async (req: Request, res: Response) => {
    const engines = await EntityQuery.from("Engine").queryList();
    try {
        const courseId = await new GenericValue("Course", {
            name: req.body.courseTitle,
            description: req.body.courseDescription,
            picture: req.body.coursePicture,
            engineId: req.body.courseEngine,
            visibility: false,
            createdBy: req.session!.userLoginId
        }).insert();
        const additionalOwners = (req.body.courseOwners || "").split(",");
        const userCond = ConditionBuilder.create().in("userName", additionalOwners);
        const users = await EntityQuery.from("UserLogin").where(userCond).queryList();
        const ownerLoginIds = [req.session!.userLoginId].concat(users.map(user => user.get("userLoginId")));
        const courseOwners = ownerLoginIds.map(ownerLoginId => {
            return new GenericValue("CourseOwner", {
                userLoginId: ownerLoginId,
                courseId: courseId
            })
        });
        await EntityEngine.insert(courseOwners);
        res.redirect(req.baseUrl + "/" + courseId);
    } catch (err) {
        Screen.create('course/create', req, res).appendContext({
            headerTitle: "Create Course",
            engines: engines.map(eng => eng.getData()),
            error: err.message
        }).renderQuietly();
    }
}));

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
    const user = await EntityQuery.from("UserLogin").where({ "userLoginId": req.session!.userLoginId }).cache().queryFirst();
    const course = await EntityDynamicQuery.from("C", "Course")
            .select("C.*", "E.*")
            .innerJoin("E", "Engine", "engineId", "C.engineId")
            .where({ "courseId": req.params.courseId })
            .cache().queryFirst();
    const owners = await EntityQuery.from("CourseOwner").where({ "courseId": course.get("courseId") }).cache().queryList();
    const latest = await EntityQuery.from("CourseSnapshot").where({ "courseId": course.get("courseId") }).orderBy("-timestamp").queryFirst();

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

    const ownerConnected = await CourseWebsocketController.anotherOwnerConnected(course.get("courseId"));

    Screen.create('course/index', req, res).appendContext({
        headerTitle: course.get("name"),
        course: course.getData(),
        isOwner: !!owners.find(own => own.get("userLoginId") === req.session!.userLoginId),
        ownerConnected: ownerConnected,
        editorValue: latest ? latest.get("editorValue") : "",
        userAvatar: user ? user.get("picture") : undefined,
        chatLog: messages
    }).renderQuietly();
}));

export { courseController };