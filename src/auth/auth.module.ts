import fs from 'fs';
import { promisify } from 'util';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ApplicationService } from '../application/application.service';
import { CookiesServices } from './cookies.service';
import { JwtAuthGuard } from './jwt.guard';
import { LoginController } from './login.controller';
import { LoginGuard } from './login.guard';
import { RefreshTokenRepository } from './refreshToken.repository';
import { TokenService } from './token.service';
import { RoleModule } from '../role/role.module';
import { JwtStrategy } from './jwt.strategy';
import { AuthStrategy } from './login.strategy';

const readFile = promisify(fs.readFile);
@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const [publicKey, privateKey] = await Promise.all([
          readFile(configService.get<string>('JWT_PUBLIC_KEY')),
          readFile(configService.get<string>('JWT_PRIVATE_KEY')),
        ]);

        return {
          privateKey,
          publicKey,
          signOptions: {
            algorithm: 'RS256',
            expiresIn: configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES_IN'),
          },
          verifyOptions: {
            algorithms: ['RS256'],
          },
        };
      },
      inject: [ConfigService],
    }),
    RoleModule,
  ],
  controllers: [LoginController],
  providers: [
    CookiesServices,
    ApplicationService,
    LoginGuard,
    JwtAuthGuard,
    RefreshTokenRepository,
    TokenService,
    JwtStrategy,
    AuthStrategy,
  ],
  exports: [JwtAuthGuard, JwtStrategy],
})
export class AuthModule {}
