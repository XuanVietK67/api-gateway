import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { DataLoginDto } from './dto/create-auth.dto';
import { ClientProxy } from '@nestjs/microservices';

@Controller('auths')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}
  @Post()
  create(@Body() createAuthDto: DataLoginDto) {
    return this.authClient.send({ cmd: 'auth/login' }, createAuthDto);
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
