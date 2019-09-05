///<reference path='./framework/core/types.d.ts'/>

import Debug from './framework/utils/debug.util';

import BaseConfig from './app/config/base.config';
import FrameworkBaseConfig from './framework/config/base.config';
FrameworkBaseConfig.logLevel = Debug.INFO;

import DatabaseUtil from './framework/utils/database.util';
import app from './app/core/app';

import { User } from './app/core/entity/user';
import { Course } from './app/core/entity/course';

DatabaseUtil.init(BaseConfig.database, BaseConfig.databaseFormatMode, [
    User.definition,
    Course.definition
]);

const server = app.listen(app.get('port'), () => {
    Debug.logInfo(`App is running at http://localhost:${app.get('port')} in ${app.get('env')} mode`, 'Deploy');
});

export default server;