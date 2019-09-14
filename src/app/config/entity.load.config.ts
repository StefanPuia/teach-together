import { Course } from '../core/entity/course';
import { Engine } from '../core/entity/engine';

const EntityLoad: Array<EntityDefinition> = [
    Engine.definition,
    Course.definition
];
export { EntityLoad };