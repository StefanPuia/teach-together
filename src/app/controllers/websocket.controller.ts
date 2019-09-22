import * as expressWs from 'express-ws';
import { DebugUtil } from '../../framework/utils/debug.util';

function websocketHandler(app: expressWs.Application) {
    let clients: GenericObject = {
        course: {}
    };

    app.ws('/course/:courseId', (ws: any, req: any) => {
        ws.on('error', (err: any) => { DebugUtil.logError(err, "Controller.WebSocket"); });

        let courseId = req.params.courseId;
        if (!clients.course[courseId]) {
            clients.course[courseId] = [];
        }
        clients.course[courseId].push(ws);

        ws.on('message', (message: any) => {
            let data = JSON.parse(message);
            switch (data.channel) {
                case "chat":
                    data.text = data.text.replace(/</g, "&lt;");
                    break;
            }
            sendResponse(data, clients.course[courseId], ws);
        })
    })
}

function sendResponse(message: any, clients: Array<any>, ws: any) {
    for (let client of clients) {
        if (client.readyState === client.OPEN && client !== ws) {
            client.send(JSON.stringify(message));
        }
    }
}

export { websocketHandler };