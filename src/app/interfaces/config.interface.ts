// src/config/custom.config.ts
export interface ConfigInterface {
    database: DatabaseConnection;
    cookieSettings: CookieSettings;
    viewsLocation: string;
    staticLocation: string;
    processTimeout: number;
}