import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsNumber } from 'class-validator';

export class AuthDto {
  @ApiProperty({ example: 'engineer@scaleidos.com', description: 'Email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'qQ4321', description: 'Password' })
  @IsString()
  password: string;
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
