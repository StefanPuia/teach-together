import FrameworkSecurityUtil from '../../framework/utils/security.util';
import { Request, Response, NextFunction } from 'express';
import BaseConfig from '../config/base.config';

export default abstract class SecurityUtil extends FrameworkSecurityUtil {
    public static ensureLogin(req: Request, res: Response, next: NextFunction) {
        if (req.session && req.session.user) {
            next();
        } else {
            res.redirect(403, "/login");
        }
    }

    public static hashPassword(password: string): string {
        return this.hash(password + BaseConfig.passwordSalt);
    }
}