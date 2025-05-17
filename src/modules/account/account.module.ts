import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { AppConfigModule } from 'src/common/config/app-config.module';

@Module({
  controllers: [AccountController],
  providers: [AccountService],
  imports: [AppConfigModule],
})
export class AccountModule {}
