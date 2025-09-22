import {
  BadRequestException,
  ConflictException,
  Injectable, InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthType, GenerateAuthResponseType, GenerateTokenPayloadType, RefreshAuthType } from './auth.type';
import { USERS_TOKENS_TYPES } from '../../utils/constants';
import * as Moment from 'moment';
import * as bcrypt from 'bcrypt';
import { AuthResponses } from './auth.responses';
import { UsersTokensService } from '../users-tokens/users-tokens.service';
import { UsersService } from '../users/users.service';


@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly usersTokensService: UsersTokensService,
  ) {}

  async login(data: AuthType, fingerprint: string): Promise<AuthResponses> {
    const user = await this.usersService.getByEmail(data.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password } = await this.usersService.getPassword(user.id);

    const match = await bcrypt.compare(data.password, password);

    if (!match) {
      throw new BadRequestException('Incorrect login data');
    }

    return this.generateAuthResponse(user, fingerprint);
  }

  async registration(data: AuthType, fingerprint: string): Promise<AuthResponses> {
    const user = await this.usersService.create(data);

    return this.generateAuthResponse(user, fingerprint);
  }

  async refresh(data: RefreshAuthType, fingerprint: string): Promise<AuthResponses> {
    const secret = this.configService.get<string>('JWT_TOKEN_SECRET');
    const jwtData = this.jwtService.verify(data.refreshToken, { secret });
    const user = await this.usersService.get(jwtData.id);
    const token = await this.usersTokensService.getByToken({
      token: data.refreshToken,
      typeId: USERS_TOKENS_TYPES.REFRESH,
    });
    if (!token || Moment().isSameOrAfter(token.expires_at)) {
      throw new UnauthorizedException('Refresh token was expired');
    }
    await this.usersTokensService.delete(token.id);
    return this.generateAuthResponse(user, fingerprint);
  }

  async generateToken(payload: GenerateTokenPayloadType, expiresIn: string): Promise<string> {
    try {
      const secret = this.configService.get('JWT_TOKEN_SECRET');
      return this.jwtService.sign(payload, {
        secret,
        expiresIn,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to generate token',
        { cause: error }
      );
    }
  }

  async generateAuthResponse(
    data: GenerateAuthResponseType,
    fingerprint: string,
  ): Promise<AuthResponses> {
    const typeId = data.type ? data.type : USERS_TOKENS_TYPES.REFRESH;
    await this.usersTokensService.deleteSame({
      typeId,
      fingerprint,
      userId: data.id,
    });
    const accessTokenLifeTime = this.configService.get<string>(
      'JWT_TOKEN_LIFE_TIME',
    );
    const { lifetime: refreshTokenLifeTime } =
      await this.usersTokensService.getType(typeId);
    if (!refreshTokenLifeTime) {
      throw new UnauthorizedException('Invalid refresh token life time');
    }
    const refreshToken = await this.generateToken(
      {
        id: data.id,
        email: data.email,
        typeId,
      },
      refreshTokenLifeTime,
    );
    await this.usersTokensService.create({
      token: refreshToken,
      type_id: typeId,
      fingerprint,
      user: data,
    });

    return {
      accessToken: await this.generateToken(
        { id: data.id, email: data.email, typeId, },
        accessTokenLifeTime,
      ),
      refreshToken,
    };
  }

}