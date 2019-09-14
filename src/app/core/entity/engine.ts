import { GenericValue } from '../../../framework/core/generic.value';
import { EntityEngine } from '../../../framework/core/engine/entity.engine';

export class Engine extends GenericValue {
    public static readonly entity: string = "engine";
    public readonly entity: string = Engine.entity;
    protected readonly primaryKeyField: string = "engine_id";
    protected data?: engineData;

    public static create(): Engine {
        return new Engine();
    }

    public static readonly definition: EntityDefinition = {
        "name": "engine",
        "fields": [{
            "name": "engine_id",
            "type": EntityEngine.DATA_TYPE.ID_SHORT,
            "primaryKey": true,
            "notNull": true,
            "unique": true
        }, {
            "name": "name",
            "type": EntityEngine.DATA_TYPE.ID_LONG,
            "notNull": true
        }, {
            "name": "description",
            "type": EntityEngine.DATA_TYPE.DESCRIPTION
        }, {
            "name": "courses",
            "type": "int",
            "default": "0"
        }, {
            "name": "picture",
            "type": EntityEngine.DATA_TYPE.DESCRIPTION
        }, {
            "name": "colour",
            "type": EntityEngine.DATA_TYPE.ID_LONG
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

interface engineData {
    engine_id: string,
    name: string,
    description: string,
    courses: number,
    picture: string,
    colour: string
}