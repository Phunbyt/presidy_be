import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';

import { AppConfigModule } from './common/config/app-config.module';
import { AppConfigService } from './common/config/app-config.service';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { CurrentUserInterceptor } from './common/interceptors/user.interceptor';
import { AccessTokenGuard } from './common/guards/accessToken.guard';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { RolesGuard } from './common/guards/roles.guard';
import { PlanModule } from './modules/plan/plan.module';
import { PaystackHookModule } from './hooks/paystack-hook/paystack-hook.module';
import { FamilyModule } from './modules/family/family.module';
import { TransactionsModule } from './modules/transactions/transactions.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 1000,
      },
    ]),
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [AppConfigModule], // Import ConfigModule to use ConfigService
      inject: [AppConfigService], // Inject ConfigService into the factory function
      useFactory: async (configService: AppConfigService) => ({
        uri: configService.dbUri, // Use ConfigService to get MongoDB URI
      }),
    }),
    UserModule,
    AuthModule,
    PlanModule,
    PaystackHookModule,
    FamilyModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CurrentUserInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
