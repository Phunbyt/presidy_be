import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateModeratorDto } from './dto/create-moderator.dto';
import { UpdateModeratorDto } from './dto/update-moderator.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BankAccount } from 'src/schemas/bank-account.schema';
import { UserService } from '../user/user.service';
import { UserType } from 'src/common/constants/types';
import { Transaction } from 'src/schemas/transaction.schema';
import { ModeratorPlan } from 'src/schemas/moderator-plan.schema';
import { CreatePlanDto } from './dto/create-plan.dto';
import { Family } from 'src/schemas/family.schema';
import { Plan } from 'src/schemas/plan.schema';
import { ModeratorReceipt } from 'src/schemas/moderator-receipt.schema';
import { uploadFile } from 'src/common/helpers/fileUpload.helper';
import * as OTPEngine from 'generate-password';

@Injectable()
export class ModeratorService {
  constructor(
    @InjectModel(BankAccount.name) private bankAccountModel: Model<BankAccount>,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    @InjectModel(ModeratorReceipt.name)
    private moderatorReceiptModel: Model<ModeratorReceipt>,
    @InjectModel(ModeratorPlan.name)
    private moderatorPlanModel: Model<ModeratorPlan>,
    @InjectModel(Family.name) private familyModel: Model<Family>,
    @InjectModel(Plan.name) private planModel: Model<Plan>,

    private userService: UserService,
  ) {}

  async create(createModeratorDto: CreateModeratorDto, user: UserType) {
    await this.bankAccountModel.create({
      ...createModeratorDto,
      user: user._id,
    });

    await this.userService.updateUser(
      {
        isModerator: true,
        phoneNumber: createModeratorDto.phoneNumber,
      },
      user,
    );

    const moderator = await this.userService.findUserByEmail({
      email: user.email,
    });

    return moderator;
  }
  async addBankAccount(createModeratorDto: CreateModeratorDto, user: UserType) {
    const newBankAccount = await this.bankAccountModel.create({
      ...createModeratorDto,
      user: user._id,
    });

    await this.userService.updateUser(
      {
        isModerator: true,
      },
      user,
    );

    return newBankAccount;
  }

  async addPlan(createPlanDto: CreatePlanDto, user: UserType) {
    // find plan
    const planQuery = {
      _id: new Types.ObjectId(createPlanDto.planId),
    };

    const existingPlan = await this.planModel.findOne(planQuery);

    if (!existingPlan) {
      throw new BadRequestException('Plan does not exist');
    }
    // use needed plan infor to populate family model

    const familyUrlId = OTPEngine.generate({
      length: 10,
      numbers: true,
      uppercase: true,
      symbols: false,
      lowercase: true,
    });

    console.log(createPlanDto);
    console.log('createPlanDto....');

    const family = await this.familyModel.create({
      ...createPlanDto,
      planId: new Types.ObjectId(createPlanDto.planId),
      familyActiveMembers: 0,
      familyUrlId,
      familyMembersLimit: existingPlan.familySize,
      presidyLink: `https://www.presidy.com/family/${familyUrlId}`,
    });
    // use needed plan infor to populate moderator plan model model

    const moderatorPlan = await this.moderatorPlanModel.create({
      ...createPlanDto,
      planId: new Types.ObjectId(createPlanDto.planId),
      user: new Types.ObjectId(user._id),
      familyLink: createPlanDto.familyLink,
      familyMembersLimit: existingPlan.familySize,
      familyActiveMembers: 0,
    });

    return {
      family,
      moderatorPlan,
    };
  }

  async getDashboardData(user: UserType) {
    const transactions = await this.transactionModel
      .find({
        user: user._id,
        isModerator: true,
      })
      .populate('planId')
      .sort({ createdAt: -1 });

    const bankAccounts = await this.bankAccountModel.find({
      user: user._id,
    });

    const moderatorPlans = await this.moderatorPlanModel
      .find({
        user: user._id,
      })
      .populate('planId')
      .sort({ createdAt: -1 });

    const moderatorReceipts = await this.moderatorReceiptModel
      .find({ user: user._id })
      .populate({
        path: 'planId',
        populate: {
          path: 'planId', // this is the planId inside ModeratorPlan
          model: 'Plan',
        },
      })
      .sort({ createdAt: -1 });
    const structuredModeratorPlans = moderatorPlans.map((plan) => {
      return {
        id: plan._id,
        name: plan.planId.name,
        specialEmail: plan.planId.specialEmail,
        status: plan.planId.status,
        familyLink: plan.familyLink,
        familyActiveMembers: plan.familyActiveMembers,
        familyMembersLimit: plan.familyMembersLimit,
      };
    });

    const existingPlans = await this.planModel.find();

    const emptyPlans = await Promise.all(
      existingPlans.map(async (plan) => {
        const familyInfo = await this.familyModel.findOne({
          planId: new Types.ObjectId(plan._id),
          familyActiveMembers: {
            $lt: plan.familySize,
          },
          familyLink: {
            $ne: '',
          },
        });

        if (!familyInfo) {
          return plan;
        }
      }),
    );

    return {
      transactions,
      bankAccounts,
      moderatorReceipts,
      moderatorPlans: structuredModeratorPlans.filter(Boolean),
      emptyPlans: emptyPlans.filter(Boolean),
    };
  }

  async getAvailablePlans(user: UserType) {
    const existingPlans = await this.planModel.find();

    const emptyPlans = existingPlans.map(async (plan) => {
      const familyInfo = await this.familyModel.findOne({
        planId: new Types.ObjectId(plan._id),
        familyActiveMembers: {
          $lt: plan.familySize,
        },
        familyLink: {
          $ne: '',
        },
      });

      if (!familyInfo) {
        return plan;
      }
    });
    return emptyPlans;
  }

  async uploadFile(file, user, planIdValue) {
    const receiptLink = await uploadFile({
      key: `${Date.now()}${user._id}`,
      body: file.buffer,
    });

    const newModeratorReceipt = await this.moderatorReceiptModel.create({
      user: user._id,
      planId: new Types.ObjectId(planIdValue),
      receiptLink,
    });

    const moderatorReceipt = await this.moderatorReceiptModel
      .findOne({ user: user._id, _id: newModeratorReceipt._id })
      .populate({
        path: 'planId',
        populate: {
          path: 'planId', // this is the planId inside ModeratorPlan
          model: 'Plan',
        },
      });

    return moderatorReceipt;
  }
}
