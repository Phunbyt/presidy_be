import { Controller, Post, Body, Patch, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  SignInDto,
  SignUpDto,
  UpdatePasswordDto,
  UpdateUserDto,
  VerifyOtpByEmailDto,
} from './dto/signup.dto';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { UserType } from 'src/common/constants/types';
import { Public } from 'src/common/decorators/public.decorator';
import { GetAppleUser } from 'src/common/decorators/get-apple-user.decorator';
import { GetGoogleUser } from 'src/common/decorators/get-google-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Public()
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Public()
  @Get('sign-in-google')
  signInWithGoogle(@GetGoogleUser() googleSignInToken: string) {
    return this.authService.signInWithGoogle(googleSignInToken);
  }

  @Public()
  @Get('sign-in-apple')
  signInWithApple(@GetAppleUser() appleSignInToken: string) {
    return this.authService.signInWithApple(appleSignInToken);
  }

  @Public()
  @Post('sign-up-google')
  signUpWithGoogle(@GetGoogleUser() googleSignUpToken: string) {
    return this.authService.signUpWithGoogle(googleSignUpToken);
  }

  @Public()
  @Post('sign-up-apple')
  signUpWithApple(
    @GetAppleUser() validateUser: any,
    @Body() appleSignUpPayload: any,
  ) {
    return this.authService.signUpWithApple(appleSignUpPayload);
  }

  // TODO: Use this enbdpoiint for  password recovery
  // and verify email endpoint when called, send back a token
  // to the veify otp endpoint to specify which route/endpoint
  // made the call
  @Public()
  @Post('send-otp')
  sendOtp(@Body('email') email: string) {
    return this.authService.sendOtp(email.toLowerCase());
  }

  @Public()
  @Post('reset-otp')
  resetOtp(@Body('email') email: string) {
    return this.authService.resetOtp(email.toLowerCase());
  }

  @Post('send-otp/existing-user')
  sendExistingUserOtp(
    @Body('email') email: string,
    @GetCurrentUser() user: UserType,
  ) {
    return this.authService.sendExistingUserOtp(email.toLowerCase(), user);
  }

  // TODO: receive otp and token to specify which route/endpoint made the call
  // you want to verify
  @Post('verify-otp')
  verifyOtp(
    @GetCurrentUser() user: UserType,
    @Body() verifyOtpByEmailDto: VerifyOtpByEmailDto,
  ) {
    return this.authService.verifyOtp(user, verifyOtpByEmailDto);
  }

  @Patch('change-info')
  updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @GetCurrentUser() user: UserType,
  ) {
    return this.authService.updateUser(updateUserDto, user);
  }

  @Patch('change-password')
  updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @GetCurrentUser() user: UserType,
  ) {
    return this.authService.updatePassword(updatePasswordDto, user);
  }

  @Public()
  @Patch('reset-password')
  resetPassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return this.authService.resetPassword(updatePasswordDto);
  }

  @Get('user')
  getCurrentUser(@GetCurrentUser() user: UserType) {
    return this.authService.getCurrentUser(user);
  }
}
