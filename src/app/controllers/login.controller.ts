import { Router, Request, Response } from 'express';
import Screen from '../../framework/core/screen';
import { User } from '../core/entity/user';
import ExpressUtil from '../utils/express.util';

const router: Router = Router();

router.get('/login', (req: Request, res: Response) => {
    if (req.session && req.session.user) {
        res.redirect("/");
    } else {
        Screen.create('login/index', req, res).beforeRender((req, res, context) => {
            if (req.statusCode == 403) {
                context.error = "You need to login to see this page"
            }
        }).renderQuietly();
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
            if (remember !== "Y") {
                req.session.cookie.maxAge = null;
            }
            req.session.user = user;
        }
        res.redirect("/");
    }).catch(err => {
        ExpressUtil.handleLoginError(req, res, err);
    })
})

router.get('/logout', (req: Request, res: Response) => {
    if (req.session) {
        req.session.destroy(() => {
            res.redirect("/login");
        });
    } else {
        delete req.session;
        res.redirect("/login");
    }
})

export default router;