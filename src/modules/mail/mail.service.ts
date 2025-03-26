import { Injectable } from '@nestjs/common';
import { SendOTPMailDto } from './dto/send-mail.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { SUPPORT_EMAIL } from 'src/common/constants/const';
import { SendFamilyLinkDto } from './dto/send-family-link.dto';
import { SendSupportDisputeDto } from './dto/send-support-dispute.dto';
import {
  SendNewFamilyPromptDto,
  SendSupportMessageDto,
} from './dto/send-support-message.dto';

@Injectable()
export class MailService {
  constructor(private readonly mailService: MailerService) {
    this.mailService = mailService;
  }

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

  public async sendUserFamilyLink(sendFamilyLinkDto: SendFamilyLinkDto) {
    try {
      const { name, email, familyLink, planName } = sendFamilyLinkDto;

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

      return 'This action adds a new mail';
    } catch (error) {
      console.log(error);
      console.log('error.... emial');
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
