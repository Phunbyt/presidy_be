import { Injectable } from '@nestjs/common';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Family } from 'src/schemas/family.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class FamilyService {
  constructor(@InjectModel(Family.name) private familyModel: Model<Family>) {}

  async create(createFamilyDto: CreateFamilyDto) {
    const family = await this.familyModel.create({
      ...createFamilyDto,
      planId: new Types.ObjectId(createFamilyDto.planId),
      familyActiveMembers: 0,
    });
    return family;
  }

  findAll() {
    return `This action returns all family`;
  }

  findOne(id: number) {
    return `This action returns a #${id} family`;
  }

  update(id: number, updateFamilyDto: UpdateFamilyDto) {
    return `This action updates a #${id} family`;
  }

  remove(id: number) {
    return `This action removes a #${id} family`;
  }
}
