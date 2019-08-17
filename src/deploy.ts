///<reference path='./framework/core/types.d.ts'/>

import Config from './framework/config/base.config';
import CustomConfig from './app/config/custom.config';
import app from './app/core/app';
import Debug from './framework/utils/debug.util';
import DatabaseUtil from './framework/utils/database.util';

Config.databaseConfig = CustomConfig.database;
Config.cookieSettings = CustomConfig.cookieSettings;

DatabaseUtil.init();

const server = app.listen(app.get('port'), () => {
    Debug.logInfo(`App is running at http://localhost:${app.get('port')} in ${app.get('env')} mode`, 'Deploy');
});

export default server;