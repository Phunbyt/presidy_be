import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendOTPMailDto } from './dto/send-mail.dto';
import { Public } from 'src/common/decorators/public.decorator';
//import { CreateUserDto } from '../user/dto/create-user.dto';
import { BroadcastEmailDto } from './dto/BroadCastEmailDto';
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
// This endpoint was created to test the user broadcast email functionality.
  @Public()
  @Post('broadcast')
  broadcastEmail(@Body() broadcastDto: BroadcastEmailDto){
     return this.mailService.sendBroadcastEmail(
       broadcastDto.userIds, 
       broadcastDto.message,
       broadcastDto.sendToAll
     )
  }
  

}
