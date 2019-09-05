import { Request, Response, NextFunction } from 'express';
import FrameworkBaseUtil from '../../framework/utils/base.util';

export default abstract class BaseUtil extends FrameworkBaseUtil {
    public static addUserPref(req: Request, res: Response, next: NextFunction) {
        req.body.theme = "dark";
        next();
    }
}