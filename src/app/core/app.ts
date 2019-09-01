import errorHandler from 'errorhandler';
import app from '../../framework/core/app';
import Config from '../../framework/config/base.config';
import CustomConfig from '../config/custom.config';

import mainController from '../controllers/main.controller';
import courseController from '../controllers/course.controller';
import apiController from '../controllers/api.controller';
import websocketcontroller from '../controllers/websocket.controller';
import expressWs from 'express-ws';
import * as express from 'express';
import { Request } from 'express';
import { NextFunction } from 'connect';

const webSocketInstance = expressWs(app);
app.use(errorHandler());
app.set('views', [Config.viewsLocation, CustomConfig.viewsLocation]);
app.use('/static', express.static(CustomConfig.staticLocation));

app.use('/', mainController);
app.use('/course', courseController);
app.use('/api', apiController);
websocketcontroller(webSocketInstance.app);

export default app;