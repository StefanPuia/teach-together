import { OAuthEngine } from '../../../framework/core/engine/oauth.engine';
import { Request } from 'express';
import { BaseConfig } from '../../config/base.config';

export class GithubAuth extends OAuthEngine {
    protected authorizeBaseURL: string = "https://github.com/login/oauth/authorize";
    protected tokenURL: string = "https://github.com/login/oauth/access_token";
    protected clientID: string = BaseConfig.githubAuth.clientID;
    protected clientSecret: string = BaseConfig.githubAuth.clientSecret;
    protected redirectURL: string = GithubAuth.redirectUrlPrefix + "auth/github";
    protected identifyURL: string = "https://api.github.com/user";
    protected scope: string = "identify";
    private static instance: GithubAuth;
    public static readonly provider: string = "GITHUB";

    private constructor() {
        super();
    }

    private static getInstance(): GithubAuth {
        if (!GithubAuth.instance) {
            GithubAuth.instance = new GithubAuth();
        }
        return GithubAuth.instance;
    }

    public static getAuthorizeURL(): string {
        return GithubAuth.getInstance().getAuthorizeURL();
    }

    public static logIn(req: Request): Promise<GenericObject> {
        return new Promise((resolve, reject) => {
            GithubAuth.getInstance().authenticate(req.query.code)
                .then((data: githubdAuthData) => {
                GithubAuth.getInstance().identify(data.token_type, data.access_token)
                .then((userData: GenericObject) => {
                    resolve({
                        provider: GithubAuth.provider,
                        socialId: userData.id,
                        name: userData.name,
                        picture: userData.avatar_url
                    })
                })
                .catch(reject);
            }).catch(reject);
        })
    }
}

interface githubdAuthData {
    token_type: string,
    access_token: string,
    scope: string
}