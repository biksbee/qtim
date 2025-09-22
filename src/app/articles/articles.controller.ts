import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { IsSecured } from '../../modules/decorators/auth.is-secured.decorator';
import { AuthRequest } from '../auth/auth.interface';
import { CreateArticleDto, GetArticleDto, ListArticlesDto, UpdateArticleDto } from './articles.dto';

@ApiTags('Article')
@Controller('article')
export class ArticlesController {
  constructor(
    private readonly articleService: ArticlesService,
  ) {}

  @Post('/list')
  @ApiOperation({
    summary: 'List articles',
    description: 'This endpoint allows get list articles',
  })
  @ApiResponse({
    status: 200,
    description: 'List articles',
    // type: ,
  })
  async list(
    @Body() dto: ListArticlesDto,
  ) {
    return await this.articleService.list(dto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get article',
    description: 'This endpoint allows get article',
  })
  @ApiResponse({
    status: 200,
    description: 'Article data',
    // type: ,
  })
  async get(
    @Param() { id }: GetArticleDto,
  ) {
    return await this.articleService.get(id);
  }

  @Post('')
  @IsSecured()
  @ApiOperation({
    summary: 'Create article',
    description: 'This endpoint allows create article',
  })
  @ApiResponse({
    status: 201,
    description: 'Article data',
    // type: ,
  })
  async create(
    @Body() dto: CreateArticleDto,
    @Req() request: AuthRequest,
  ) {
    return await this.articleService.create(dto, request.token);
  }

  @Patch(':id')
  @IsSecured()
  @ApiOperation({
    summary: 'Update article',
    description: 'This endpoint allows update article',
  })
  @ApiResponse({
    status: 201,
    description: 'Updated article data',
    // type: ,
  })
  async update(
    @Param() { id }: GetArticleDto,
    @Body() dto: UpdateArticleDto,
    @Req() request: AuthRequest,
  ) {
    return await this.articleService.update(id, dto, request.token);
  }

  @Delete(':id')
  @IsSecured()
  @ApiOperation({
    summary: 'Delete article by id',
    description: 'This endpoint allows to delete article',
  })
  @ApiResponse({
    status: 200,
  })
  async delete(
    @Param() { id }: GetArticleDto,
    @Req() request: AuthRequest,
  ) {
    return await this.articleService.delete(id, request.token);
  }
}