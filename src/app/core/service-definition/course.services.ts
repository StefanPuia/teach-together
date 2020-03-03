import BaseUtil from '../../utils/base.util';
import { ServiceStorage } from '../../../framework/core/engine/service.engine';

const CourseServices: ServiceStorage = {
    "IsCourseOwner": {
        "sync": false,
        "cache": true,
        "caller": async (courseId: string, userLoginId: string | number) => {
            const isOwner = await BaseUtil.isCourseOwner(courseId, userLoginId);
            return { isOwner: isOwner };
        },
        "parameters": [{
            "name": "courseId",
            "mode": "in",
            "type": "string"
        }, {
            "name": "userLoginId",
            "mode": "in",
            "type": "number"
        }, {
            "name": "isOwner",
            "mode": "out",
            "type": "boolean",
            "optional": false
        }]
    }
};

export { CourseServices };
