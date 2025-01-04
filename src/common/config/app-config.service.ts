import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {
    this.configService = configService;
  }

  public get env(): string {
    return this.configService.get<string>('app.env');
  }

  public get name(): string {
    return this.configService.get<string>('app.name');
  }

  public get port(): number {
    return this.configService.get<number>('app.port');
  }

  public get dbUri(): string {
    return this.configService.get<string>('app.dbUri');
  }

  public get jwtAccessSecret(): string {
    return this.configService.get<string>('app.jwtAccessSecret');
  }

  public get jwtRefreshSecret(): string {
    return this.configService.get<string>('app.jwtRefreshSecret');
  }

  public get emailPort(): string {
    return this.configService.get<string>('app.emailPort');
  }

  public get emailUsername(): string {
    return this.configService.get<string>('app.emailUsername');
  }

  public get emailPassword(): string {
    return this.configService.get<string>('app.emailPassword');
  }

  public get emailHost(): string {
    return this.configService.get<string>('app.emailHost');
  }

  public get appBaseUrl(): string {
    return this.configService.get<string>('app.appBaseUrl');
  }

  public get redisHost(): string {
    return this.configService.get<string>('app.redisHost');
  }

  public get redisPort(): string {
    return this.configService.get<string>('app.redisPort');
  }

  public get paystackUrl(): string {
    return this.configService.get<string>('app.paystackUrl');
  }

  public get paystackSK(): string {
    return this.configService.get<string>('app.paystackSK');
  }

  public get paystackPK(): string {
    return this.configService.get<string>('app.paystackPK');
  }
}
