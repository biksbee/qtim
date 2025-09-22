import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsNumber } from 'class-validator';
import { OneTimePasswordType } from '../../utils/constants';

export class AuthDto {
  @ApiProperty({ example: 'engineer@scaleidos.com', description: 'Email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '213546', description: 'Access code from email' })
  @IsOptional()
  @IsString()
  accessCode?: string;

  @ApiProperty({ example: 'qQ4321', description: 'Password' })
  @IsOptional()
  @IsString()
  password?: string;
}

export class RegDto {
  @ApiProperty({ example: 'engineer@scaleidos.com', description: 'Email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '213546', description: 'Access code from email' })
  @IsString()
  accessCode: string;
}

export class TypeOneTimePasswordDto {
  @ApiProperty({
    example: OneTimePasswordType.AUTH,
    description: 'Type of one-time password (authentication or registration)',
    enum: OneTimePasswordType,
  })
  type: OneTimePasswordType;
}

export class GetAccessCodeDto {
  @ApiProperty({ example: 'engineer@scaleidos.com', description: 'Email' })
  @IsEmail()
  email: string;
}

export class RefreshAuthDto {
  @ApiProperty({ description: 'Refresh token' })
  @IsString()
  refreshToken: string;
}

export class ApiLoginDto {
  @ApiProperty({ description: 'Client_id'})
  @IsString()
  client_id: string;

  @ApiProperty({ description: 'Client_secret'})
  @IsString()
  client_secret: string;
}
