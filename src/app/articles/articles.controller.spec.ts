import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';

describe('ArticlesController', () => {
  let controller: ArticlesController;
  let service: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [
        {
          provide: ArticlesService,
          useValue: {
            list: jest.fn(),
            get: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ArticlesController>(ArticlesController);
    service = module.get(ArticlesService);
  });

  it('должен быть определён', () => {
    expect(controller).toBeDefined();
  });

  describe('list', () => {
    it('должен вернуть список статей', async () => {
      const data = { articles: [{ id: 1 }], total: 1 };
      service.list.mockResolvedValue(data);
      const result = await controller.list({} as any);
      expect(result).toEqual(data);
    });
  });

  describe('get', () => {
    it('должен вернуть статью по id', async () => {
      const article = { id: 1 };
      service.get.mockResolvedValue(article);
      const result = await controller.get({ id: 1 });
      expect(result).toEqual(article);
    });
  });

  describe('create', () => {
    it('должен вызвать сервис для создания статьи', async () => {
      const article = { id: 1, title: 'Test' };
      service.create.mockResolvedValue(article);
      const result = await controller.create({ title: 'Test', content: 'Content' }, { token: { id: 1 } } as any);
      expect(result).toEqual(article);
    });
  });

  describe('update', () => {
    it('должен вызвать сервис для обновления статьи', async () => {
      const article = { id: 1, title: 'Updated' };
      service.update.mockResolvedValue(article);
      const result = await controller.update({ id: 1 }, { title: 'Updated' }, { token: { id: 1 } } as any);
      expect(result).toEqual(article);
    });
  });

  describe('delete', () => {
    it('должен вызвать сервис для удаления статьи', async () => {
      service.delete.mockResolvedValue(undefined);
      const result = await controller.delete({ id: 1 }, { token: { id: 1 } } as any);
      expect(result).toBeUndefined();
    });
  });
});
