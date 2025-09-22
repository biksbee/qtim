import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from './articles.service';
import { UsersService } from '../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ArticlesEntity } from './articles.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';

describe('ArticlesService', () => {
  let service: ArticlesService;
  let articlesRepository: any;
  let usersService: any;
  let cacheManager: any;

  beforeEach(async () => {
    // Моки зависимостей
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        { provide: UsersService, useValue: { get: jest.fn() } },
        { provide: CACHE_MANAGER, useValue: { get: jest.fn(), set: jest.fn(), del: jest.fn() } },
        { provide: ConfigService, useValue: { get: jest.fn().mockReturnValue(60) } },
        {
          provide: getRepositoryToken(ArticlesEntity),
          useValue: {
            findOneBy: jest.fn(),
            findAndCount: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            softRemove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
    articlesRepository = module.get(getRepositoryToken(ArticlesEntity));
    usersService = module.get(UsersService);
    cacheManager = module.get(CACHE_MANAGER);
  });

  it('должен быть определён', () => {
    expect(service).toBeDefined();
  });

  describe('get', () => {
    it('должен вернуть статью по id', async () => {
      const article = { id: 1, title: 'Test' };
      articlesRepository.findOneBy.mockResolvedValue(article);

      const result = await service.get(1);
      expect(result).toEqual(article);
      expect(articlesRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('list', () => {
    it('должен вернуть список статей из репозитория', async () => {
      const articles = [{ id: 1, title: 'Test' }];
      articlesRepository.findAndCount.mockResolvedValue([articles, 1]);
      cacheManager.get.mockResolvedValue(null);
      cacheManager.set.mockResolvedValue(undefined);

      const result = await service.list({});
      expect(result).toEqual({ articles, total: 1 });
      expect(articlesRepository.findAndCount).toHaveBeenCalled();
    });

    it('должен вернуть список статей из кеша', async () => {
      const cached = { articles: [{ id: 1 }], total: 1 };
      cacheManager.get.mockResolvedValue(cached);

      const result = await service.list({});
      expect(result).toEqual(cached);
      expect(articlesRepository.findAndCount).not.toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('должен создать статью и удалить кеш', async () => {
      const token = { id: 1 };
      const dto = { title: 'New', content: 'Content' };
      const user = { id: 1 };
      usersService.get.mockResolvedValue(user);
      articlesRepository.create.mockReturnValue(dto);
      articlesRepository.save.mockResolvedValue({ id: 1, ...dto });

      const result = await service.create(dto, token);
      expect(result).toEqual({ id: 1, ...dto });
      expect(cacheManager.del).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('должен обновить статью', async () => {
      const token = { id: 1 };
      const dto = { title: 'Updated' };
      const article = { id: 1, author: { id: 1 }, title: 'Old' };
      articlesRepository.findOneBy.mockResolvedValue(article);
      articlesRepository.save.mockResolvedValue({ ...article, ...dto });
      service.get = jest.fn().mockResolvedValue({ ...article, ...dto });

      const result = await service.update(1, dto, token);
      expect(result).toEqual({ ...article, ...dto });
      expect(cacheManager.del).toHaveBeenCalled();
    });

    it('должен выбросить NotFoundException если статья не найдена', async () => {
      articlesRepository.findOneBy.mockResolvedValue(null);
      await expect(service.update(1, {}, { id: 1 })).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('должен удалить статью', async () => {
      const token = { id: 1 };
      const article = { id: 1, author: { id: 1 } };
      articlesRepository.findOneBy.mockResolvedValue(article);
      articlesRepository.softRemove.mockResolvedValue(undefined);

      await service.delete(1, token);
      expect(articlesRepository.softRemove).toHaveBeenCalledWith(article);
      expect(cacheManager.del).toHaveBeenCalled();
    });

    it('должен выбросить NotFoundException если статья не найдена', async () => {
      articlesRepository.findOneBy.mockResolvedValue(null);
      await expect(service.delete(1, { id: 1 })).rejects.toThrow(NotFoundException);
    });
  });
});
