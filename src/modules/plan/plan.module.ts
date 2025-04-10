import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { User, UserSchema } from 'src/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Plan, PlanSchema } from 'src/schemas/plan.schema';
import { UserPlan, UserPlanSchema } from 'src/schemas/user-plan.schema';
import { AppConfigModule } from 'src/common/config/app-config.module';
import { Transaction, TransactionSchema } from 'src/schemas/transaction.schema';
import { Dispute, DisputeSchema } from 'src/schemas/dispute.schema';
import {
  SupportMessage,
  SupportMessageSchema,
} from 'src/schemas/support-message.schema';
import { Family, FamilySchema } from 'src/schemas/family.schema';
import { MailModule } from '../mail/mail.module';
import {
  ModeratorPlan,
  ModeratorPlanSchema,
} from 'src/schemas/moderator-plan.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Plan.name, schema: PlanSchema },
      { name: UserPlan.name, schema: UserPlanSchema },
      { name: Transaction.name, schema: TransactionSchema },
      { name: Dispute.name, schema: DisputeSchema },
      { name: SupportMessage.name, schema: SupportMessageSchema },
      { name: Family.name, schema: FamilySchema },
      { name: ModeratorPlan.name, schema: ModeratorPlanSchema },
    ]),
    AppConfigModule,
    MailModule,
  ],
  controllers: [PlanController],
  providers: [PlanService],
})
export class PlanModule {}
