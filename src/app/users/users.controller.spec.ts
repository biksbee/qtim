import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            get: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get(UsersService);
  });

  it('должен вернуть пользователя', async () => {
    const user = { id: 1, email: 'test@example.com' };
    service.get.mockResolvedValue(user as any);

    const result = await controller.get({ token: { id: 1 } } as any);

    expect(result).toEqual(user);
    expect(service.get).toHaveBeenCalledWith(1);
  });

  it('должен пробрасывать ошибку если пользователь не найден', async () => {
    service.get.mockRejectedValue(new NotFoundException());

    await expect(controller.get({ token: { id: 99 } } as any)).rejects.toThrow(NotFoundException);
  });

  it('должен удалить пользователя', async () => {
    service.delete.mockResolvedValue(undefined);

    await controller.delete({ token: { id: 1 } } as any);

    expect(service.delete).toHaveBeenCalledWith(1);
  });
});
