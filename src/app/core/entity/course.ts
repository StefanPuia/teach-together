import { GenericValue } from '../../../framework/core/entity/generic.value';
export class Course extends GenericValue {
    public static readonly entity: string = 'course';
    protected readonly entity: string = Course.entity;
    protected readonly primaryKeyField: string = 'course_id';
    protected data?: courseData;

    public static readonly definition: EntityDefinition = {
        "name": "course",
        "fields": [{
            "name": "course_id",
            "type": "varchar(8)",
            "notNull": true,
            "unique": true
        }, {
            "name": "name",
            "type": "varchar(255)",
            "notNull": true
        }, {
            "name": "description",
            "type": "varchar(1000)"
        }, {
            "name": "created_by",
            "type": "varchar(45)",
            "notNull": true
        }],
        "foreignKeys": [{
            "name": "course_created_by_user",
            "field": "created_by",
            "reference": {
                "field": "username",
                "table": "user"
            },
            "onDelete": "cascade",
            "onUpdate": "cascade"
        }]
    };

    public find(id: string): Promise<Course> {
        return this.doSelect(id);
    }

    public static findAll(condition: string = "", inserts: any[] = []): Promise<Course[]> {
        return Course.doSelectAll(Course.entity, condition, inserts);
    }

    public get courseId(): string {
        return this.get("courseId");
    }

    public get name(): string {
        return this.get("name");
    }

    public get description(): string {
        return this.get("description");
    }

    public set name(name: string) {
        this.set("name", name);
    }

    public set description(description: string) {
        this.set("description", description);
    }

    public get createdBy(): string {
        return this.get("createdBy");
    }

    public get createdStamp(): string {
        return this.get("createdStamp");
    }

    public get lastUpdatedStamp(): string {
        return this.get("lastUpdatedStamp");
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