import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from 'src/schemas/user.schema';
import { ModeratorPlan, ModeratorPlanSchema } from 'src/schemas/moderator-plan.schema';
import { Plan, PlanSchema } from 'src/schemas/plan.schema';
import { UserPlan, UserPlanSchema } from 'src/schemas/user-plan.schema';
import { MailModule } from '../mail/mail.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: ModeratorPlan.name, schema: ModeratorPlanSchema },
      { name: Plan.name, schema: PlanSchema },
      { name: UserPlan.name, schema: UserPlanSchema },
    ]),
    MailModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
