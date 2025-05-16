import { Module } from '@nestjs/common';
import { ModeratorService } from './moderator.service';
import { ModeratorController } from './moderator.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BankAccount,
  BankAccountSchema,
} from 'src/schemas/bank-account.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UserService } from '../user/user.service';
import { Transaction } from '../transactions/entities/transaction.entity';
import { TransactionSchema } from 'src/schemas/transaction.schema';
import {
  ModeratorPlan,
  ModeratorPlanSchema,
} from 'src/schemas/moderator-plan.schema';
import { Family, FamilySchema } from 'src/schemas/family.schema';
import { Plan, PlanSchema } from 'src/schemas/plan.schema';
import {
  ModeratorReceipt,
  ModeratorReceiptSchema,
} from 'src/schemas/moderator-receipt.schema';

@Module({
  controllers: [ModeratorController],
  providers: [ModeratorService, UserService],
  imports: [
    MongooseModule.forFeature([
      { name: BankAccount.name, schema: BankAccountSchema },
      { name: User.name, schema: UserSchema },
      { name: Transaction.name, schema: TransactionSchema },
      { name: ModeratorPlan.name, schema: ModeratorPlanSchema },
      { name: ModeratorReceipt.name, schema: ModeratorReceiptSchema },
      { name: Family.name, schema: FamilySchema },
      { name: Plan.name, schema: PlanSchema },
    ]),
  ],
})
export class ModeratorModule {}
