import { Resolver, Mutation, Args, Int, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { SignUpInput } from './dto/signUpInput';
import { SignResponse } from './dto/sign-response';
import { SignInInput } from './dto/signInInput';
import { LogoutResponse } from './dto/logout-response';
import { Public } from './decorators/public.decorator';
import { NewTokensResponse } from './dto/newTokensResponse';
import { CurrentUserId } from './decorators/CurrentUserId.decorator';
import { CurrentUser } from './decorators/currentUser.decorator';
import { UseGuards } from '@nestjs/common';
import { RefreshTokenGuard } from './guards/refreshToken.guard';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => SignResponse)
  signUp(@Args('signUpInput') signUpInput: SignUpInput) {
    return this.authService.signUp(signUpInput);
  }

  @Public()
  @Mutation(() => SignResponse)
  signIn(@Args('signInInput') signInInput: SignInInput) {
    return this.authService.signIn(signInInput);
  }

  @Mutation(() => LogoutResponse)
  logOut(@Args('id', { type: () => Int }) id: number) {
    return this.authService.logout(id);
  }

  @Mutation(() => String)
  updatePassword(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('newPassword') newPassword: string,
  ) {
    return this.authService.updatePassword(userId, newPassword);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Mutation(() => NewTokensResponse)
  getNewTokens(
    @CurrentUserId() userId: number,
    @CurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.getNewTokens(userId, refreshToken);
  }

  @Public()
  @Mutation(() => Boolean)
  async forgotPassword(@Args('email') email: string): Promise<boolean> {
    try {
      await this.authService.forgotPassword(email);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  @Mutation(() => String)
  @Public()
  async resetPassword(
    @Args('email') email: string,
    @Args('token') token: string,
    @Args('newPassword') newPassword: string,
  ): Promise<string> {
    try {
      const result = await this.authService.resetPassword(
        email,
        token,
        newPassword,
      );
      return result;
    } catch (error) {
      console.error(error);
      return 'Password reset failed';
    }
  }

  @Query(() => String)
  sayHello() {
    return this.authService.sayHello();
  }
}
