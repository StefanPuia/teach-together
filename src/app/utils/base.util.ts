import { Request, Response, NextFunction } from 'express';
import FrameworkBaseUtil from '../../framework/utils/base.util';
import Debug from '../../framework/utils/debug.util';
import morgan = require('morgan');


export default abstract class BaseUtil extends FrameworkBaseUtil {
    public static morgan(tokens: morgan.TokenIndexer, req: Request, res: Response) {
        return Debug.formatLogText([
            tokens.url(req, res),
            tokens.method(req, res),
            tokens.status(req, res),
            `[${req.ip || req.ip || (req.connection && req.connection.remoteAddress) || "0.0.0.0"}]`
        ].join(' '), "INFO", "Request");
    }

    public static morganSkip(req: Request, res: Response) {
        let ignore = ['/static', '/api', '/ping'];
        for (let url of ignore) {
            if (req.baseUrl && req.baseUrl.toLowerCase().indexOf(url.toLowerCase()) == 0) {
                return true;
            }
        }
        return false;
    }
}

