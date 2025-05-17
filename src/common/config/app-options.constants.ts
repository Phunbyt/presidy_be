import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { AppConfigModule } from './app-config.module';
import { AppConfigService } from './app-config.service';

export const RedisOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [AppConfigModule],
  useFactory: async (configService: AppConfigService) => {
    const store = await redisStore({
      socket: {
        host: configService.redisHost,
        port: parseInt(configService.redisPort),
      },
    });

    return {
      store: () => store,
    };
  },
  inject: [AppConfigService],
};
