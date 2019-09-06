import { Router, Request, Response } from 'express';
import Screen from '../core/screen';
import { User } from '../core/entity/user';
import ExpressUtil from '../utils/express.util';
import BaseConfig from '../config/base.config';
import SecurityUtil from '../utils/security.util';
import Debug from '../../framework/utils/debug.util';

const router: Router = Router();
const moduleName = "Controller.Login";

router.get('/login', (req: Request, res: Response) => {
    if (SecurityUtil.userLoggedIn(req)) {
        res.redirect("/");
    } else {
        Screen.create('login/index', req, res).renderQuietly();
    }
});

router.post('/login', (req: Request, res: Response) => {
    const username = req.body.username;
    const password = req.body.password;
    const remember = req.body.remember;

    if (!username || !password) {
        ExpressUtil.handleLoginError(req, res, "No username or password provided");
    }

    User.create().findLogin(username, password).then(user => {
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

router.get('/logout', (req: Request, res: Response) => {
    if (req.session) {
        req.session.destroy(() => {
            res.redirect("/login");
        });
    } else {
        delete req.session;
        res.redirect("/login");
    }
});

router.get("/register", (req: Request, res: Response) => {
    if (SecurityUtil.userLoggedIn(req)) {
        res.redirect("/");
    } else {
        Screen.create('login/register', req, res).renderQuietly();
    }
});

router.post('/register', (req: Request, res: Response) => {
    const username = req.body.username;
    const password = req.body.password;
    const remember = req.body.remember;

    if (!username || !password) {
        ExpressUtil.handleRegisterError(req, res, "No username or password provided");
    }

    User.create().find(username).then(existingUser => {
        if (existingUser) {
            return ExpressUtil.handleRegisterError(req, res, "Username already in use.");
        }
        createUser();
    }).catch(err => {
        Debug.logWarning(err, moduleName);
        createUser();
    });

    function createUser() {
        const user = User.create();
        user.setData({
            username: username,
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

export default router;