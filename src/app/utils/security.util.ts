import { SecurityUtil as FrameworkSecurityUtil } from '../../framework/utils/security.util';
import { Request, Response, NextFunction } from 'express';

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
}