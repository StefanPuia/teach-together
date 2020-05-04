import { SecurityUtil as FrameworkSecurityUtil } from '../../framework/utils/security.util';
import { Request, Response, NextFunction } from 'express';
import { ServiceUtil } from '../../framework/utils/service.util';
import { TypeEngine } from '../../framework/core/engine/type.engine';
import { DebugUtil } from '../../framework/utils/debug.util';
import { CourseWebsocketController } from '../controllers/websocket/course.ws';

export abstract class SecurityUtil extends FrameworkSecurityUtil {
    public static addUserPref(req: Request, res: Response, next: NextFunction) {
        if (SecurityUtil.userLoggedIn(req)) {
            req.session!.theme = "light";
        }
        next();
    }

    public static ensureLogin(req: Request, res: Response, next: NextFunction) {
        if (SecurityUtil.userLoggedIn(req)) {
            next();
        } else {
            res.redirect("/login");
        }
    }

    public static async isCourseOwner(courseId: string, userLoginId: string) {
        try {
            const result = await ServiceUtil.runSync("IsCourseOwner", {
                userLoginId: TypeEngine.convert(userLoginId, "number"),
                courseId: courseId
            }, true, true);
            return result.isOwner;
        } catch (err) {
            DebugUtil.logError(err, CourseWebsocketController.module);
            return false;
        }
    }
}