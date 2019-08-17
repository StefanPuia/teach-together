import errorHandler from 'errorhandler';
import app from '../../framework/core/app';
import Config from '../../framework/config/base.config';
import CustomConfig from '../config/custom.config';

import mainController from '../controllers/main.controller';

app.use(errorHandler());
app.set('views', [Config.viewsLocation, CustomConfig.viewsLocation])

app.use('/', mainController);

export default app;