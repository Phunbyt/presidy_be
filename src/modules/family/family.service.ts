import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Family } from 'src/schemas/family.schema';
import { Model, Types } from 'mongoose';
import { Plan } from 'src/schemas/plan.schema';

@Injectable()
export class FamilyService {
  constructor(
    @InjectModel(Family.name) private familyModel: Model<Family>,
    @InjectModel(Plan.name) private planModel: Model<Plan>,
  ) {}

  async create(createFamilyDto: CreateFamilyDto) {
    const planQuery = {
      _id: new Types.ObjectId(createFamilyDto.planId),
    };

    const existingPlan = await this.planModel.findOne(planQuery);

    if (!existingPlan) {
      throw new BadRequestException('Plan does not exist');
    }

    const family = await this.familyModel.create({
      ...createFamilyDto,
      planId: new Types.ObjectId(createFamilyDto.planId),
      familyActiveMembers: 0,
      familyMembersLimit: existingPlan.familySize,
    });
    return family;
  }

  public async findOne(familyUrlId: string) {
    const family = await this.familyModel
      .findOne({ familyUrlId })
      .populate('planId');

    return {
      planName: family.planId.name,
      webDetailsData: family.webDetailsData,
      familyLink: family.familyLink,
    };
  }
}
