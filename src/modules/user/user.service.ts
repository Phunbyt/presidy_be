import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { UserType } from 'src/common/constants/types';
import { UpdatePasswordDto } from '../auth/dto/signup.dto';
import { hashDataWithBycrypt } from 'src/common/helpers/bycrypt.helper';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  public async create(createUserDto: CreateUserDto) {
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      country,
      isVerified = false,
    } = createUserDto;

    const user = await this.userModel.create({
      firstName,
      lastName,
      username,
      country,
      email,
      password,
      isVerified,
    });

    return user;
  }

  async findUserByEmail({ email }) {
    const user = await this.userModel.findOne({ email });

    return user;
  }

  async updateUser(updateUserDto: UpdateUserDto, currentUser: UserType) {
    const {
      firstName,
      lastName,
      username,
      isVerified,
      isModerator,
      phoneNumber,
    } = updateUserDto;
    const { email } = currentUser;

    const user = await this.findUserByEmail({ email });

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const update = {
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      username: username || user.username,
      isVerified: isVerified || user.isVerified,
      isModerator: isModerator || user.isModerator,
      phoneNumber: phoneNumber || user.phoneNumber,
    };

    await this.userModel.updateOne({ email }, { $set: update }, { new: true });

    return 'user updated successfully';
  }

  async updatePassword(
    updatePasswordDto: UpdatePasswordDto,
    currentUser: UserType,
  ) {
    const { password } = updatePasswordDto;
    const { email } = currentUser;

    const user = await this.findUserByEmail({ email });

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const hashedPassword = await hashDataWithBycrypt(password);

    const update = {
      password: hashedPassword || user.password,
    };

    await this.userModel.updateOne({ email }, { $set: update }, { new: true });

    return user;
  }

  async findUserById(id: string) {
    const user = await this.userModel.findOne({ _id: id });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }
}
