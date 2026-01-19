import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SendOTPMailDto } from './dto/send-mail.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { SUPPORT_EMAIL } from 'src/common/constants/const';
import { SendFamilyLinkDto } from './dto/send-family-link.dto';
import { SendSupportDisputeDto } from './dto/send-support-dispute.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import {
  SendNewFamilyPromptDto,
  SendSupportMessageDto,
} from './dto/send-support-message.dto';

@Injectable()
export class MailService {
  constructor(
    private readonly mailService: MailerService,
    @InjectQueue('email') private readonly emailQueue: Queue,
    @InjectModel('User') private readonly userModel: Model<any> // Add this line
  ) {}

  public async sendOTPMail(sendOTPMailDto: SendOTPMailDto) {
    const { name, email, otp } = sendOTPMailDto;

    await this.mailService.sendMail({
      to: email,
      subject: 'You requested an OTP',
      template: './otp-notification',
      context: {
        name,
        otp,
      },
    });

    return 'This action adds a new mail';
  }

  public async sendSupportMessage(
    sendSupportMessageDto: SendSupportMessageDto,
  ) {
    const { message, email } = sendSupportMessageDto;

    await this.mailService.sendMail({
      to: SUPPORT_EMAIL,
      subject: 'Attention New Dispute',
      template: './support',
      context: {
        message,
        email,
      },
    });

    return 'This action adds a new mail';
  }

  public async sendSupportDisputeMessage(
    sendSupportDisputeDto: SendSupportDisputeDto,
  ) {
    const { name, message, planName, email } = sendSupportDisputeDto;

    await this.mailService.sendMail({
      to: SUPPORT_EMAIL,
      subject: 'Attention New Dispute',
      template: './dispute',
      context: {
        name,
        email,
        message,
        planName,
      },
    });

    return 'This action adds a new mail';
  }

  public async sendBroadcastEmail(
    userIds?: string[],
    message?: string,
    sendToAll?: boolean
  ) {
    if (!message) {
      throw new BadRequestException('Message is required');
    }

    let users;

    if (sendToAll) {
      // Fetch all users from database
      users = await this.userModel.find().select('email firstName').exec();
    } else if (userIds && userIds.length > 0) {
      // Fetch specific users by IDs
      users = await this.userModel
        .find({ _id: { $in: userIds } })
        .select('email firstName')
        .exec();
    } else {
      throw new BadRequestException(
        'Either userIds or sendToAll must be provided'
      );
    }

    if (!users || users.length === 0) {
      throw new BadRequestException('No users found in database');
    }

    const jobs = await Promise.all(
      users.map(user =>
        this.emailQueue.add(
          'broadcast',
          {
            email: user.email,
            firstname: user.firstName,
            message: message,
          },
          {
            attempts: 3,
            backoff: {
              type: 'exponential',
              delay: 2000,
            },
          }
        )
      )
    );

    return {
      message: 'Broadcast email queued successfully',
      total: users.length,
      users: users.map(u => ({ email: u.email, name: u.firstName }))
    };
  }

  public async sendUserFamilyLink(sendFamilyLinkDto: SendFamilyLinkDto) {
    try {
      const {
        name,
        email,
        familyLink,
        presidyLink,
        planName,
        specialDetails,
        moderatorDetails,
        webDetails,
        moderatorEmail,
      } = sendFamilyLinkDto;

      console.log(sendFamilyLinkDto);
      console.log('sendFamilyLinkDto....');

      if (!specialDetails) {
        await this.mailService.sendMail({
          to: email,
          subject: 'Welcome to the Family',
          template: './family-link',
          context: {
            name,
            familyLink,
            planName,
          },
        });
      } else if (moderatorDetails) {
        await this.mailService.sendMail({
          to: email,
          subject: 'Welcome to the Family',
          template: './family-link-moderator',
          context: {
            name,
            familyLink,
            planName,
          },
        });

        await this.mailService.sendMail({
          to: moderatorEmail,
          subject: 'Family Invite Needed',
          template: './moderator-alert',
          context: {
            email,
            planName,
          },
        });
      } else if (webDetails) {
        console.log('here', {
          to: email,
          subject: 'Welcome to the Family',
          template: './family-link-extra',
          context: {
            name,
            presidyLink,
            planName,
          },
        });

        await this.mailService.sendMail({
          to: email,
          subject: 'Welcome to the Family',
          template: './family-link-extra',
          context: {
            name,
            familyLink: presidyLink,
            planName,
          },
        });
      }

      return 'This action adds a new mail';
    } catch (error) {
      console.log(error);
      console.log('error....');
    }
  }
  public async testSendUserFamilyLink(sendFamilyLinkDto: SendFamilyLinkDto) {
    try {
      const {
        name,
        email,
        familyLink,
        presidyLink,
        planName,
        specialDetails,
        moderatorDetails,
        webDetails,
        moderatorEmail,
      } = sendFamilyLinkDto;

      console.log(sendFamilyLinkDto);
      console.log('sendFamilyLinkDto....');

      if (!specialDetails) {
        await this.mailService.sendMail({
          to: email,
          subject: 'Welcome to the Family',
          template: './family-link',
          context: {
            name,
            familyLink,
            planName,
          },
        });
      } else if (moderatorDetails) {
        await this.mailService.sendMail({
          to: email,
          subject: 'Welcome to the Family',
          template: './family-link-moderator',
          context: {
            name,
            familyLink,
            planName,
          },
        });

        await this.mailService.sendMail({
          to: moderatorEmail,
          subject: 'Family Invite Needed',
          template: './moderator-alert',
          context: {
            email,
            planName,
          },
        });
      } else if (webDetails) {
        console.log('here', {
          to: email,
          subject: 'Welcome to the Family',
          template: './family-link-extra',
          context: {
            name,
            presidyLink,
            planName,
          },
        });

        await this.mailService.sendMail({
          to: email,
          subject: 'Welcome to the Family',
          template: './family-link-extra',
          context: {
            name,
            familyLink: presidyLink,
            planName,
          },
        });
      }

      return 'This action adds a new mail';
    } catch (error) {
      console.log(error);
      console.log('error....');
    }
  }
  public async sendNewFamilyPrompt(
    sendNewFamilyPromptDto: SendNewFamilyPromptDto,
  ) {
    const { planName, email, familyId } = sendNewFamilyPromptDto;

    await this.mailService.sendMail({
      to: SUPPORT_EMAIL,
      subject: 'ASAP Add new Family with member',
      template: './new-family',
      context: {
        email,
        planName,
        familyId,
      },
    });

    return 'This action adds a new mail';
  }
}
