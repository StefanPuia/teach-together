import { WSController, WSEngine } from '../../../framework/core/engine/websocket.engine';
import WebSocket from 'ws';
import { Request } from 'express';
import http from 'http';
import { GenericValue } from '../../../framework/core/engine/entity/generic.value';
import { DebugUtil } from '../../../framework/utils/debug.util';
import { EntityQuery } from '../../../framework/core/engine/entity/entity.query';
import { ServiceUtil } from '../../../framework/utils/service.util';
import { TypeEngine } from '../../../framework/core/engine/type.engine';
import { ConditionBuilder } from '../../../framework/core/engine/entity/condition.builder';

export class CourseWebsocketController extends WSController {
    protected route: string = "/course/:courseId";
    private static instance: CourseWebsocketController;
    private courses: WebSocketStorage = {};
    public static readonly module = "CourseWebsocketController";

    private constructor() { super(); };
    public static init() {
        if (!CourseWebsocketController.instance) {
            this.instance = new CourseWebsocketController();
            this.instance.init();
        }
    }

    protected async onConnect(ws: WebSocket, req: Request) {
        try {
            let courseId = req.params.courseId;
            if (!this.courses[courseId]) {
                this.courses[courseId] = [];
            }
            const userLoginId = req.session!.userLoginId;
            const isOwner = await CourseWebsocketController.isCourseOwner(courseId, userLoginId);
            const ownerConnected = await CourseWebsocketController.anotherOwnerConnected(courseId);
            this.courses[courseId].push({
                ws: ws,
                req: req,
                userLoginId: userLoginId,
                isOwner: isOwner
            });
            setTimeout(() => {
                if (isOwner && !ownerConnected) {
                    this.sendResponse({ channel: "ownerDC", userLoginId: userLoginId }, ws);
                }
                this.sendOwnersListOfMembers(courseId);
            }, 1000);
        } catch (err) {
            DebugUtil.logError(err, CourseWebsocketController.module, req.path);
        }
    }

    protected async onMessage(ws: WebSocket, req: Request, data: WebSocket.Data) {
        try {
            let courseId = req.params.courseId;
            let message = JSON.parse(data.toString());
            const isOwner = await CourseWebsocketController.isCourseOwner(courseId, message.userLoginId);
            switch (message.channel) {
                case "chat":
                    message.text = message.text.replace(/</g, "&lt;");
                    message.ownerMessage = isOwner;
                    new GenericValue("ChatLog", {
                        courseId: courseId,
                        id: message.id,
                        timestamp: message.timestamp,
                        userLoginId: message.userLoginId,
                        text: message.text
                    }).insert().catch(err => {
                        DebugUtil.logError(err, "CourseWebSocket.ChatLog", req.path);
                    });
                    break;
            }
            this.sendResponse(message, this.courses[courseId]);
        } catch (err) {
            DebugUtil.logError(err, CourseWebsocketController.module, req.path);
        }
    }

    protected getRoute() {
        return this.route;
    }

    protected async onClose(ws: WebSocket, req: Request, code: number, reason: string) {
        try {
            const courseId = req.params.courseId;
            const userLoginId = req.session!.userLoginId;
            const isOwner = await CourseWebsocketController.isCourseOwner(courseId, userLoginId);
            const closedIndex = this.courses[courseId].findIndex(client => client.ws === ws);
            const nextOwner = await this.findOwnerConnected(courseId);
            this.courses[courseId].splice(closedIndex, 1);
            if (isOwner && nextOwner) {
                this.sendResponse({ channel: "ownerDC", userLoginId: userLoginId }, nextOwner.ws);
            }
            this.sendOwnersListOfMembers(courseId);
        } catch (err) {
            DebugUtil.logError(err, CourseWebsocketController.module, req.path);
        }
    }
    protected onUpgrade(ws: WebSocket, req: Request): void {}
    protected onOpen(ws: WebSocket, req: Request): void {}
    protected onPing(ws: WebSocket, req: Request, data: Buffer): void {}
    protected onPong(ws: WebSocket, req: Request, data: Buffer): void {}
    protected onUnexpected(ws: WebSocket, req: Request, request: http.ClientRequest, response: http.IncomingMessage): void {}

    private sendResponse(message: any, ws: WebSocket): void;
    private sendResponse(message: any, clients: Array<WebSocketEntry>): void;
    private sendResponse(message: any, clients: Array<WebSocketEntry>, ignore: WebSocket): void;
    private sendResponse(message: any, clients: Array<WebSocketEntry>, predicate: Function): void;
    private sendResponse(message: any, clientsOrWs: Array<WebSocketEntry> | WebSocket, ignorePredicate?: WebSocket | Function): void {
        if (ignorePredicate) {
            if (ignorePredicate instanceof WebSocket && clientsOrWs instanceof Array) {
                for (const client of clientsOrWs.filter(client => client.ws !== ignorePredicate)) {
                    WSEngine.safeSend(client.ws, message);
                }
            } else if (ignorePredicate instanceof Function && clientsOrWs instanceof Array) {
                for (const client of clientsOrWs.filter((client: WebSocketEntry) => {
                    return ignorePredicate(client);
                })) {
                    WSEngine.safeSend(client.ws, message);
                }
            }
        } else if (!(clientsOrWs instanceof Array)) {
            WSEngine.safeSend(clientsOrWs, message);
        } else {
            for (const client of clientsOrWs) {
                WSEngine.safeSend(client.ws, message);
            }
        }
    }

    private async findOwnerConnected(courseId: string) {
        if (this.courses[courseId]) {
            return this.courses[courseId].find(entry => entry.isOwner && entry.ws.readyState === entry.ws.OPEN);
        }
        return false;
    }

    public static async anotherOwnerConnected(courseId: string) {
        const owner = await this.instance.findOwnerConnected(courseId);
        return !!owner
    }

    private static async isCourseOwner(courseId: string, userLoginId: string) {
        try {
            const result = await ServiceUtil.runSync("IsCourseOwner", {
                userLoginId: TypeEngine.convert(userLoginId, "number"),
                courseId: courseId
            }, true, true);
            return result.isOwner;
        } catch (err) {
            DebugUtil.logError(err, CourseWebsocketController.module);
            return false;
        }
    }

    private async sendOwnersListOfMembers(courseId: string) {
        const clients = this.courses[courseId];
        const userIds: Array<any> = clients.map(client => client.userLoginId).filter((value, index, self) => self.indexOf(value) === index);
        const condition = ConditionBuilder.create().in("userLoginId", userIds);
        const users = clients.length ? await EntityQuery.from("UserLogin").where(condition).cache().queryList() : [];
        const members = clients.map(client => {
            const user = users.find(user => user.get("userLoginId") == client.userLoginId);
            return {
                id: client.userLoginId,
                picture: user ? user.get("picture") : undefined,
                isOwner: client.isOwner,
                name: user ? user.get("fullName") || user.get("userName") : ""
            }
        })
        this.sendResponse({ channel: "members", members: members }, clients,
            (client: WebSocketEntry) => client.isOwner && client.ws.readyState === client.ws.OPEN);
    }
}

type WebSocketStorage = {
    [group: string]: Array<WebSocketEntry>
}

type WebSocketEntry = {
    ws: WebSocket,
    req: Request,
    userLoginId: string,
    isOwner: boolean
}