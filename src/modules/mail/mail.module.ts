import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path'; // Ensure this is imported
import { AppConfigModule } from 'src/common/config/app-config.module';
import { AppConfigService } from 'src/common/config/app-config.service';
import { BullModule } from '@nestjs/bull';
import { MailProcessor } from './mail.processor';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schemas/user.schema';
import { UserPlan, UserPlanSchema } from 'src/schemas/user-plan.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema },
      {name:'UserPlan',schema: UserPlanSchema}
    ]),
    BullModule.registerQueue({
      name: 'email',
    }),
    MailerModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: async (configService: AppConfigService) => ({
        transport: {
          host: configService.emailHost,
          port: Number(configService.emailPort),
          auth: {
            user: configService.emailUsername,
            pass: configService.emailPassword,
          },
        },
        defaults: {
          from: '"Presidy" <donotreply@presidy.com>',
        },
        template: {
          // This automatically points to the folder next to this module in 'dist'
          dir: join(__dirname, 'templates'), 
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
        options: {
          partials: {
            // FIX: Use comma separation for cross-platform path joining
            dir: join(__dirname, 'templates', 'partials'), 
            options: {
              strict: true,
            },
          },
        },
      }),
    }),
  ],
  controllers: [MailController],
  providers: [MailService, MailProcessor],
  exports: [MailService],
})
export class MailModule {}