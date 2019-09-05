import cookieParser from 'cookie-parser';
import session from 'express-session';
const MySQLStore = require('connect-mysql')(session);

import app from '../../framework/core/app';
import BaseConfig from '../config/base.config';

import loginController from '../controllers/login.controller';
import mainController from '../controllers/main.controller';
import courseController from '../controllers/course.controller';
import apiController from '../controllers/api.controller';
import websocketcontroller from '../controllers/websocket.controller';
import expressWs from 'express-ws';
import * as express from 'express';
import SecurityUtil from '../utils/security.util';

app.use(cookieParser());
app.use(session({
    secret: BaseConfig.cookieSettings.secret,
    cookie: BaseConfig.cookieSettings.cookie,
    store: new MySQLStore({
        config: BaseConfig.database
    })
}));

const webSocketInstance = expressWs(app);
websocketcontroller(webSocketInstance.app);

app.set('views', [BaseConfig.viewsLocation, BaseConfig.viewsLocation]);
app.use('/static', express.static(BaseConfig.staticLocation));

app.use('/', loginController);
app.use('/', SecurityUtil.ensureLogin, mainController);
app.use('/course', SecurityUtil.ensureLogin, courseController);
app.use('/api', SecurityUtil.ensureLogin, apiController);

export default app;