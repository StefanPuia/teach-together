import FrameworkSecurityUtil from '../../framework/utils/security.util';
import { Request, Response, NextFunction } from 'express';
import BaseConfig from '../config/base.config';

export default abstract class SecurityUtil extends FrameworkSecurityUtil {
    public static ensureLogin(req: Request, res: Response, next: NextFunction) {
        if (SecurityUtil.userLoggedIn(req)) {
            next();
        } else {
            res.redirect("/login");
        }
    }

    public static hashPassword(password: string): string {
        return this.hash(password + BaseConfig.passwordSalt);
    }

    public static addUserPref(req: Request, res: Response, next: NextFunction) {
        if (SecurityUtil.userLoggedIn(req)) {
            req!.session!.theme = "dark";
        }
        next();
    }

    public static userLoggedIn(req: Request): boolean {
        return req.session && req.session.user && req.session.cookie.expires > new Date();
    }
}