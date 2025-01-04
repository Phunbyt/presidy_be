import { PartialType } from '@nestjs/mapped-types';
import { CreatePaystackHookDto } from './create-paystack-hook.dto';

export class UpdatePaystackHookDto extends PartialType(CreatePaystackHookDto) {}
