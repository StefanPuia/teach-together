///<reference path='./framework/core/types/index.d.ts'/>

import { DebugUtil } from './framework/utils/debug.util';
import { BaseConfig } from './app/config/base.config';
import { BaseConfig as FrameworkBaseConfig } from './framework/config/base.config';
FrameworkBaseConfig.logLevel = DebugUtil.TIMING;
FrameworkBaseConfig.cookieSettings = BaseConfig.cookieSettings;
FrameworkBaseConfig.databaseConfig = BaseConfig.database;
FrameworkBaseConfig.logFullQuery = true;
FrameworkBaseConfig.morganExtraIgnore = BaseConfig.morganExtraIgnore;
FrameworkBaseConfig.enableFrameworkController = true;
FrameworkBaseConfig.passwordSalt = BaseConfig.passwordSalt;

import { LabelUtil } from './framework/utils/label.util';
import { BaseLabels } from './framework/config/base.labels';
import { ServiceEngine } from './framework/core/engine/service.engine';
import { ServiceLoad } from './framework/config/service.load.config';
import { EntityLoad as EntityLoadFramework} from './framework/config/entity.load.config';
import { EntityLoad } from './app/config/entity.load.config';
import { EntityEngine } from './framework/core/engine/entity/entity.engine';
import { DatabaseUtil } from './framework/utils/database.util';
import { app } from './app/core/app';

import * as fs from 'fs';
import path from 'path';

LabelUtil.append(BaseLabels);
ServiceEngine.append(ServiceLoad);

const entityDefinitions = EntityLoadFramework.concat(EntityLoad);
DatabaseUtil.init(BaseConfig.database, BaseConfig.databaseFormatMode, entityDefinitions, () => {
    if (BaseConfig.databaseFormatMode == EntityEngine.MODE.REBUILD) {
        const seedData = fs.readFileSync(path.join(__dirname, '../seed-data.sql'), "utf8")
        DatabaseUtil.transactPromise(seedData).then(data => {
            console.log(data);
            DebugUtil.logInfo("Seed data loaded", "SeedData");
        }).catch(err => {
            DebugUtil.logError(err, "SeedData");
        });
    }
});

const server = app.listen(app.get('port'), () => {
    DebugUtil.logInfo(`App is running at http://localhost:${app.get('port')} in ${app.get('env')} mode`, 'Deploy');
});

export default server;