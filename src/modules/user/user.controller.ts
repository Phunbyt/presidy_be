import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/constants/enums';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
 @Get('stats')
  @Roles(Role.Admin)
  getStats(){
    return this.userService.getUserStats()
  }  
  @Get(':id')
  @Roles(Role.Admin)
  getUser(@Param('id') id:string){
    return this.userService.getUser(id)
  }
    @Get()
    @Roles(Role.Admin)
    getUsers(@Query() filterUserDto:FilterUserDto ){
        return this.userService.getUsers(filterUserDto)
    }  
}
