import { GenericValue } from '../../../framework/core/entity/generic.value';
import DatabaseUtil from '../../../framework/utils/database.util';
export class Course extends GenericValue {
    public static readonly entity: string = 'course';
    protected readonly entity: string = Course.entity;
    protected readonly primaryKeyField: string = 'course_id';
    protected data?: courseData;

    public static readonly VISIBILITY: {
        PUBLIC: 0,
        UNLISTED: 1,
        PRIVATE: 2
    }

    public static create(): Course {
        return new Course();
    }

    public static readonly definition: EntityDefinition = {
        "name": "course",
        "fields": [{
            "name": "course_id",
            "type": DatabaseUtil.DATA_TYPE.ID_SHORT,
            "notNull": true,
            "unique": true
        }, {
            "name": "name",
            "type": DatabaseUtil.DATA_TYPE.DESCRIPTION,
            "notNull": true
        }, {
            "name": "description",
            "type": DatabaseUtil.DATA_TYPE.DESCRIPTION
        }, {
            "name": "engine_id",
            "type": DatabaseUtil.DATA_TYPE.ID_SHORT
        }, {
            "name": "visibility",
            "type": "INT(1)"
        }, {
            "name": "created_by",
            "type": DatabaseUtil.DATA_TYPE.ID_LONG,
            "notNull": true
        }],
        "foreignKeys": [{
            "name": "course_created_by_user",
            "field": "created_by",
            "reference": {
                "field": "username",
                "table": "user"
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
    };

    public find(id: string): Promise<Course> {
        return this.doSelect(id);
    }

    public static findAll(condition: string = "", inserts: any[] = []): Promise<Course[]> {
        return new Promise((resolve, reject) => {
            this.doSelectAll(Course.entity, condition, inserts).then(results => {
                let courses: Array<Course> = [];
                for (let course of results) {
                    let courseObject = new Course();
                    courseObject.setData(course);
                    courses.push(courseObject);
                }
                resolve(courses);
            }).catch(reject);
        });
    }

    public get courseId(): string {
        return this.get("course_id");
    }

    public get name(): string {
        return this.get("name");
    }

    public set name(name: string) {
        this.set("name", name);
    }

    public get description(): string {
        return this.get("description");
    }

    public set description(description: string) {
        this.set("description", description);
    }

    public get createdBy(): string {
        return this.get("created_by");
    }

    public get createdStamp(): string {
        return this.get("created_stamp");
    }

    public get lastUpdatedStamp(): string {
        return this.get("last_updated_stamp");
    }
}

interface courseData {
    courseId: string,
    name?: string,
    description?: string,
    createdBy?: string,
    createdStamp?: Date,
    lastUpdatedStamp?: Date
}