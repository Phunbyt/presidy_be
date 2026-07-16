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
import { UserSchema } from 'src/schemas/user.schema';
import { Queue } from 'bull';
import { UserPlan } from 'src/schemas/user-plan.schema';
import { BulkEmailDto } from './dto/bulk-email.dto';
import { SingleEmailDto } from './dto/single-email.dto';
import { join } from 'path';
import { SendPaymentFailedDto } from './dto/send-payment-failed.dto';
import { SendSubscriptionCancelledDto } from './dto/send-subscription-cancelled.dto';
import { SendSubscriptionConfirmedDto } from './dto/send-subscription-confirmed.dto';
import { SendCardExpiringDto } from './dto/send-card-expiring.dto';
import { SendUpcomingInvoiceDto } from './dto/send-upcoming-invoice.dto';
import {
  SendNewFamilyPromptDto,
  SendSupportMessageDto,
} from './dto/send-support-message.dto';

@Injectable()
export class MailService {
  constructor(
    private readonly mailService: MailerService,
    @InjectQueue('email') private readonly emailQueue: Queue,
    @InjectModel('User') private readonly userModel: Model<any>,
    @InjectModel('UserPlan') private readonly userPlan:Model<UserPlan>   
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

  // Services For the admin dashoard
async sendBulkEmail(bulkEmailDto: BulkEmailDto) {
    const { subject, message, userIds } = bulkEmailDto;

    const users = await this.userModel
        .find({ _id: { $in: userIds } })
        .select('_id email firstName')
        .exec();

    if (!users || users.length === 0) {
        throw new BadRequestException('No matching recipients found');
    }

    await Promise.all(
        users.map((user) =>
            this.emailQueue.add(
                'bulk-email',
                {
                    email: user.email,
                    firstName: user.firstName,
                    subject,
                    message, // raw message — {name} replaced in the processor per recipient
                },
                {
                    attempts: 3,
                    backoff: { type: 'exponential', delay: 2000 },
                    removeOnComplete: true,
                    removeOnFail: false,
                },
            ),
        ),
    );

    return { queued: true, total: users.length };
}
async sendSingleEmail(singleEmailDto: SingleEmailDto) {
    const { email, subject, message } = singleEmailDto;

    const existingUser = await this.userModel.findOne({ email }).select('firstName');
    const firstName = existingUser?.firstName ?? email.split('@')[0];

    const personalizedMessage = message.replace(/{name}/g, firstName);

    await this.mailService.sendMail({
        to: email,
        subject,
        template: join(__dirname, 'templates', 'broadcast_email'),
        context: { firstName, message: personalizedMessage },
    });

    return { sent: true, to: email };
}

    async getEmailStats(){
        const userPlan = (await this.userPlan.find().select('user').lean())
        const activeIds = userPlan.map((up:any) => up.user.toString());
        const total =  await this.userModel.countDocuments();
        const users = await this.userModel.countDocuments({isModerator:false});
        const moderators = await this.userModel.countDocuments({isModerator:true});
        const active = await this.userModel.countDocuments({ _id: {$in: activeIds}});
        const inactive = await this.userModel.countDocuments({ _id: {$nin: activeIds}})

        return {total, users, moderators, active, inactive};
    }
// Services for the Paystack WebHooks

public async sendPaymentFailedEmail(sendPaymentFailedDto: SendPaymentFailedDto) {
    try {
        const { name, email, planName } = sendPaymentFailedDto;

        await this.mailService.sendMail({
            to: email,
            subject: 'Payment Failed — Action Needed',
            template: './payment-failed',
            context: {
                name,
                planName,
            },
        });

        return 'This action adds a new mail';
    } catch (error) {
        console.log(error);
        console.log('error....sendPaymentFailedEmail');
    }
}

public async sendSubscriptionCancelledEmail(sendSubscriptionCancelledDto: SendSubscriptionCancelledDto) {
    try {
        const { name, email, planName, message } = sendSubscriptionCancelledDto;

        await this.mailService.sendMail({
            to: email,
            subject: 'Subscription Update',
            template: './subscription-cancelled',
            context: {
                name,
                planName,
                message,
            },
        });

        return 'This action adds a new mail';
    } catch (error) {
        console.log(error);
        console.log('error....sendSubscriptionCancelledEmail');
    }
}

public async sendSubscriptionConfirmedEmail(sendSubscriptionConfirmedDto: SendSubscriptionConfirmedDto) {
    try {
        const { name, email, planName, amount } = sendSubscriptionConfirmedDto;

        await this.mailService.sendMail({
            to: email,
            subject: "You're All Set!",
            template: './subscription-confirmed',
            context: {
                name,
                planName,
                amount,
            },
        });

        return 'This action adds a new mail';
    } catch (error) {
        console.log(error);
        console.log('error....sendSubscriptionConfirmedEmail');
    }
}

public async sendCardExpiringEmail(sendCardExpiringDto: SendCardExpiringDto) {
    try {
        const { name, email, planName } = sendCardExpiringDto;

        await this.mailService.sendMail({
            to: email,
            subject: 'Your Card Is Expiring Soon',
            template: './card-expiring',
            context: {
                name,
                planName,
            },
        });

        return 'This action adds a new mail';
    } catch (error) {
        console.log(error);
        console.log('error....sendCardExpiringEmail');
    }
}

public async sendUpcomingInvoiceEmail(sendUpcomingInvoiceDto: SendUpcomingInvoiceDto) {
    try {
        const { name, email, planName, amount } = sendUpcomingInvoiceDto;

        await this.mailService.sendMail({
            to: email,
            subject: 'Upcoming Renewal',
            template: './upcoming-invoice',
            context: {
                name,
                planName,
                amount,
            },
        });

        return 'This action adds a new mail';
    } catch (error) {
        console.log(error);
        console.log('error....sendUpcomingInvoiceEmail');
    }
}

async sendOfflineUserAddedEmails(params: {
    memberName: string;
    memberEmail: string;
    memberPhone: string;
    moderatorName: string;
    moderatorEmail: string;
    planName: string;
    subscriptionDuration?: string;
    currentCount: number;
    familyLimit: number;
}) {
    const {
        memberName, memberEmail, memberPhone,
        moderatorName, moderatorEmail, planName,
        subscriptionDuration, currentCount, familyLimit,
    } = params;

    try {
        // Email #1 — welcomes the new offline member to the family
        await this.mailService.sendMail({
            to: memberEmail,
            subject: `Welcome to ${moderatorName}'s ${planName} Family`,
            template: './offline-user-welcome',
            context: {
                name: memberName,
                moderatorName,
                planName,
                subscriptionDuration: subscriptionDuration ?? 'N/A',
            },
        });

        // Email #2 — notifies the moderator that someone was added to their family
        await this.mailService.sendMail({
            to: moderatorEmail,
            subject: `New Member Added — ${planName}`,
            template: './offline-user-added-moderator',
            context: {
                moderatorName, memberName, memberEmail, memberPhone, planName,
                subscriptionDuration: subscriptionDuration ?? 'N/A',
                currentCount, familyLimit,
            },
        });
    } catch (error) {
        // matches the try/catch pattern already used elsewhere in this file —
        // a failed email should never crash the request that triggered it
        console.log(error);
        console.log('sendOfflineUserAddedEmails error....');
    }
}


}
