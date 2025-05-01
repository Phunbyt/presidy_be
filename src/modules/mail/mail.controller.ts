import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendOTPMailDto } from './dto/send-mail.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {
    this.mailService = mailService;
  }

  @Public()
  @Post()
  private create(@Body() sendOTPMailDto: any) {
    return this.mailService.sendSupportDisputeMessage(sendOTPMailDto);
  }
}
