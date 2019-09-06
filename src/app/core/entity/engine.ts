import { GenericValue } from '../../../framework/core/entity/generic.value';
import DatabaseUtil from '../../../framework/utils/database.util';
export class Engine extends GenericValue {
    public static readonly entity: string = "engine";
    public readonly entity: string = Engine.entity;
    protected readonly primaryKeyField: string = "engine_id";
    protected data?: any;

    public static create(): Engine {
        return new Engine();
    }

    public static readonly definition: EntityDefinition = {
        "name": "engine",
        "fields": [{
            "name": "engine_id",
            "type": DatabaseUtil.DATA_TYPE.ID_SHORT,
            "primaryKey": true,
            "notNull": true,
            "unique": true
        }, {
            "name": "name",
            "type": DatabaseUtil.DATA_TYPE.ID_LONG,
            "notNull": true
        }, {
            "name": "description",
            "type": DatabaseUtil.DATA_TYPE.DESCRIPTION
        }, {
            "name": "courses",
            "type": "int",
            "default": "0"
        }, {
            "name": "picture",
            "type": DatabaseUtil.DATA_TYPE.DESCRIPTION
        }, {
            "name": "colour",
            "type": DatabaseUtil.DATA_TYPE.ID_LONG
        }]
    };

    public find(id: string): Promise<Engine> {
        return this.doSelect(id, false);
    }

    public static findAll(condition: string = "", inserts: any[] = []): Promise<Engine[]> {
        return new Promise((resolve, reject) => {
            this.doSelectAll(Engine.entity, condition, inserts).then(results => {
                let engines: Array<Engine> = [];
                for(let engine of results) {
                    let engineObject = new Engine();
                    engineObject.setData(engine);
                    engines.push(engineObject);
                }
                resolve(engines);
            }).catch(reject);
        });
    }
}