import * as expressWs from 'express-ws';
import { DebugUtil } from '../../framework/utils/debug.util';

function sendAll(data: any) {
    for(let client of clients) {
        if (client.roomId == data.room && client.readyState === client.OPEN) {
            client.send(JSON.stringify(data));
        }
    }
}

let clients: any = [];

function websocketHandler(app: expressWs.Application) {
    app.ws('/:roomid', (ws: any, req: any) => {
        ws.roomId = req.params.roomid;
        clients.push(ws);

        // error handling WIP
        ws.on('error', DebugUtil.logError);

        // listen for messages
        ws.on('message', function incoming(message: any) {
            let data = JSON.parse(message);
            sendAll(data);
        })
    })
}

export { websocketHandler };