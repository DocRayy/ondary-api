import { NestMiddleware } from '@nestjs/common';
export declare class XssMiddleware implements NestMiddleware {
    private clean;
    use(req: any, res: any, next: () => void): void;
}
