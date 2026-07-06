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
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  getUser(@Param('id') id:string){
    return this.userService.getUser(id)
  }

  @Get('stats')
  getStats(){
    return this.userService.getUserStats()
  }  
    @Get()
    getUsers(@Query() filterUserDto:FilterUserDto ){
        return this.userService.getUsers(filterUserDto)
    }  
}
