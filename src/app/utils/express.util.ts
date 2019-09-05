import { Request, Response } from 'express';
import Screen from '../../framework/core/screen';

export default abstract class ExpresssUtil {
    public static handleNotFound(req: Request, res: Response) {
        Screen.create('404', req, res).renderQuietly();
    }

    public static handleLoginError(req: Request, res: Response, error: any) {
        Screen.create('login/index', req, res).appendContext({
            error: error
        }).renderQuietly();
    }
}