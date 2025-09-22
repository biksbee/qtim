import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResponses } from './auth.responses';
import { AuthDto } from './auth.dto';
import { Request } from 'express';
import { FingerprintRequest } from './auth.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('/login')
  @ApiOperation({
    summary: 'Authenticate user',
    description: 'This endpoint allows a user to authenticate and obtain an access token. The request must include either a password or a valid one time password.',
  })
  @ApiResponse({
    status: 200,
    description: 'User data',
    type: AuthResponses,
  })
  async login(
    @Body() dto: AuthDto,
    @Req() request: FingerprintRequest,
  ): Promise<AuthResponses> {
    const fingerprint = request.fingerprint.hash;
    return this.authService.login(dto, fingerprint);
  }

  @Post('/registration')
  @ApiOperation({
    summary: 'Registration user',
    description: 'This endpoint allows registration user',
  })
  @ApiResponse({
    status: 201,
    description: 'Registered user data',
    type: AuthResponses,
  })
  registration(
    @Body() dto: AuthDto,
    @Req() request: FingerprintRequest,
  ): Promise<AuthResponses> {
    const fingerprint = request.fingerprint.hash;
    return this.authService.registration(dto, fingerprint);
  }


}