import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetUsersDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  id: number;
}