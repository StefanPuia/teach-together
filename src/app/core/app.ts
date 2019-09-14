import * as express from 'express';
import expressWs from 'express-ws';

import { app } from '../../framework/core/app';
import { BaseConfig } from '../config/base.config';

import { loginController } from '../controllers/login.controller';
import { mainController } from '../controllers/main.controller';
import { courseController } from '../controllers/course.controller';
import { userController } from '../controllers/user.controller';
import { apiController } from '../controllers/api.controller';
import { websocketHandler } from '../controllers/websocket.controller';
import { SecurityUtil } from '../utils/security.util';
import { ExpressUtil } from '../utils/express.util';

const webSocketInstance = expressWs(app);
websocketHandler(webSocketInstance.app);

app.set('views', [BaseConfig.viewsLocation, BaseConfig.viewsLocation]);
app.use('/static', express.static(BaseConfig.staticLocation));

app.use('/', loginController);
app.use(SecurityUtil.addUserPref);
app.use('/', SecurityUtil.ensureLogin, mainController);
app.use('/course', SecurityUtil.ensureLogin, courseController);
app.use('/user', SecurityUtil.ensureLogin, userController);
app.use('/api', SecurityUtil.ensureLogin, apiController);

app.use(ExpressUtil.handleNotFound);

export { app };