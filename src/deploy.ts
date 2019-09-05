///<reference path='./framework/core/types.d.ts'/>

import BaseConfig from './app/config/base.config';
import app from './app/core/app';
import Debug from './framework/utils/debug.util';
import DatabaseUtil from './framework/utils/database.util';

DatabaseUtil.init(BaseConfig.database);

const server = app.listen(app.get('port'), () => {
    Debug.logInfo(`App is running at http://localhost:${app.get('port')} in ${app.get('env')} mode`, 'Deploy');
});

export default server;