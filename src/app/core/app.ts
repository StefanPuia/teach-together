import * as express from 'express';
import session from 'express-session';
import expressWs from 'express-ws';
import cookieParser from 'cookie-parser';
const MySQLStore = require('connect-mysql')(session);

import app from '../../framework/core/app';
import BaseConfig from '../config/base.config';

import loginController from '../controllers/login.controller';
import mainController from '../controllers/main.controller';
import courseController from '../controllers/course.controller';
import apiController from '../controllers/api.controller';
import websocketcontroller from '../controllers/websocket.controller';
import SecurityUtil from '../utils/security.util';
import BaseUtil from '../utils/base.util';
import morgan = require('morgan');
import ExpressUtil from '../utils/express.util';

app.use(morgan(BaseUtil.morgan, {
    skip: BaseUtil.morganSkip
}));

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
app.use(SecurityUtil.addUserPref);
app.use('/', SecurityUtil.ensureLogin, mainController);
app.use('/course', SecurityUtil.ensureLogin, courseController);
app.use('/api', SecurityUtil.ensureLogin, apiController);

app.use(ExpressUtil.handleNotFound);

export default app;