import { Inject, Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AppConfigService } from 'src/common/config/app-config.service';
import axios from 'axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AccountService {
  paystackBankBaseURL: string;
  constructor(
    private appConfigService: AppConfigService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {
    this.paystackBankBaseURL = 'https://api.paystack.co/bank';
  }
  async findAllBanks() {
    const cachedBanks = await this.cacheService.get('banks');

    if (!cachedBanks) {
      const { data } = await axios.get(
        `${this.paystackBankBaseURL}?currency=NGN&enabled_for_verification=true`,
        {
          headers: {
            Authorization: `Bearer ${this.appConfigService.paystackSK}`,
          },
        },
      );

      // // console.log(data.data);
      // return data;

      const structuredBanks = data.data.map((banks) => ({
        id: banks.id,
        name: banks.name,
        slug: banks.slug,
        code: banks.code,
      }));

      await this.cacheService.set('banks', structuredBanks);

      return structuredBanks;
    }

    return cachedBanks;
  }

  async validateAccount(bankCode, accountNumber) {
    const { data } = await axios.get(
      `${this.paystackBankBaseURL}/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
      {
        headers: {
          Authorization: `Bearer ${this.appConfigService.paystackSK}`,
        },
      },
    );

    return data;
  }
}
