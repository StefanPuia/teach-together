// src/config/custom.config.ts
export interface CustomConfigInterface {
    database: DatabaseConnection;
    cookieSettings: CookieSettings;
    viewsLocation: string;
    staticLocation: string;
    processTimeout: number;
}