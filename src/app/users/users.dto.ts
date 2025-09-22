import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ChooseFileDto } from '../../modules/file-storage/file-storage.dto';
import { Type } from 'class-transformer';

export class GetUsersDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  id: number;
}

export class UpdateUsersDto {
  @ApiProperty({ example: 'Kate', description: 'New name for user' })
  @IsOptional()
  @IsString()
  first_name?: string;

  @ApiProperty({ example: 'Anderson', description: 'New lastname for user' })
  @IsOptional()
  @IsString()
  last_name?: string;

  @ApiProperty({ type: ChooseFileDto })
  file: ChooseFileDto
}