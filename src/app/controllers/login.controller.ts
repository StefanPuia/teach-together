import { Request, Response, Router } from 'express';
import { UserLogin } from '../../framework/core/entity/user_login';
import { DebugUtil } from '../../framework/utils/debug.util';
import { BaseConfig } from '../config/base.config';
import { Screen } from '../core/screen';
import { ExpressUtil } from '../utils/express.util';
import { SecurityUtil } from '../utils/security.util';

const loginController: Router = Router();
const moduleName = "Controller.Login";

loginController.get('/login', (req: Request, res: Response) => {
    if (SecurityUtil.userLoggedIn(req)) {
        res.redirect("/");
    } else {
        Screen.create('login/index', req, res).renderQuietly();
    }
});

loginController.post('/login', (req: Request, res: Response) => {
    const userLoginId = req.body.userLoginId;
    const password = req.body.password;
    const remember = req.body.remember;

    if (!userLoginId || !password) {
        ExpressUtil.handleLoginError(req, res, "No username or password provided");
    }

    UserLogin.create().findLogin(userLoginId, password).then(user => {
        if (req.session) {
            if (remember === "Y") {
                req.session.cookie.maxAge = BaseConfig.cookieRememberMeMaxAge;
            }
            req.session.user = user;
        }
        res.redirect("/");
    }).catch(err => {
        ExpressUtil.handleLoginError(req, res, err);
    });
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

loginController.get("/register", (req: Request, res: Response) => {
    if (SecurityUtil.userLoggedIn(req)) {
        res.redirect("/");
    } else {
        Screen.create('login/register', req, res).renderQuietly();
    }
});

loginController.post('/register', (req: Request, res: Response) => {
    const userLoginId = req.body.userLoginId;
    const password = req.body.password;
    const remember = req.body.remember;

    if (!userLoginId || !password) {
        ExpressUtil.handleRegisterError(req, res, "No username or password provided");
    }

    UserLogin.create().find(userLoginId).then(existingUser => {
        if (existingUser) {
            return ExpressUtil.handleRegisterError(req, res, "Username already in use.");
        }
        createUser();
    }).catch(err => {
        DebugUtil.logWarning(err, moduleName);
        createUser();
    });

    function createUser() {
        const user = UserLogin.create();
        user.setData({
            user_login_id: userLoginId,
            password: SecurityUtil.hashPassword(password)
        })
        user.insert().then(() => {
            if (req.session) {
                if (remember === "Y") {
                    req.session.cookie.maxAge = BaseConfig.cookieRememberMeMaxAge;
                }
                req.session.user = user;
            }
            res.redirect("/");
        }).catch(err => {
            ExpressUtil.handleRegisterError(req, res, err);
        })
    }
});

export { loginController };