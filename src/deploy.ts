///<reference path='./framework/core/types.d.ts'/>

import Debug from './framework/utils/debug.util';

import BaseConfig from './app/config/base.config';
import FrameworkBaseConfig from './framework/config/base.config';
FrameworkBaseConfig.logLevel = Debug.TIMING;
FrameworkBaseConfig.logFullQuery = true;

import DatabaseUtil from './framework/utils/database.util';
import app from './app/core/app';

import { User } from './app/core/entity/user';
import { Course } from './app/core/entity/course';
import * as fs from 'fs';
import path from 'path';
import { Engine } from './app/core/entity/engine';

DatabaseUtil.init(BaseConfig.database, BaseConfig.databaseFormatMode, [
    User.definition,
    Engine.definition,
    Course.definition
], () => {
    if (BaseConfig.databaseFormatMode == DatabaseUtil.MODE.REBUILD) {
        const seedData = fs.readFileSync(path.join(__dirname, '../seed-data.sql'), "utf8")
        DatabaseUtil.transactPromise(seedData).then(data => {
            console.log(data);
            Debug.logInfo("Seed data loaded", "SeedData");
        }).catch(err => {
            Debug.logError(err, "SeedData");
        });
    }
});

const server = app.listen(app.get('port'), () => {
    Debug.logInfo(`App is running at http://localhost:${app.get('port')} in ${app.get('env')} mode`, 'Deploy');
});

export default server;