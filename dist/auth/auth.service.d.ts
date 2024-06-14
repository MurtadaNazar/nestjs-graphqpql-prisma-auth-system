import { SignUpInput } from './dto/signUpInput';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignInInput } from './dto/signInInput';
import { NodemailerService } from '../nodemailer/nodemailer.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    private NodemailerService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService, NodemailerService: NodemailerService);
    signUp(SignUpInput: SignUpInput): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            ID: number;
            userName: string;
            email: string;
            hashedPassword: string;
            hashedRefreshToken: string;
            resetToken: string;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    signIn(SignInInput: SignInInput): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            ID: number;
            userName: string;
            email: string;
            hashedPassword: string;
            hashedRefreshToken: string;
            resetToken: string;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    logout(userId: number): Promise<{
        loggedOut: boolean;
    }>;
    updatePassword(userId: number, newPassword: string): Promise<string>;
    createTokens(userId: number, email: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    updateRefreshToken(userId: number, refreshToken: string): Promise<void>;
    getNewTokens(userId: number, rt: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            ID: number;
            userName: string;
            email: string;
            hashedPassword: string;
            hashedRefreshToken: string;
            resetToken: string;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    generateRestPasswordToken(userId: number, email: string): Promise<string>;
    sayHello(): Promise<string>;
    forgotPassword(email: string): Promise<boolean>;
    resetPassword(email: string, token: string, newPassword: string): Promise<string>;
}
