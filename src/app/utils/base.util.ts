import { BaseUtil as FrameworkBaseUtil } from '../../framework/utils/base.util';
import { EntityQuery } from '../../framework/core/engine/entity/entity.query';

export default abstract class BaseUtil extends FrameworkBaseUtil {
    public static async isCourseOwner(courseId: string, userLoginId: string | number) {
        const owners = await EntityQuery.from("CourseOwner").where({ "courseId": courseId }).cache().queryList();
        return !!owners.find(own => own.get("userLoginId") == userLoginId);
    }
}