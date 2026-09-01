export declare const config: {
    port: number;
    nodeEnv: string;
    upstream: {
        baseUrl: string;
    };
    cache: {
        ttlSeconds: number;
    };
    rateLimit: {
        windowMs: number;
        maxRequests: number;
    };
    cors: {
        allowedOrigins: string;
    };
    puppeteer: {
        headless: boolean;
        timeout: number;
        userAgent: string;
    };
    isDev: boolean;
};
//# sourceMappingURL=env.d.ts.map