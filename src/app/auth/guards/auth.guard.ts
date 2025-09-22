import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as Moment from 'moment';
import { IS_SECURED_KEY } from '../../../modules/decorators/auth.is-secured.decorator';
import { InvalidOperationException } from '../../../modules/exceptions/invalid-operation.exception';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { UsersTokensService } from '../../users-tokens/users-tokens.service';
import { USERS_TOKENS_TYPES } from '../../../utils/constants';

interface FingerprintedRequest extends Request {
  fingerprint?: {
    hash: string;
    components: Record<string, any>;
    [key: string]: any;
  };
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private reflector: Reflector,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly usersTokensService: UsersTokensService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isSecured = this.reflector.getAllAndOverride(IS_SECURED_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!isSecured) return true;

    const request: Request = context
      .switchToHttp()
      .getRequest();

    const accessToken = await (async () => {
      let token = this.extractTokenFromHeader(request);
      if (!token) {
        token = this.extractTokenFromCookie(request);
      }
      const decodedToken = this.jwtService.decode(token);
      if (token) {
        if (typeof decodedToken !== 'object' || !decodedToken?.exp) {
          throw new UnauthorizedException('Invalid access token');
        }
      }
      if (!token || Moment().isAfter(Moment.unix(decodedToken.exp))) {
        const refreshToken = request.cookies['refreshToken'];
        if (!refreshToken) {
          throw new UnauthorizedException('No token found');
        }

        try {
          const fingerprint = (request as FingerprintedRequest).fingerprint.hash;
          const { accessToken, refreshToken: newRefreshToken } = await this.authService.refresh({ refreshToken }, fingerprint);
          request['tokens'] = { accessToken, newRefreshToken };
          return accessToken;
        } catch (error) {
          throw new UnauthorizedException('Invalid or expired refresh token');
        }
      }
      return token;
    })();
    await this.verifyToken(request, accessToken);
    return true;
  }

  private async verifyToken(request: Request, token: string) {
    try {
      const secret = this.configService.get<string>('JWT_TOKEN_SECRET');
      const jwtToken = await this.jwtService.verifyAsync(token, { secret });
      const user = await this.usersService.getByIdOrEmail({ id: jwtToken.id, email: jwtToken.email });
      if (!user) {
        throw new UnauthorizedException('Invalid access token');
      }
      const session = await this.usersTokensService.getByToken({
        token: request.cookies['refreshToken'],
        typeId: jwtToken.typeId,
      });
      if (!session || Moment().isSameOrAfter(session.expires_at)) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }
      request['token'] = await this.jwtService.verifyAsync(token, { secret });
    } catch (err) {
      throw new InvalidOperationException(err.message, err.code);
    }
  }

  private extractTokenFromHeader(request: Request): string | null {
    const token = request.headers['authorization'];
    if (!token || !token.startsWith('Bearer ')) {
      return null;
    }
    return token.split(' ')[1];
  }

  private extractTokenFromCookie(request: Request): string | null {
    return request.cookies?.['accessToken'];
  }
}
