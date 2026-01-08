import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Inject,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Public } from 'src/common/decorators/canActive';
import {
  forgotPasswordDto,
  resetPassword,
  verifyTokenDto,
} from 'src/modules/auth/dto/create-auth.dto';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { UsersService } from 'src/modules/users/users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userClient.send('users_register', createUserDto);
  }

  @Public()
  @Post('forgotPassword')
  forgotPassword(@Body() dataForgotPassword: forgotPasswordDto) {
    return this.userClient.send('forgot_password', dataForgotPassword);
  }

  @Public()
  @Post('verifyToken')
  async verify(@Body() data: verifyTokenDto) {
    try {
      const result = await lastValueFrom(
        this.userClient.send('verify_token', data),
      );
      return result
    } catch (error) {
      if (error.code == 400) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException('nooooooo')
    }
  }

  @Public()
  @Post('resetPassword')
  async resetPassword(@Body() data: resetPassword) {
    try {
      const result = await lastValueFrom(
        this.userClient.send('reset_password', data),
      );
      return result
    } catch (error) {
      if (error.code == 400) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException('nooooooo')
    }
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
