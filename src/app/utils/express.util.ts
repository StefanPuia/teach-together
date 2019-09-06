import { Request, Response } from 'express';
import Screen from '../core/screen';

export default abstract class ExpresssUtil {
    public static handleNotFound(req: Request, res: Response) {
        Screen.create('404', req, res).renderQuietly();
    }

    public static handleLoginError(req: Request, res: Response, error: any) {
        Screen.create('login/index', req, res).appendContext({
            error: error
        }).renderQuietly();
    }

    public static handleRegisterError(req: Request, res: Response, error: any) {
        Screen.create('login/register', req, res).appendContext({
            error: error
        }).renderQuietly();
    }

    public static handleGenericError(req: Request, res: Response, error: any) {
        Screen.create('error', req, res).appendContext({
            error: error
        }).renderQuietly();
    }
}