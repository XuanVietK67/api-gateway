import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
      ClientsModule.registerAsync([
        {
          name: 'AUTH_SERVICE',
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            transport: Transport.TCP,
            options: {
              host: config.get('AUTH_SERVICE_HOST', '127.0.0.1'),
              port: config.get<number>('AUTH_SERVICE_PORT', 8080),
            },
          }),
        },
      ]),
    ],
})
export class AuthModule {}
