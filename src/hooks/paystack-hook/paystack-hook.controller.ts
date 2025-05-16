import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PaystackHookService } from './paystack-hook.service';
import { CreatePaystackHookDto } from './dto/create-paystack-hook.dto';
import { UpdatePaystackHookDto } from './dto/update-paystack-hook.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Public()
@Controller('paystack')
export class PaystackHookController {
  constructor(private readonly paystackHookService: PaystackHookService) {}

  @Post('hook')
  create(@Body() createPaystackHookDto: any) {
    return this.paystackHookService.create(createPaystackHookDto);
  }
}
