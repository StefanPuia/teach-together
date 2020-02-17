import { Request, Response } from 'express';
import { Screen } from '../core/screen';
import BaseUtil from './base.util';
import { DebugUtil } from '../../framework/utils/debug.util';
import { ExpressUtil as FrameworkExpressUtil } from '../../framework/utils/express.util';

export abstract class ExpressUtil extends FrameworkExpressUtil {
    public static handleNotFound(req: Request, res: Response) {
        Screen.create('404', req, res).renderQuietly();
    }

    public static handleLoginError(req: Request, res: Response, error: any): void;
    public static handleLoginError(req: Request, res: Response, error: any, context: GenericObject): void;
    public static handleLoginError(req: Request, res: Response, error: any, context: GenericObject = {}): void {
        DebugUtil.logError(error, "LoginError", req.path);
        Screen.create('login/index', req, res).appendContext(context).appendContext({
            error: BaseUtil.stringify(error)
        }).renderQuietly();
    }

    public static handleGenericError(req: Request, res: Response, error: any): void;
    public static handleGenericError(req: Request, res: Response, error: any, context: GenericObject): void;
    public static handleGenericError(req: Request, res: Response, error: any, context: GenericObject = {}): void {
        DebugUtil.logError(error, "GenericError", req.path);
        Screen.create('error', req, res).appendContext(context).appendContext({
            error: BaseUtil.stringify(error)
        }).renderQuietly();
    }
}