import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ParsedToken } from '../auth/auth.interface';
import {
  CreateArticleType,
  ListArticlesType,
  UpdateArticleType,
} from './articles.type';
import { ArticlesEntity } from './articles.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindManyOptions,
  FindOptionsWhere,
  ILike, LessThanOrEqual, MoreThanOrEqual,
  Raw,
  Repository,
} from 'typeorm';
import { UsersService } from '../users/users.service';
import { ARTICLE_STATUS } from '../../utils/constants';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ArticlesService {
  private readonly LIST_CACHE_KEY = 'articles:list';

  constructor(
    @InjectRepository(ArticlesEntity)
    private articlesRepository: Repository<ArticlesEntity>,
    private readonly usersService: UsersService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {}

  async get(id: number): Promise<ArticlesEntity> {
    return await this.articlesRepository.findOneBy({ id });
  }

  async list(data: ListArticlesType): Promise<any> {
    const cached = await this.cacheManager.get(this.LIST_CACHE_KEY)
    if (cached) {
      return cached;
    }

    const {
      pagination = { page: 1, limit: 10 },
      order = { field: 'id', by: 'ASC' },
      filter = {},
    } = data;

    const params: FindManyOptions = {
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
      order: {
        [order.field]: order.by,
      },
    };

    const whereOptions: FindOptionsWhere<ArticlesEntity> = {};

    const {
      publishedFrom = null,
      publishedTo = null,
      author = null,
      ...filterValue
    } = filter;

    if (publishedFrom || publishedTo) {
      if (publishedTo && publishedFrom) {
        whereOptions.publishedAt = Between(publishedFrom, publishedTo);
      } else if (publishedTo) {
        whereOptions.publishedAt = MoreThanOrEqual(publishedTo);
      } else if (publishedFrom) {
        whereOptions.publishedAt = LessThanOrEqual(publishedFrom)
      }
    }

    if (author) {
      whereOptions.author = { id: author };
      params.relations = ['author'];
    }

    for (const [key, value] of Object.entries(filterValue)) {
      if (Array.isArray(value)) {
        whereOptions[key] = Raw((alias) => `${alias} SIMILAR TO :${key}`, {
          tags: `%(${filter[key].join('|')})%`,
        });
      } else if (typeof value === 'string') {
        if (key === 'status') {
          whereOptions[key] = value as ARTICLE_STATUS;
          continue;
        }
        whereOptions[key] = ILike(`%${value}%`);
      } else whereOptions[key] = value;
    }

    params.where = whereOptions;
    const [articles, count] = await this.articlesRepository.findAndCount(params);

    await this.cacheManager.set(this.LIST_CACHE_KEY, { articles, total: count }, this.configService.get<number>('REDIS_TTL'));

    return {
      articles,
      total: count,
    };
  }

  async create(data: CreateArticleType, token: ParsedToken): Promise<ArticlesEntity> {
    const user = await this.usersService.get(token.id);

    const articleInstance = this.articlesRepository.create({
      ...data,
      author: user,
    });
    const article = await this.articlesRepository.save(articleInstance);
    await this.cacheManager.del(this.LIST_CACHE_KEY);
    return article;
  }

  async update(id: number, data: UpdateArticleType, token: ParsedToken): Promise<ArticlesEntity> {
    const article = await this.articlesRepository.findOneBy({
      id,
      author: { id: token.id },
    });

    if (!article) {
      throw new NotFoundException();
    }

    Object.assign(article, data);
    await this.articlesRepository.save(article);
    await this.cacheManager.del(this.LIST_CACHE_KEY);
    return await this.get(article.id);
  }

  async delete(id: number, token: ParsedToken): Promise<void> {
    const article = await this.articlesRepository.findOneBy({
      id,
      author: { id: token.id },
    });

    if (!article) {
      throw new NotFoundException();
    }
    await this.articlesRepository.softRemove(article);
    await this.cacheManager.del(this.LIST_CACHE_KEY);
  }
}