import { OAuthEngine } from '../../../framework/core/engine/oauth.engine';
import { Request } from 'express';
import { BaseConfig } from '../../config/base.config';

export class DiscordAuth extends OAuthEngine {
    protected authorizeBaseURL: string = "https://discordapp.com/api/oauth2/authorize";
    protected tokenURL: string = "https://discordapp.com/api/oauth2/token";
    protected clientID: string = BaseConfig.discordAuth.clientID;
    protected clientSecret: string = BaseConfig.discordAuth.clientSecret;
    protected redirectURL: string = "http://localhost/auth/discord";
    protected identifyURL: string = "https://discordapp.com/api/users/@me";
    protected scope: string = "identify";
    private static instance: DiscordAuth;

    private constructor() {
        super();
    }

    private static getInstance(): DiscordAuth {
        if (!DiscordAuth.instance) {
            DiscordAuth.instance = new DiscordAuth();
        }
        return DiscordAuth.instance;
    }

    public static getAuthorizeURL(): string {
        return DiscordAuth.getInstance().getAuthorizeURL();
    }

    public static logIn(req: Request): Promise<GenericObject> {
        return new Promise((resolve, reject) => {
            DiscordAuth.getInstance().authenticate(req.query.code)
            .then((data: discordAuthData) => {
                DiscordAuth.getInstance().identify(data.token_type, data.access_token)
                .then((userData: GenericObject) => {
                    resolve({
                        discord_id: userData.id,
                        name: userData.username,
                        picture: `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
                    })
                })
                .catch(reject);
            }).catch(reject);
        })
    }
}

interface discordAuthData {
    token_type: string,
    access_token: string
}