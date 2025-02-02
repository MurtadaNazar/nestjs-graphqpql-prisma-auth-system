"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_resolver_1 = require("./auth.resolver");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const accessToken_strategy_1 = require("./strategies/accessToken.strategy");
const refreshToken_strategy_1 = require("./strategies/refreshToken.strategy");
const nodemailer_service_1 = require("../nodemailer/nodemailer.service");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        providers: [
            auth_resolver_1.AuthResolver,
            auth_service_1.AuthService,
            jwt_1.JwtService,
            prisma_service_1.PrismaService,
            nodemailer_service_1.NodemailerService,
            accessToken_strategy_1.AccessTokenStrategy,
            refreshToken_strategy_1.RefreshTokenStrategy,
        ],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map