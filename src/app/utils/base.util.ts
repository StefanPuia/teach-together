import { Request, Response, NextFunction } from 'express';
import FrameworkBaseUtil from '../../framework/utils/base.util';

export default abstract class BaseUtil extends FrameworkBaseUtil {
    public static addUserPref(req: any, res: Response, next: NextFunction) {
        req.params.theme = "dark";
        next();
    }
}