import { Request, Response, Router } from 'express';
import { Screen } from '../core/screen';
import { DiscordAuth } from '../utils/auth/discord.auth';
import { SecurityUtil } from '../utils/security.util';
import { GoogleAuth } from '../utils/auth/google.auth';
import { ExpressUtil } from '../utils/express.util';

const loginController: Router = Router();
const moduleName = "Controller.Login";

loginController.get('/login', (req: Request, res: Response) => {
    if (SecurityUtil.userLoggedIn(req)) {
        res.redirect("/");
    } else {
        Screen.create('login/index', req, res).appendContext({
            urls: getAuthUrls()
        }).renderQuietly();
    }
});

function handleSocialLoginError(req: Request, res: Response, err: any) {
    ExpressUtil.handleLoginError(req, res, err, {
        urls: getAuthUrls()
    })
}

loginController.get("/auth/discord", (req: Request, res: Response) => {
    DiscordAuth.logIn(req)
    .then(user => {
        SecurityUtil.socialLogin(req, res, user).then(() => {
            res.redirect("/");
        }).catch(err => handleSocialLoginError(req, res, err));
    }).catch(err => handleSocialLoginError(req, res, err));
});

loginController.get("/auth/google", (req: Request, res: Response) => {
    GoogleAuth.logIn(req)
    .then(user => {
        SecurityUtil.socialLogin(req, res, user).then(() => {
            res.redirect("/");
        }).catch(err => handleSocialLoginError(req, res, err));
    }).catch(err => handleSocialLoginError(req, res, err));
});

loginController.get('/logout', (req: Request, res: Response) => {
    if (req.session) {
        req.session.destroy(() => {
            res.redirect("/login");
        });
    } else {
        delete req.session;
        res.redirect("/login");
    }
});

function getAuthUrls(): GenericObject {
    return {
        discord: DiscordAuth.getAuthorizeURL(),
        google: GoogleAuth.getAuthorizeURL()
    }
}

export { loginController };