import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { LoginGuard } from './login.guard';
import { Request, Response } from 'express';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TokenService } from './token.service';
import { CookiesServices } from './cookies.service';
import { ConfigService } from '@nestjs/config';
import { RoleService } from '../role/role.service';

@ApiTags('Auth')
@Controller()
export class LoginController {
  constructor(
    private tokenService: TokenService,
    private cookiesServices: CookiesServices,
    private configService: ConfigService,
    private roleService: RoleService,
  ) {}

  @UseGuards(LoginGuard)
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        identityToken: {
          type: 'string',
        },
      },
    },
  })
  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    const { did, verifiedRoles } =
      (req.user as {
        did: string;
        verifiedRoles: { name: string; namespace: string }[];
      }) || {};

    if (!did) {
      throw new UnauthorizedException();
    }

    const cookiesOptions = this.cookiesServices.getCookiesOptionBasedOnUserAgent(
      req.headers['user-agent'],
    );

    const [token, refreshToken] = await Promise.all([
      this.tokenService.generateAccessToken({ did, verifiedRoles }),
      this.tokenService.generateRefreshToken({
        userDid: did,
      }),
    ]);

    res.cookie(
      this.configService.get<string>('JWT_ACCESS_TOKEN_NAME'),
      token,
      cookiesOptions,
    );

    res.cookie(
      this.configService.get<string>('JWT_REFRESH_TOKEN_NAME'),
      refreshToken,
      cookiesOptions,
    );

    return res.send({ token, refreshToken });
  }

  @ApiQuery({ name: 'refresh_token', required: false })
  @Get('refresh_token')
  async refreshToken(
    @Req() req: Request,
    @Res() res: Response,
    @Query('refresh_token') refresh_token?: string,
  ) {
    const refreshTokenString =
      req.cookies[this.configService.get<string>('JWT_REFRESH_TOKEN_NAME')] ||
      refresh_token;

    if (!refreshTokenString) {
      throw new UnauthorizedException();
    }

    const { userDid, tokenId } =
      (await this.tokenService.verifyRefreshToken(refreshTokenString)) || {};

    const verifiedRoles = await this.roleService.verifyUserRoles(userDid);

    if (!tokenId || !userDid) {
      throw new UnauthorizedException();
    }

    const cookiesOptions = this.cookiesServices.getCookiesOptionBasedOnUserAgent(
      req.headers['user-agent'],
    );

    const [token, refreshToken] = await Promise.all([
      this.tokenService.generateAccessToken({ did: userDid, verifiedRoles }),
      this.tokenService.generateRefreshToken({
        userDid,
      }),
      this.tokenService.invalidateRefreshToken(tokenId),
    ]);

    res.cookie(
      this.configService.get<string>('JWT_ACCESS_TOKEN_NAME'),
      token,
      cookiesOptions,
    );

    res.cookie(
      this.configService.get<string>('JWT_REFRESH_TOKEN_NAME'),
      refreshToken,
      cookiesOptions,
    );

    return res.send({ token, refreshToken });
  }
}
