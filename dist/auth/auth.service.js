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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const argon = require("argon2");
const nodemailer_service_1 = require("../nodemailer/nodemailer.service");
let AuthService = class AuthService {
    constructor(prisma, jwtService, configService, NodemailerService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
        this.NodemailerService = NodemailerService;
    }
    async signUp(SignUpInput) {
        const hashedPassword = await argon.hash(SignUpInput.password);
        const user = await this.prisma.user.create({
            data: {
                userName: SignUpInput.username,
                hashedPassword,
                email: SignUpInput.email,
            },
        });
        const { accessToken, refreshToken } = await this.createTokens(user.ID, user.email);
        await this.updateRefreshToken(user.ID, refreshToken);
        return { accessToken, refreshToken, user };
    }
    async signIn(SignInInput) {
        const user = await this.prisma.user.findUnique({
            where: { email: SignInInput.email },
        });
        if (!user) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const doPasswordMatch = await argon.verify(user.hashedPassword, SignInInput.password);
        if (!doPasswordMatch) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const { accessToken, refreshToken } = await this.createTokens(user.ID, user.email);
        await this.updateRefreshToken(user.ID, refreshToken);
        return { accessToken, refreshToken, user };
    }
    async logout(userId) {
        await this.prisma.user.updateMany({
            where: { ID: userId, hashedRefreshToken: { not: null } },
            data: { hashedRefreshToken: null },
        });
        return { loggedOut: true };
    }
    async updatePassword(userId, newPassword) {
        const hashedPassword = await argon.hash(newPassword);
        await this.prisma.user.update({
            where: { ID: userId },
            data: { hashedPassword, updatedAt: new Date() },
        });
        return 'The password has been updated successfully';
    }
    async createTokens(userId, email) {
        const accessToken = this.jwtService.sign({
            userId,
            email,
        }, {
            expiresIn: '5d',
            secret: this.configService.get('ACCESS_TOKEN_SECRET'),
        });
        const refreshToken = this.jwtService.sign({
            userId,
            email,
            accessToken,
        }, {
            expiresIn: '10d',
            secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        });
        return { accessToken, refreshToken };
    }
    async updateRefreshToken(userId, refreshToken) {
        const hashedRefreshToken = await argon.hash(refreshToken);
        await this.prisma.user.update({
            where: { ID: userId },
            data: { hashedRefreshToken },
        });
    }
    async getNewTokens(userId, rt) {
        const user = await this.prisma.user.findUnique({
            where: { ID: userId },
        });
        if (!user) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const doRefreshTokensMatch = await argon.verify(user.hashedRefreshToken, rt);
        if (!doRefreshTokensMatch) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const { accessToken, refreshToken } = await this.createTokens(user.ID, user.email);
        return { accessToken, refreshToken, user };
    }
    async generateRestPasswordToken(userId, email) {
        const restToken = this.jwtService.sign({
            userId,
            email,
        }, {
            expiresIn: '5d',
            secret: this.configService.get('REST_SECRET'),
        });
        return restToken;
    }
    async sayHello() {
        return 'hello world!';
    }
    async forgotPassword(email) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const resetToken = await this.generateRestPasswordToken(user.ID, user.email);
        await this.prisma.user.update({
            where: { ID: user.ID },
            data: { resetToken },
        });
        const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
        const emailSubject = 'Forgot Password';
        const emailText = `Click the following link to reset your password: ${resetLink}`;
        try {
            await this.NodemailerService.sendMail(email, emailSubject, emailText);
            return true;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }
    async resetPassword(email, token, newPassword) {
        const user = await this.prisma.user.findUnique({
            where: { email, resetToken: token },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found or invalid token');
        }
        const doTokenMatch = await this.jwtService.verify(user.resetToken, {
            secret: this.configService.get('REST_SECRET'),
        });
        if (!doTokenMatch) {
            throw new common_1.NotFoundException('dontmatch');
        }
        const hashedPassword = await argon.hash(newPassword);
        await this.prisma.user.update({
            where: { ID: user.ID },
            data: { hashedPassword, resetToken: token },
        });
        return 'Password reset successful';
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService,
        nodemailer_service_1.NodemailerService])
], AuthService);
//# sourceMappingURL=auth.service.js.map