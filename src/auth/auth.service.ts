import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignUpInput } from './dto/signUpInput';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import { SignInInput } from './dto/signInInput';
import { NodemailerService } from '../nodemailer/nodemailer.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private NodemailerService: NodemailerService,
  ) {}
  async signUp(SignUpInput: SignUpInput) {
    const hashedPassword = await argon.hash(SignUpInput.password);
    const user = await this.prisma.user.create({
      data: {
        userName: SignUpInput.username,
        hashedPassword,
        email: SignUpInput.email,
      },
    });
    const { accessToken, refreshToken } = await this.createTokens(
      user.ID,
      user.email,
    );
    await this.updateRefreshToken(user.ID, refreshToken);
    return { accessToken, refreshToken, user };
  }

  async signIn(SignInInput: SignInInput) {
    const user = await this.prisma.user.findUnique({
      where: { email: SignInInput.email },
    });
    if (!user) {
      throw new ForbiddenException('Access denied');
    }
    const doPasswordMatch = await argon.verify(
      user.hashedPassword,
      SignInInput.password,
    );
    if (!doPasswordMatch) {
      throw new ForbiddenException('Access denied');
    }
    const { accessToken, refreshToken } = await this.createTokens(
      user.ID,
      user.email,
    );
    await this.updateRefreshToken(user.ID, refreshToken);
    return { accessToken, refreshToken, user };
  }

  async logout(userId: number) {
    await this.prisma.user.updateMany({
      where: { ID: userId, hashedRefreshToken: { not: null } },
      data: { hashedRefreshToken: null },
    });
    return { loggedOut: true };
  }

  async updatePassword(userId: number, newPassword: string) {
    const hashedPassword = await argon.hash(newPassword);
    await this.prisma.user.update({
      where: { ID: userId },
      data: { hashedPassword, updatedAt: new Date() },
    });
    return 'The password has been updated successfully';
  }

  async forgotPassword(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resetToken = await this.generateRestPasswordToken(
      user.ID,
      user.email,
    );

    await this.prisma.user.update({
      where: { ID: user.ID },
      data: { resetToken },
    });

    // Send the reset password email
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
    const emailSubject = 'Forgot Password';
    const emailText = `Click the following link to reset your password: ${resetLink}`;

    try {
      await this.NodemailerService.sendMail(email, emailSubject, emailText);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async resetPassword(
    email: string,
    token: string,
    newPassword: string,
  ): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { email, resetToken: token },
    });

    if (!user) {
      throw new NotFoundException('User not found or invalid token');
    }
    const doTokenMatch = await this.jwtService.verify(user.resetToken, {
      secret: this.configService.get<string>('REST_SECRET'),
    });
    if (!doTokenMatch) {
      throw new NotFoundException('dontmatch');
    }

    // Update the password
    const hashedPassword = await argon.hash(newPassword);
    await this.prisma.user.update({
      where: { ID: user.ID },
      data: { hashedPassword, resetToken: token },
    });

    return 'Password reset successful';
  }

  // todo: helper functions
  async createTokens(userId: number, email: string) {
    const accessToken = this.jwtService.sign(
      {
        userId,
        email,
      },
      {
        expiresIn: '5d',
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      },
    );

    const refreshToken = this.jwtService.sign(
      {
        userId,
        email,
        accessToken,
      },
      {
        expiresIn: '10d',
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      },
    );
    return { accessToken, refreshToken };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await argon.hash(refreshToken);
    await this.prisma.user.update({
      where: { ID: userId },
      data: { hashedRefreshToken },
    });
  }

  async getNewTokens(userId: number, rt: string) {
    const user = await this.prisma.user.findUnique({
      where: { ID: userId },
    });
    if (!user) {
      throw new ForbiddenException('Access denied');
    }
    const doRefreshTokensMatch = await argon.verify(
      user.hashedRefreshToken,
      rt,
    );
    if (!doRefreshTokensMatch) {
      throw new ForbiddenException('Access denied');
    }
    const { accessToken, refreshToken } = await this.createTokens(
      user.ID,
      user.email,
    );
    return { accessToken, refreshToken, user };
  }

  async generateRestPasswordToken(userId: number, email: string) {
    const restToken = this.jwtService.sign(
      {
        userId,
        email,
      },
      {
        expiresIn: '5d',
        secret: this.configService.get<string>('REST_SECRET'),
      },
    );
    return restToken;
  }
  async sayHello() {
    return 'hello world!';
  }
}
