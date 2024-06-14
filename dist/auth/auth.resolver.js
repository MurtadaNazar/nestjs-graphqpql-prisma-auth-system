"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const auth_service_1 = require("./auth.service");
const auth_entity_1 = require("./entities/auth.entity");
const signUpInput_1 = require("./dto/signUpInput");
const sign_response_1 = require("./dto/sign-response");
const signInInput_1 = require("./dto/signInInput");
const logout_response_1 = require("./dto/logout-response");
const public_decorator_1 = require("./decorators/public.decorator");
const newTokensResponse_1 = require("./dto/newTokensResponse");
const CurrentUserId_decorator_1 = require("./decorators/CurrentUserId.decorator");
const currentUser_decorator_1 = require("./decorators/currentUser.decorator");
const common_1 = require("@nestjs/common");
const refreshToken_guard_1 = require("./guards/refreshToken.guard");
let AuthResolver = class AuthResolver {
    constructor(authService) {
        this.authService = authService;
    }
    signUp(signUpInput) {
        return this.authService.signUp(signUpInput);
    }
    signIn(signInInput) {
        return this.authService.signIn(signInInput);
    }
    logOut(id) {
        return this.authService.logout(id);
    }
    updatePassword(userId, newPassword) {
        return this.authService.updatePassword(userId, newPassword);
    }
    getNewTokens(userId, refreshToken) {
        return this.authService.getNewTokens(userId, refreshToken);
    }
    sayHello() {
        return this.authService.sayHello();
    }
    async forgotPassword(email) {
        try {
            await this.authService.forgotPassword(email);
            return true;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }
    async resetPassword(email, token, newPassword) {
        try {
            const result = await this.authService.resetPassword(email, token, newPassword);
            return result;
        }
        catch (error) {
            console.error(error);
            return 'Password reset failed';
        }
    }
};
exports.AuthResolver = AuthResolver;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, graphql_1.Mutation)(() => sign_response_1.SignResponse),
    __param(0, (0, graphql_1.Args)('signUpInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signUpInput_1.SignUpInput]),
    __metadata("design:returntype", void 0)
], AuthResolver.prototype, "signUp", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, graphql_1.Mutation)(() => sign_response_1.SignResponse),
    __param(0, (0, graphql_1.Args)('signInInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signInInput_1.SignInInput]),
    __metadata("design:returntype", void 0)
], AuthResolver.prototype, "signIn", null);
__decorate([
    (0, graphql_1.Mutation)(() => logout_response_1.LogoutResponse),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AuthResolver.prototype, "logOut", null);
__decorate([
    (0, graphql_1.Mutation)(() => String),
    __param(0, (0, graphql_1.Args)('userId', { type: () => graphql_1.Int })),
    __param(1, (0, graphql_1.Args)('newPassword')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], AuthResolver.prototype, "updatePassword", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(refreshToken_guard_1.RefreshTokenGuard),
    (0, graphql_1.Mutation)(() => newTokensResponse_1.NewTokensResponse),
    __param(0, (0, CurrentUserId_decorator_1.CurrentUserId)()),
    __param(1, (0, currentUser_decorator_1.CurrentUser)('refreshToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], AuthResolver.prototype, "getNewTokens", null);
__decorate([
    (0, graphql_1.Query)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthResolver.prototype, "sayHello", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "forgotPassword", null);
__decorate([
    (0, graphql_1.Mutation)(() => String),
    (0, public_decorator_1.Public)(),
    __param(0, (0, graphql_1.Args)('email')),
    __param(1, (0, graphql_1.Args)('token')),
    __param(2, (0, graphql_1.Args)('newPassword')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "resetPassword", null);
exports.AuthResolver = AuthResolver = __decorate([
    (0, graphql_1.Resolver)(() => auth_entity_1.Auth),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthResolver);
//# sourceMappingURL=auth.resolver.js.map