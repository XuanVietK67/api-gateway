import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Inject,
  BadGatewayException,
  InternalServerErrorException,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LocalAuthGuard } from 'src/modules/auth/guard/local-auth.guard';
import { JwtAuthGuard } from 'src/modules/auth/guard/jwt-auth.guard';
import { Public } from 'src/common/decorators/canActive';
import { AuthService } from 'src/modules/auth/auth.service';
import {
  DataChangePassword,
  DataLoginDto,
} from 'src/modules/auth/dto/create-auth.dto';

@Controller('auths')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Post()
  async create(@Body() createAuthDto: DataLoginDto) {
    try {
      return this.authClient.send('auth_login', createAuthDto);
    } catch (error) {
      if (error.code == 400) {
        throw new BadGatewayException(error.message);
      }
    }
    throw new InternalServerErrorException();
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    try {
      return this.authClient.send('auth_login', req.user);
    } catch (error) {
      if (error.code == 400) {
        throw new BadRequestException(error.message);
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('changePassword')
  changPassword(
    @Request() req,
    @Body() dataChangePassword: DataChangePassword,
  ) {
    const payload = {
      user: req.user,
      data: dataChangePassword,
    };
    try {
      return this.authClient.send('change_password', payload);
    } catch (error) {
      if (error.code == 400) {
        throw new BadRequestException(error.message);
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
