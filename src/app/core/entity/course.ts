import { GenericValue } from '../../../framework/core/entity/generic.value';
export class Course extends GenericValue {
    protected entity: string = 'course';
    protected primaryKeyField: string = 'course_id';
    protected data?: courseData;

    public find(id: string): Promise<Course> {
        return this.doSelect(id);
    }

    public findAll(condition: string = "", inserts: any[] = []): Promise<Course[]> {
        return this.doSelectAll(condition, inserts);
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