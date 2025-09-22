import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ListDto } from '../../utils/dto';
import { ARTICLE_STATUS } from '../../utils/constants';

export class GetArticleDto {
  @ApiProperty({ example: 1, description: 'Collection id'})
  @Type(() => Number)
  @IsNumber()
  id: number;
}

export class FilterArticleDto {
  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  id?: number;

  @ApiPropertyOptional({ example: 'test' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'test' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({ example: ARTICLE_STATUS.PUBLISHED, enum: ARTICLE_STATUS })
  @IsEnum(ARTICLE_STATUS)
  @IsOptional()
  status?: ARTICLE_STATUS;

  @ApiPropertyOptional({ example: 'test' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ example: '2025-09-20T12:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  publishedFrom?: Date;

  @ApiPropertyOptional({ example: '2025-09-21T12:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  publishedTo?: Date;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  author?: number;
}

export class ListArticlesDto extends ListDto {
  @ApiProperty({ type: FilterArticleDto })
  @IsOptional()
  filter?: FilterArticleDto;
}

export class CreateArticleDto {
  @ApiProperty({ example: 'title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'content' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  tags?: string[];
}

export class UpdateArticleDto {
  @ApiPropertyOptional({ example: 'title' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'content' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ example: ARTICLE_STATUS.PUBLISHED, description: 'Article status', enum: ARTICLE_STATUS })
  @IsOptional()
  @IsEnum(ARTICLE_STATUS, { each: true, message: 'Status can be one of: draft, published, archived' })
  status?: ARTICLE_STATUS;
}