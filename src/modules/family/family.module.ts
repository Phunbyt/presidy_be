import { Module } from '@nestjs/common';
import { FamilyService } from './family.service';
import { FamilyController } from './family.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Family, FamilySchema } from 'src/schemas/family.schema';

@Module({
  controllers: [FamilyController],
  providers: [FamilyService],
  imports: [
    MongooseModule.forFeature([{ name: Family.name, schema: FamilySchema }]),
  ],
})
export class FamilyModule {}
