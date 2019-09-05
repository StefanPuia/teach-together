import { Router, Request, Response } from 'express';
import Screen from '../../framework/core/screen';
import { User } from '../core/entity/user';

const router: Router = Router();

router.get('/login', (req: Request, res: Response) => {
    Screen.create('login/index', req, res).beforeRender((req, res, context) => {
        if (req.statusCode == 403) {
            context.error = "You need to login to see this page"
        }
    }).renderQuietly();
});

router.post('/login', (req: Request, res: Response) => {
    const username = req.body.username;
    const password = req.body.password;
    const remember = req.body.remember;

    if (!username || !password) {
        Screen.create('login/index', req, res).appendContext({
            error: "No username or password provided"
        }).renderQuietly();
    }

    if (username == "stephano2013") {
        new User().find("stephano2013").then(user => {
            if (req.session) {
                req.session.user = user;
            }
            res.redirect("/");
        })
    } else {
        Screen.create('login/index', req, res).renderQuietly();
    }
})

router.get('/logout', (req: Request, res: Response) => {
    if (req.session) {
        req.session.destroy(() => {
            res.redirect("/login");
        });
    } else {
        res.redirect("/login");
    }
})

export default router;