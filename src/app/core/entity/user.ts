import { GenericValue } from '../../../framework/core/entity/generic.value';
export class User extends GenericValue {
    protected entity: string = 'user';
    protected primaryKeyField: string = 'username';
    protected data?: userData;

    public static readonly definition: EntityDefinition = {
        "name": "user",
        "fields": [{
            "name": "username",
            "type": "varchar(45)",
            "primaryKey": true,
            "notNull": true,
            "unique": true
        }, {
            "name": "password",
            "type": "varchar(256)"
        }]
    };

    public find(id: string): Promise<User> {
        return this.doSelect(id);
    }

    public findAll(condition: string = "", inserts: any[] = []): Promise<User[]> {
        return this.doSelectAll(condition, inserts);
    }

    public get username() {
        return this.get("username");
    }

    public get password() {
        return this.get("password");
    }

    public set password(password: string) {
        this.set("password", password);
    }
}

interface userData {
    username: string,
    password: string
}