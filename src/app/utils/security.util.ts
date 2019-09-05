import FrameworkSecurityUtil from '../../framework/utils/security.util';
import { Request, Response, NextFunction } from 'express';

export default abstract class SecurityUtil extends FrameworkSecurityUtil {
    public static ensureLogin(req: Request, res: Response, next: NextFunction) {
        if (req.session && req.session.user) {
            next();
        } else {
            res.send("log in");
        }
    }
} 