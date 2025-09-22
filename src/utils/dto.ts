import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ example: 1, description: 'Page number', default: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiProperty({ example: 5, description: 'Count items', default: 10 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  limit?: number;
}

export class OrderDto {
  @ApiProperty({ example: 'id', description: 'Sorted field', default: 'id' })
  @IsOptional()
  @IsString()
  field?: string;

  @ApiProperty({ example: 'ASC', description: 'Sort direction (ASC or DESC)', default: 'ASC' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'], { message: 'sortOrder must be either ASC or DESC' })
  by?: 'ASC' | 'DESC';
}

export class ListDto {
  @ApiProperty({ type: PaginationDto })
  pagination: PaginationDto;

  @ApiProperty({ type: OrderDto })
  order: OrderDto;
}