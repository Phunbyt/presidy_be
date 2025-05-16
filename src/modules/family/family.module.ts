import { Module } from '@nestjs/common';
import { FamilyService } from './family.service';
import { FamilyController } from './family.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Family, FamilySchema } from 'src/schemas/family.schema';
import { Plan, PlanSchema } from 'src/schemas/plan.schema';

@Module({
  controllers: [FamilyController],
  providers: [FamilyService],
  imports: [
    MongooseModule.forFeature([
      { name: Family.name, schema: FamilySchema },
      { name: Plan.name, schema: PlanSchema },
    ]),
  ],
})
export class FamilyModule {}
