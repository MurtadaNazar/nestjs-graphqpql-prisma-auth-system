import { AuthService } from './auth.service';
import { SignUpInput } from './dto/signUpInput';
import { SignInInput } from './dto/signInInput';
export declare class AuthResolver {
    private readonly authService;
    constructor(authService: AuthService);
    signUp(signUpInput: SignUpInput): Promise<{
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
    signIn(signInInput: SignInInput): Promise<{
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
    logOut(id: number): Promise<{
        loggedOut: boolean;
    }>;
    updatePassword(userId: number, newPassword: string): Promise<string>;
    getNewTokens(userId: number, refreshToken: string): Promise<{
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
    sayHello(): Promise<string>;
    forgotPassword(email: string): Promise<boolean>;
    resetPassword(email: string, token: string, newPassword: string): Promise<string>;
}
