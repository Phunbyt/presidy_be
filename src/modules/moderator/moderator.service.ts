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

@Injectable()
export class ModeratorService {
  constructor(
    @InjectModel(BankAccount.name) private bankAccountModel: Model<BankAccount>,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
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

    const family = await this.familyModel.create({
      ...createPlanDto,
      planId: new Types.ObjectId(createPlanDto.planId),
      familyActiveMembers: 0,
      familyMembersLimit: existingPlan.familySize,
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

  findOne(id: number) {
    return `This action returns a #${id} moderator`;
  }

  update(id: number, updateModeratorDto: UpdateModeratorDto) {
    return `This action updates a #${id} moderator`;
  }

  remove(id: number) {
    return `This action removes a #${id} moderator`;
  }
}
