import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'src/modules/auth/strategy/local.strategy';
import { JwtStrategy } from 'src/modules/auth/strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { StringValue } from 'ms';


@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get('AUTH_SERVICE_HOST', '127.0.0.1'),
            port: config.get<number>('AUTH_SERVICE_PORT', 8081),
          },
        }),
      },
    ]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const expiresIn = config.get<string>('JWT_EXPIRES_IN');

        return {
          secret: config.get<string>('JWT_SECRET')!,
          signOptions: {
            expiresIn: expiresIn?.match(/^\d+$/)
              ? Number(expiresIn)
              : (expiresIn as StringValue),
          },
        };
      },
    }),
    PassportModule,
  ],
})
export class AuthModule {}
