import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Delete, Get, Param, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { IsSecured } from '../../modules/decorators/auth.is-secured.decorator';
import { UserResponse } from './users.responses';
import { AuthRequest } from '../auth/auth.interface';
import { GetUsersDto } from './users.dto';

@ApiTags('User')
@Controller('user')
export class UsersController {
  constructor(
    private usersService: UsersService,
  ) {}

  @Get('')
  @IsSecured()
  @ApiOperation({
    summary: 'Get user',
    description: 'This endpoint allows get user by access token',
  })
  @ApiResponse({
    status: 200,
    description: 'User information',
    type: UserResponse,
  })
  async get(@Req() request: AuthRequest): Promise<UserResponse> {
    return await this.usersService.get(request.token.id);
  }

  @Delete('')
  @IsSecured()
  @ApiOperation({
    summary: 'Delete user',
    description: 'This endpoint allows delete user',
  })
  @ApiResponse({
    status: 200,
  })
  async delete(
    @Req() request: AuthRequest,
  ): Promise<void> {
    return await this.usersService.delete(request.token.id);
  }
}