import { EntityEngine } from '../../../framework/core/engine/entity/entity.engine';

const EntityDefinitions: Array<EntityDefinition> = [{
    "name": "engine",
    "type": "TABLE",
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
}, {
    "name": "course",
    "type": "TABLE",
    "fields": [{
        "name": "course_id",
        "type": EntityEngine.DATA_TYPE.ID_SHORT,
        "notNull": true,
        "unique": true
    }, {
        "name": "name",
        "type": EntityEngine.DATA_TYPE.DESCRIPTION,
        "notNull": true
    }, {
        "name": "description",
        "type": EntityEngine.DATA_TYPE.DESCRIPTION
    }, {
        "name": "engine_id",
        "type": EntityEngine.DATA_TYPE.ID_SHORT
    }, {
        "name": "visibility",
        "type": "INT(1)"
    }, {
        "name": "created_by",
        "type": EntityEngine.DATA_TYPE.NUMBER,
        "notNull": true
    }],
    "foreignKeys": [{
        "name": "course_created_by_user",
        "field": "created_by",
        "reference": {
            "field": "user_login_id",
            "table": "user_login"
        },
        "onDelete": "restrict",
        "onUpdate": "restrict"
    }, {
        "name": "course_engine",
        "field": "engine_id",
        "reference": {
            "field": "engine_id",
            "table": "engine"
        },
        "onDelete": "restrict",
        "onUpdate": "restrict"
    }]
}]

export { EntityDefinitions };