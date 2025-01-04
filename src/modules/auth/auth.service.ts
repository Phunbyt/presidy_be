import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import {
  SignInDto,
  SignUpDto,
  UpdatePasswordDto,
  UpdateUserDto,
  VerifyOtpByEmailDto,
} from './dto/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import * as OTPEngine from 'generate-password';

import {
  compareDataWithBycrypt,
  hashDataWithBycrypt,
} from 'src/common/helpers/bycrypt.helper';
import { MailService } from '../mail/mail.service';
import { Otp } from 'src/schemas/otp.schema';
import { UserService } from '../user/user.service';
import { UserType } from 'src/common/constants/types';
import { JwtService } from '@nestjs/jwt';
import { jwtDecode } from 'jwt-decode';
import { AppConfigService } from 'src/common/config/app-config.service';
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
  Config,
} from 'unique-names-generator';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Otp.name) private otpModel: Model<Otp>,
    private mailService: MailService,
    private userService: UserService,
    private jwtService: JwtService,
    private appConfigService: AppConfigService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { firstName, email, password } = signUpDto;

    console.log(signUpDto);
    console.log('signUpDto....');

    // find existing users

    const existingUser = await this.userService.findUserByEmail({ email });
    console.log(existingUser);

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const otpCredentials = await this.generateOTPCredentials();

    await this.saveEmailOTPCredentials({
      email,
      otp: `signup-${otpCredentials.hashedOTP}`,
    });

    //  hash user password
    const hashedPassword = await hashDataWithBycrypt(password);

    //  create user with userservice
    const newUser = await this.userService.create({
      ...signUpDto,
      password: hashedPassword,
    });

    const { accessToken } = await this.getToken({
      userId: newUser._id,
      email: newUser.email,
      role: 'user',
    });

    //  send otp to user email
    this.mailService.sendOTPMail({
      name: firstName.toUpperCase(),
      otp: otpCredentials.otp,
      email,
    });
    console.log({ newUser, accessToken });

    return { newUser, accessToken };
  }

  async signIn(signInDto: SignInDto) {
    // get user email and password
    const { email, password } = signInDto;

    // find user with user service
    const existingUser = await this.userService.findUserByEmail({
      email,
    });

    if (!existingUser) {
      throw new BadRequestException('Invalid credentials...');
    }

    // confirm passowrd and return user
    const passwordMatch = await compareDataWithBycrypt(
      password,
      existingUser.password,
    );

    if (!passwordMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    const { accessToken } = await this.getToken({
      userId: existingUser._id,
      email: existingUser.email,
      role: 'user',
    });

    return { existingUser, accessToken };
  }
  async signInWithApple(appleSignInToken: string) {
    // decode token
    const decoded: any = jwtDecode(appleSignInToken);

    const current = Date.now() / 1000;

    if (current >= decoded.exp) {
      throw new BadRequestException('Invalid credentials...');
    }

    if (!decoded.email_verified) {
      throw new BadRequestException('Only verified emails allowed...');
    }
    // get user email and password
    const { email } = decoded;

    // find user with user service
    const existingUser = await this.userService.findUserByEmail({
      email,
    });

    if (!existingUser) {
      throw new BadRequestException('Invalid credentials...');
    }

    const { accessToken } = await this.getToken({
      userId: existingUser._id,
      email: existingUser.email,
      role: 'user',
    });

    return { existingUser, accessToken };
  }

  async signInWithGoogle(googleSignInToken: string) {
    // decode token
    const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: 'Bearer ' + googleSignInToken },
    });

    const user = await response.json();
    // get user email and password
    const { email, verified_email } = user;

    if (!verified_email) {
      throw new BadRequestException('Only verified emails allowed...');
    }

    // find user with user service
    const existingUser = await this.userService.findUserByEmail({
      email,
    });

    if (!existingUser) {
      throw new BadRequestException('Invalid credentials...');
    }

    const { accessToken } = await this.getToken({
      userId: existingUser._id,
      email: existingUser.email,
      role: 'user',
    });

    return { existingUser, accessToken };
  }

  async signUpWithApple(appleSignUpPayload) {
    const {
      fullName,
      email: credentialEmail,
      realUserStatus,
      identityToken,
    } = appleSignUpPayload.credential;
    const decoded: any = jwtDecode(identityToken);
    const { firstName, lastName, username } = this.userUniqueInfo();

    const current = Date.now() / 1000;

    if (current >= decoded.exp) {
      throw new BadRequestException('Invalid credentials...');
    }

    if (!decoded.email_verified) {
      throw new BadRequestException('Only verified emails allowed...');
    }
    // get user email and password
    const { email: decodeEmail } = decoded;
    const email = credentialEmail || decodeEmail;

    if (realUserStatus !== 1) {
      throw new BadRequestException('Only real users allowed');
    }

    // find existing users

    const existingUser = await this.userService.findUserByEmail({ email });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const payload = {
      firstName: fullName.givenName || firstName,
      lastName: fullName.familyName || lastName,
      username: fullName.nickname || username,
      email,
    };

    //  hash user password
    const hashedPassword = await hashDataWithBycrypt(email);

    //  create user with userservice
    const newUser = await this.userService.create({
      ...payload,
      password: hashedPassword,
    });

    const { accessToken } = await this.getToken({
      userId: newUser._id,
      email: newUser.email,
      role: 'user',
    });

    return { newUser, accessToken };
  }

  async signUpWithGoogle(googleSignUpToken) {
    // decode token
    const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: 'Bearer ' + googleSignUpToken },
    });
    const { firstName, lastName, username } = this.userUniqueInfo();

    const user = await response.json();

    const { email, verified_email, family_name, given_name } = user;

    if (!verified_email) {
      throw new BadRequestException('Only verified emails allowed...');
    }

    // find existing users

    const existingUser = await this.userService.findUserByEmail({ email });
    console.log(existingUser);

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const otpCredentials = await this.generateOTPCredentials();

    await this.saveEmailOTPCredentials({
      email,
      otp: `signup-${otpCredentials.hashedOTP}`,
    });

    //  hash user password
    const password = email;
    const hashedPassword = await hashDataWithBycrypt(password);

    const payload = {
      firstName: given_name || firstName,
      lastName: family_name || lastName,
      username: given_name || username,
      email,
    };

    //  create user with userservice
    const newUser = await this.userService.create({
      ...payload,
      password: hashedPassword,
    });

    const { accessToken } = await this.getToken({
      userId: newUser._id,
      email: newUser.email,
      role: 'user',
    });

    console.log({ newUser, accessToken });

    return { newUser, accessToken };
  }

  async sendOtp(email: string) {
    console.log(email);
    console.log('email....');

    // get email
    // find user with user service
    const existingUser = await this.userService.findUserByEmail({
      email,
    });

    if (!existingUser) {
      throw new BadRequestException('User not found');
    }

    // create otp value
    const otpCredentials = await this.generateOTPCredentials();

    // send otp string to user email
    this.mailService.sendOTPMail({
      name: existingUser.firstName.toUpperCase(),
      otp: otpCredentials.otp,
      email,
    });

    //  store hash in db alongside initial route metadata

    await this.saveEmailOTPCredentials({
      email,
      otp: `reset-${otpCredentials.hashedOTP}`,
    });

    //  return true or false

    return {
      otp: otpCredentials.hashedOTP,
      to: email,
      emailStatus: 'Message Sent',
      status: true,
      email,
    };
  }

  async verifyOtp(verifyOtpByEmailDto: VerifyOtpByEmailDto) {
    // get email

    const { email, otp, route } = verifyOtpByEmailDto;

    // fecth otp and otp metadata from userservice
    const otpData = await this.otpModel.findOne({ email });

    if (!otpData) {
      throw new NotFoundException('User not found');
    }

    const comparevalue = otpData.otp.split('-');

    if (route !== comparevalue[0]) {
      throw new NotAcceptableException(
        'Kindly run the earlier operation before this',
      );
    }

    const verified = await compareDataWithBycrypt(otp, comparevalue[1]);

    // return true of false
    return {
      verified,
      status: verified,
      email,
    };
  }

  async updateUser(updateUserDto: UpdateUserDto, user: UserType) {
    // get info and update as needed
    // return updated info

    const updatedUser = await this.userService.updateUser(updateUserDto, user);
    return updatedUser;
  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto, user: UserType) {
    // get password and update as needed
    // return updated info
    const updatedUser = await this.userService.updatePassword(
      updatePasswordDto,
      user,
    );
    return updatedUser;
  }

  async resetPassword(updatePasswordDto: UpdatePasswordDto) {
    // get password and update as needed
    // return updated info
    const { email } = updatePasswordDto;

    const user = await this.userService.findUserByEmail({
      email,
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const updatedUser = await this.userService.updatePassword(
      updatePasswordDto,
      user,
    );
    return updatedUser;
  }

  async getCurrentUser(user: UserType) {
    // get password and update as needed
    // return updated info
    const { email } = user;

    const currentUser = await this.userService.findUserByEmail({
      email,
    });

    if (!currentUser) {
      throw new BadRequestException('User not found');
    }

    return currentUser;
  }

  private async generateOTPCredentials() {
    const otp = OTPEngine.generate({
      length: 6,
      numbers: true,
      uppercase: false,
      symbols: false,
      lowercase: false,
    });

    const hashedOTP = await hashDataWithBycrypt(otp);

    return { otp, hashedOTP };
  }

  private async saveEmailOTPCredentials(data) {
    const { email, otp } = data;

    const query = { email };
    const update = {
      $set: { otp },
    };
    const options = { upsert: true };

    await this.otpModel.updateOne(query, update, options);

    return;
  }

  private async getToken({
    userId,
    role,
    email,
  }: {
    userId: mongoose.Types.ObjectId;
    role: string;
    email: string;
  }) {
    const signOptions = (secret: string, expiresIn: number) => ({
      secret,
      expiresIn,
    });

    const tokenData = { sub: userId, email, role };

    const accessToken = await this.jwtService.signAsync(
      tokenData,
      signOptions(this.appConfigService.jwtAccessSecret, 60 * 60),
    );

    return {
      accessToken,
    };
  }

  private userUniqueInfo() {
    const customConfig: Config = {
      dictionaries: [adjectives, colors],
      length: 2,
    };

    const firstName: string = uniqueNamesGenerator({
      dictionaries: [colors, animals],
    });

    const lastName: string = uniqueNamesGenerator({
      dictionaries: [colors, animals],
    });

    const username: string = uniqueNamesGenerator(customConfig);

    console.log({
      firstName,
      lastName,
      username,
    });

    return {
      firstName,
      lastName,
      username,
    };
  }
}
