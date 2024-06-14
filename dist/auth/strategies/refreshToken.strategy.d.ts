import { ConfigService } from '@nestjs/config';
import { JwtPayload, JwtPayloadWithRefreshToken } from '../types';
import { Request } from 'express';
declare const RefreshTokenStrategy_base: new (...args: any[]) => any;
export declare class RefreshTokenStrategy extends RefreshTokenStrategy_base {
    config: ConfigService;
    constructor(config: ConfigService);
    validate(req: Request, payload: JwtPayload): JwtPayloadWithRefreshToken;
}
export {};
