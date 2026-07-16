import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Plan } from 'src/schemas/plan.schema';
import { Model, Types } from 'mongoose';
import { UserPlan } from 'src/schemas/user-plan.schema';
import { UserType } from 'src/common/constants/types';
import { PlanStatus } from 'src/common/constants/enums';
import axios from 'axios';
import { AppConfigService } from 'src/common/config/app-config.service';
import { Transaction } from 'src/schemas/transaction.schema';
import { currencyFormatter } from 'src/common/helpers/currency-formatter.helper';
import { convertISOToDDMMYYYY } from 'src/common/helpers/date-formatter.helper';
import { PlanDisputeDto, SupportMessageDto } from './dto/plan-dispute.dto';
import { Dispute } from 'src/schemas/dispute.schema';
import { SupportMessage } from 'src/schemas/support-message.schema';
import { Family } from 'src/schemas/family.schema';
import { MailService } from '../mail/mail.service';
import { User } from 'src/schemas/user.schema';
import { SubscribeDto } from './dto/subscribe.dto';
import { ModeratorPlan } from 'src/schemas/moderator-plan.schema';
// import { metadata } from 'reflect-metadata/no-conflict';
// import { string } from 'joi';

@Injectable()
export class PlanService {
  constructor(
    @InjectModel(Plan.name) private planModel: Model<Plan>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserPlan.name) private userPlanModel: Model<UserPlan>,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    @InjectModel(Dispute.name) private disputeModel: Model<Dispute>,
    @InjectModel(Family.name) private familyModel: Model<Family>,
    @InjectModel(SupportMessage.name)
    private supportMessageModel: Model<SupportMessage>,
    @InjectModel(ModeratorPlan.name)
    private moderatorPlanModel: Model<ModeratorPlan>,
    private appConfigService: AppConfigService,
    private mailService: MailService,
  ) {}
  async create(createPlanDto: CreatePlanDto) {
    const price = Math.round(createPlanDto.price);

    const plan = await this.planModel.create({ ...createPlanDto, price });

    return plan;
  }

  async findAll(user: UserType) {
    const userPlans = await this.userPlanModel
      .findOne({ user: user._id })
      .populate({ path: 'planIds', match: { status: 'active' } });

    if (!userPlans) {
      return [];
    }
    return userPlans;
  }
  async findAllPublicPlans() {
    const publicPlans = await this.planModel.find({ status: 'active' });

    if (!publicPlans) {
      return [];
    }

    return publicPlans;
  }

  async joinPlan(userId: string, planId: string, planEmail: string) {
    try {
      const query = {
        user: new Types.ObjectId(userId),
      };

      const userQuery = {
        _id: new Types.ObjectId(userId),
      };

      const planQuery = {
        _id: new Types.ObjectId(planId),
      };

      const existingPlan = await this.planModel.findOne(planQuery);
      const user = await this.userModel.findOne(userQuery);

      if (!existingPlan) {
        throw new BadRequestException('Plan does not exist');
      }

      const foundPlan = await this.userPlanModel
        .findOne(query)
        .populate('user');

      const planIds = foundPlan?.planIds || [];

      if (planIds.includes(planId as any)) {
        throw new BadRequestException('User is already in the plan');
      }

      const updatedPlanList = [
        ...new Set([...planIds, planId].filter(Boolean)),
      ];

      await this.userPlanModel.updateOne(
        query,
        {
          $set: {
            planIds: updatedPlanList,
          },
        },
        { upsert: true },
      );

      await this.planModel.updateOne(planQuery, {
        $inc: {
          members: 1,
        },
      });

      const familyInfo = await this.familyModel.findOne({
        planId: new Types.ObjectId(planId),
        familyActiveMembers: {
          $lt: existingPlan.familySize,
        },
        familyLink: {
          $ne: '',
        },
      });

      if (!familyInfo) {
        const newFamily = await this.familyModel.create({
          users: [new Types.ObjectId(userId)],
          planId: new Types.ObjectId(planId),
          familyMembersLimit: existingPlan.familySize,
          familyActiveMembers: 1,
        });

        await this.mailService.sendNewFamilyPrompt({
          planName: existingPlan.name,
          email: planEmail,
          familyId: newFamily._id as unknown as string,
        });

        return updatedPlanList;
      }

      const updatedFamilyUserList = [
        ...new Set(
          [...familyInfo.users, new Types.ObjectId(userId)].filter(Boolean),
        ),
      ];

      const familyInfoQuery = {
        planId: new Types.ObjectId(planId),
      };

      await this.familyModel.updateOne(
        {
          planId: new Types.ObjectId(planId),
          familyActiveMembers: {
            $lt: existingPlan.familySize,
          },
        },
        {
          $set: {
            users: updatedFamilyUserList,
          },
          $inc: {
            familyActiveMembers: 1,
          },
        },
        { upsert: true },
      );
      await this.moderatorPlanModel.updateOne(
        {
          planId: new Types.ObjectId(planId),
          familyActiveMembers: {
            $lt: existingPlan.familySize,
          },
        },
        {
          $set: {
            users: updatedFamilyUserList,
          },
          $inc: {
            familyActiveMembers: 1,
          },
        },
        { upsert: true },
      );
      // send notification to user

      const moderatorPlan = await this.moderatorPlanModel
        .findOne({
          planId: new Types.ObjectId(planId),
          familyActiveMembers: {
            $lt: existingPlan.familySize,
          },
        })
        .populate('user');

      await this.mailService.sendUserFamilyLink({
        name: user.firstName,
        email: planEmail,
        familyLink: familyInfo.familyLink,
        presidyLink: familyInfo.presidyLink,
        planName: existingPlan.name,
        planId: existingPlan._id as unknown as string,
        specialDetails: existingPlan.specialDetails,
        moderatorDetails: existingPlan.moderatorDetails,
        webDetails: existingPlan.webDetails,
        moderatorEmail: moderatorPlan.user.email,
      });

      return updatedPlanList;
    } catch (error) {}
  }

  async findAllAvailablePlans(user: UserType) {
    const query = {
      user: user._id,
    };

    const foundPlan = await this.userPlanModel.findOne(query);

    const planIds = foundPlan?.planIds || [];

    const availablePlans = await this.planModel
      .find({
        _id: {
          $nin: planIds,
        },
        status: PlanStatus.ACTIVE,
      })
      .sort({ members: -1 });

    return availablePlans;
  }

  async subscribeToPlan(user: UserType, subscribeDto: SubscribeDto) {
    try {
      const { planId, email } = subscribeDto;

      const foundPlan = await this.planModel.findOne({
        _id: new Types.ObjectId(planId),
        status: PlanStatus.ACTIVE,
      });

      if (!foundPlan) {
        throw new NotFoundException('Plan not found');
      }

      const familyInfo = await this.familyModel.findOne({
        planId: new Types.ObjectId(planId),
        familyActiveMembers: {
          $lt: foundPlan.familySize,
        },
        familyLink: {
          $ne: '',
        },
      });

      if (!familyInfo) {
        return {
          canBeModerator: true,
          message: 'Family is unavalable at the moment',
        };
      }

      // todo: check to confirm special email plans

      const url = this.appConfigService.paystackUrl;
      const payload = {
        amount: foundPlan.price,
        email: user.email,
        plan: foundPlan.planCode,
        metadata: {
          userId: user._id,
          planId: foundPlan._id,
          email: email,
        },
      };

      const { data } = await axios.post(url, payload, {
        headers: {
          authorization: `Bearer ${this.appConfigService.paystackSK}`,
        },
      });

      return { paymentLink: data.data.authorization_url };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async retryPayment(user: UserType,subscribeDto: SubscribeDto ) {
      const { planId, email } = subscribeDto;
    try {
      const foundPlan = await this.planModel.findOne({
        _id: new Types.ObjectId(planId),
        status: PlanStatus.ACTIVE,
      });
      if (!foundPlan) {
        throw new NotFoundException('Plan not found');
      }
      const url = this.appConfigService.paystackUrl;
      const payload = {
        amount: foundPlan.price,
        email: email,
        plan: foundPlan.planCode,
        metadata: {
          userId:user._id,
          planId: foundPlan._id,
          email,
        },
      };

      const { data } = await axios.post(url, payload, {
        headers: {
          authorization: `Bearer ${this.appConfigService.paystackSK}`,
        },
      });
      return { paymentLink: data.data.authorization_url };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async planTransactions(user: UserType) {
    try {
      const transactions = await this.transactionModel
        .find({
          user: user._id,
        })
        .populate('planId');

      if (!transactions) {
        return [];
      }
      const structuredTransaction = transactions.map((transaction: any) => ({
        _id: transaction._id,
        createdAt: convertISOToDDMMYYYY(transaction.createdAt),
        status: transaction.status,
        amount: currencyFormatter(transaction.amount),
        currency: transaction.currency,
        channel: transaction.channel,
        txRef: transaction.txRef,
        planName: transaction.planId.name,
        planLogo: transaction.planId.logoUrl,
      }));
      return structuredTransaction;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async planDispute(user: UserType, planDisputeDto: PlanDisputeDto) {
    // check plan in db
    const { planId, dispute } = planDisputeDto;
    const query = {
      user: user._id,
    };

    const foundPlan = await this.planModel.findOne({
      _id: planId,
    });

    if (!foundPlan) {
      throw new NotFoundException('Plan not found');
    }
    const foundUserPlan = await this.userPlanModel.findOne(query);

    if (!foundUserPlan) {
      throw new NotFoundException('User Plans not found');
    }

    const subscribedPlan = foundUserPlan.planIds.findIndex(
      (plan: any) => plan === planId,
    );

    if (subscribedPlan === -1) {
      throw new BadRequestException('User is not subscribed to the plan');
    }

    // record dispute
    const newDispute = await this.disputeModel.create({
      dispute,
      user: user._id,
      planId: new Types.ObjectId(planId),
    });

    await this.mailService.sendSupportDisputeMessage({
      name: user.firstName,
      message: dispute,
      planName: foundPlan.name,
      email: user.email,
    });

    return newDispute;
  }

  async supportMessage(supportMessageDto: SupportMessageDto) {
    // check plan in db
    const { message, email } = supportMessageDto;

    // record message

    const newDispute = await this.supportMessageModel.create({
      message,
      user: email,
    });

    // send email to admin
    await this.mailService.sendSupportMessage({
      message,
      email: email,
    });

    return newDispute;
  }

  // Get Plans For Admin
    async getPlans() {
        const data = await this.planModel.find().select('name logoUrl price').exec();
        return { data };
    }

    // Paystack Webhooks
async handlePaymentFailed(userId: string, planId: string, email: string) {
    try {
        const foundUser = await this.userModel.findById(userId);
        const foundPlan = await this.planModel.findById(planId);
        if (!foundUser || !foundPlan) return;

        await this.mailService.sendPaymentFailedEmail({
            email: foundUser.email,
            name: foundUser.firstName,
            planName: foundPlan.name,
        });
    } catch (error) {
        console.log(error);
        console.log('error.....handlePaymentFailed');
    }
}

async handleSubscriptionDisabled(userId: string, planId: string, email: string) {
    try {
        const foundUser = await this.userModel.findById(userId);
        const foundPlan = await this.planModel.findById(planId);
        if (!foundUser || !foundPlan) return;

        const moderatorPlan = await this.moderatorPlanModel.findOne({
            users: { $in: [foundUser._id] },
        });

        if (moderatorPlan) {
            moderatorPlan.users = moderatorPlan.users.filter(
                (id: any) => id.toString() !== foundUser._id.toString(),
            );
            await moderatorPlan.save();
        }

        await this.mailService.sendSubscriptionCancelledEmail({
            email: foundUser.email,
            name: foundUser.firstName,
            planName: foundPlan.name,
            message: 'Your subscription has been disabled and access has ended.',
        });
    } catch (error) {
        console.log(error);
        console.log('error.....handleSubscriptionDisabled');
    }
}

async handleSubscriptionNotRenewing(userId: string, planId: string, email: string) {
    try {
        const foundUser = await this.userModel.findById(userId);
        const foundPlan = await this.planModel.findById(planId);
        if (!foundUser || !foundPlan) return;

        await this.mailService.sendSubscriptionCancelledEmail({
            email: foundUser.email,
            name: foundUser.firstName,
            planName: foundPlan.name,
            message: 'Your subscription will not renew after the current cycle.',
        });
    } catch (error) {
        console.log(error);
        console.log('error.....handleSubscriptionNotRenewing');
    }
}

async handleSubscriptionCreated(userId: string, planId: string, email: string) {
    try {
        const foundUser = await this.userModel.findById(userId);
        const foundPlan = await this.planModel.findById(planId);
        if (!foundUser || !foundPlan) return;

        await this.mailService.sendSubscriptionConfirmedEmail({
            email: foundUser.email,
            name: foundUser.firstName,
            planName: foundPlan.name,
            amount: foundPlan.price,
        });
    } catch (error) {
        console.log(error);
        console.log('error.....handleSubscriptionCreated');
    }
}

async handleCardExpiring(userId: string, planId: string, email: string) {
    try {
        const foundUser = await this.userModel.findById(userId);
        const foundPlan = await this.planModel.findById(planId);
        if (!foundUser || !foundPlan) return;

        await this.mailService.sendCardExpiringEmail({
            email: foundUser.email,
            name: foundUser.firstName,
            planName: foundPlan.name,
        });
    } catch (error) {
        console.log(error);
        console.log('error.....handleCardExpiring');
    }
}

async handleUpcomingInvoice(userId: string, planId: string, email: string) {
    try {
        const foundUser = await this.userModel.findById(userId);
        const foundPlan = await this.planModel.findById(planId);
        if (!foundUser || !foundPlan) return;

        await this.mailService.sendUpcomingInvoiceEmail({
            email: foundUser.email,
            name: foundUser.firstName,
            planName: foundPlan.name,
            amount: foundPlan.price,
        });
    } catch (error) {
        console.log(error);
        console.log('error.....handleUpcomingInvoice');
    }
}

}
