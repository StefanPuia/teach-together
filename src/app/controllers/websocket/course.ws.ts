import { WSController } from '../../../framework/core/engine/websocket.engine';
import WebSocket from 'ws';
import { Request } from 'express';
import http from 'http';

export class CourseWebsocketController extends WSController {
    protected route: string = "/course/:courseId";
    protected static instance: CourseWebsocketController;
    private clients: GenericObject = {
        course: {}
    };

    protected onConnect(ws: WebSocket, req: Request): void {
        let courseId = req.params.courseId;
        if (!this.clients.course[courseId]) {
            this.clients.course[courseId] = [];
        }
        this.clients.course[courseId].push(ws);
    }

    protected onMessage(ws: WebSocket, req: Request, data: WebSocket.Data): void {
        let courseId = req.params.courseId;
        let message = JSON.parse(data.toString());
        switch (message.channel) {
            case "chat":
                message.text = message.text.replace(/</g, "&lt;");
                break;
        }
        this.sendResponse(data, this.clients.course[courseId], ws);
    }

    protected getRoute() {
        return this.route;
    }

    protected onClose(ws: WebSocket, req: Request, code: number, reason: string): void {}
    protected onUpgrade(ws: WebSocket, req: Request): void {}
    protected onOpen(ws: WebSocket, req: Request): void {}
    protected onPing(ws: WebSocket, req: Request, data: Buffer): void {}
    protected onPong(ws: WebSocket, req: Request, data: Buffer): void {}
    protected onUnexpected(ws: WebSocket, req: Request, request: http.ClientRequest, response: http.IncomingMessage): void {}

    private sendResponse(message: any, clients: Array<any>, ws: any) {
        for (let client of clients) {
            if (client.readyState === client.OPEN && client !== ws) {
                client.send(message);
            }
        }
    }
}