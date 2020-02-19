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
        "type": EntityEngine.DATA_TYPE.NUMBER,
        "autoIncrement": true,
        "primaryKey": true
    }, {
        "name": "name",
        "type": EntityEngine.DATA_TYPE.DESCRIPTION,
        "notNull": true
    }, {
        "name": "description",
        "type": EntityEngine.DATA_TYPE.DESCRIPTION
    }, {
        "name": "picture",
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
}, {
    "name": "user_login_course",
    "type": "TABLE",
    "fields": [{
        "name": "user_login_id",
        "type": EntityEngine.DATA_TYPE.NUMBER,
        "primaryKey": true
    }, {
        "name": "course_id",
        "type": EntityEngine.DATA_TYPE.NUMBER,
        "primaryKey": true
        }],
    "foreignKeys": [{
        "name": "user_login_course_user",
        "field": "user_login_id",
        "reference": {
            "field": "user_login_id",
            "table": "user_login"
        },
        "onDelete": "restrict",
        "onUpdate": "restrict"
    }, {
        "name": "user_login_course_course",
        "field": "course_id",
        "reference": {
            "field": "course_id",
            "table": "course"
        },
        "onDelete": "restrict",
        "onUpdate": "restrict"
    }]
}, {
    "name": "course_owner",
    "type": "TABLE",
    "fields": [{
        "name": "user_login_id",
        "type": EntityEngine.DATA_TYPE.NUMBER,
        "primaryKey": true
    }, {
        "name": "course_id",
        "type": EntityEngine.DATA_TYPE.NUMBER,
        "primaryKey": true
        }],
    "foreignKeys": [{
        "name": "course_owner_user",
        "field": "user_login_id",
        "reference": {
            "field": "user_login_id",
            "table": "user_login"
        },
        "onDelete": "restrict",
        "onUpdate": "restrict"
    }, {
        "name": "course_owner_course",
        "field": "course_id",
        "reference": {
            "field": "course_id",
            "table": "course"
        },
        "onDelete": "restrict",
        "onUpdate": "restrict"
    }]
}, {
    "name": "course_snapshot",
    "type": "TABLE",
    "fields": [{
        "name": "course_id",
        "type": EntityEngine.DATA_TYPE.NUMBER,
        "primaryKey": true
    }, {
        "name": "timestamp",
        "type": EntityEngine.DATA_TYPE.TIMESTAMP,
        "primaryKey": true
    }, {
        "name": "editor_value",
        "type": EntityEngine.DATA_TYPE.TEXT
    }, {
        "name": "deltas",
        "type": EntityEngine.DATA_TYPE.TEXT
    }],
    "foreignKeys": [{
        "name": "course_snapshot_course",
        "field": "course_id",
        "reference": {
            "field": "course_id",
            "table": "course"
        },
        "onDelete": "restrict",
        "onUpdate": "restrict"
    }]
}, {
    "name": "chat_log",
    "type": "TABLE",
    "fields": [{
        "name": "course_id",
        "type": EntityEngine.DATA_TYPE.NUMBER,
        "primaryKey": true
    }, {
        "name": "id",
        "type": EntityEngine.DATA_TYPE.ID_LONG,
        "primaryKey": true
    }, {
        "name": "timestamp",
        "type": EntityEngine.DATA_TYPE.TIMESTAMP
    }, {
        "name": "user_login_id",
        "type": EntityEngine.DATA_TYPE.NUMBER
    }, {
        "name": "text",
        "type": EntityEngine.DATA_TYPE.TEXT
    }],
    "foreignKeys": [{
        "name": "chat_log_course",
        "field": "course_id",
        "reference": {
            "field": "course_id",
            "table": "course"
        },
        "onDelete": "restrict",
        "onUpdate": "restrict"
    }, {
        "name": "chat_log_user",
        "field": "user_login_id",
        "reference": {
            "field": "user_login_id",
            "table": "user_login"
        },
        "onDelete": "restrict",
        "onUpdate": "restrict"
    }]
}]

export { EntityDefinitions };