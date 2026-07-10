import { Controller, Post, Body,Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendOTPMailDto } from './dto/send-mail.dto';
import { Public } from 'src/common/decorators/public.decorator';
//import { CreateUserDto } from '../user/dto/create-user.dto';
//import { BroadcastEmailDto } from './dto/BroadCastEmailDto';
import { Role } from 'src/common/constants/enums';
import { SingleEmailDto } from './dto/single-email.dto';
import { BulkEmailDto } from './dto/bulk-email.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
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

  @Public()
  @Post('test')
  private test(@Body() sendOTPMailDto: any) {
    return this.mailService.testSendUserFamilyLink(sendOTPMailDto);
  }
// Admin Endpoints
    @Get('stats')
     @Roles(Role.Admin)
    getEmailstats(){
        return this.mailService.getEmailStats()
    }

    @Post('bulk')
     @Roles(Role.Admin)
    sendBulkEmail(@Body() bulkEmailDto: BulkEmailDto) {
        return this.mailService.sendBulkEmail(bulkEmailDto);
    }

   // @Public()
    @Post('single')
    @Roles(Role.Admin)
    sendSingleEmail(@Body() singleEmailDto: SingleEmailDto) {
        return this.mailService.sendSingleEmail(singleEmailDto);
    }
  

}
