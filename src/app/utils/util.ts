import { Request, Response, NextFunction } from 'express';

export default abstract class Util {
    public static addUserPref(req: any, res: Response, next: NextFunction) {
        req.params.theme = "dark";
        next();
    }
}