import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendOTPMailDto } from './dto/send-mail.dto';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {
    this.mailService = mailService;
  }

  @Post()
  private create(@Body() sendOTPMailDto: SendOTPMailDto) {
    return this.mailService.sendOTPMail(sendOTPMailDto);
  }
}
