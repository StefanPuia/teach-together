import { OAuthEngine } from '../../../framework/core/engine/oauth.engine';
import { Request } from 'express';
import { BaseConfig } from '../../config/base.config';

export class GoogleAuth extends OAuthEngine {
    protected authorizeBaseURL: string = "https://accounts.google.com/o/oauth2/v2/auth";
    protected tokenURL: string = "https://www.googleapis.com/oauth2/v4/token";
    protected clientID: string = BaseConfig.googleAuth.clientID;
    protected clientSecret: string = BaseConfig.googleAuth.clientSecret;
    protected redirectURL: string = GoogleAuth.redirectUrlPrefix + "auth/google";
    protected identifyURL: string = "https://www.googleapis.com/oauth2/v2/userinfo";
    protected scope: string = "https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile";
    private static instance: GoogleAuth;
    public static readonly provider: string = "GOOGLE";

    private constructor() {
        super();
    }

    private static getInstance(): GoogleAuth {
        if (!GoogleAuth.instance) {
            GoogleAuth.instance = new GoogleAuth();
        }
        return GoogleAuth.instance;
    }

    public static getAuthorizeURL(): string {
        return GoogleAuth.getInstance().getAuthorizeURL();
    }

    public static logIn(req: Request): Promise<GenericObject> {
        return new Promise((resolve, reject) => {
            GoogleAuth.getInstance().authenticate(req.query.code)
            .then((data: GoogleAuthData) => {
                GoogleAuth.getInstance().identify(data.token_type, data.access_token)
                .then((userData: GenericObject) => {
                    resolve({
                        provider: GoogleAuth.provider,
                        socialId: userData.id,
                        name: userData.name,
                        picture: userData.picture
                    })
                })
                .catch(reject);
            }).catch(reject);
        })
    }
}

interface GoogleAuthData {
    access_token: string,
    expires_in: number,
    id_token: string,
    scope: string,
    token_type: string,
    refresh_token: string
}