import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersEntity } from './users.entity';
import { UsersTokensService } from '../users-tokens/users-tokens.service';

describe('UsersService', () => {
  let service: UsersService;
  let repo: jest.Mocked<Repository<UsersEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UsersEntity),
          useValue: {
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            softRemove: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {},
        },
        {
          provide: UsersTokensService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get(getRepositoryToken(UsersEntity));
  });

  it('должен вернуть пользователя по id', async () => {
    const user = { id: 1, email: 'test@example.com' } as UsersEntity;
    repo.findOneBy.mockResolvedValue(user);

    const result = await service.get(1);

    expect(result).toEqual(user);
    expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('должен бросить NotFoundException если пользователь не найден', async () => {
    repo.findOneBy.mockResolvedValue(null);

    await expect(service.get(999)).rejects.toThrow(NotFoundException);
  });

  it('должен создать пользователя если email уникален', async () => {
    const dto = { email: 'new@example.com', password: 'pass' };
    const saved = { id: 1, ...dto } as UsersEntity;

    // Первый вызов getByEmail → null (юзер не найден)
    repo.findOneBy.mockResolvedValueOnce(null);

    // Второй вызов this.get(user.id) → возвращаем сохранённого юзера
    repo.findOneBy.mockResolvedValueOnce(saved);

    repo.create.mockReturnValue(saved);
    repo.save.mockResolvedValue(saved);

    const result = await service.create(dto);

    expect(result).toEqual(saved);
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalledWith(saved);
  });

  it('должен бросить ConflictException если email занят', async () => {
    const dto = { email: 'exists@example.com', password: 'pass' };
    repo.findOneBy.mockResolvedValue({ id: 1, email: dto.email } as UsersEntity);

    await expect(service.create(dto)).rejects.toThrow(ConflictException);
  });

  it('должен удалить пользователя', async () => {
    const user = { id: 1, email: 'delete@example.com' } as UsersEntity;
    repo.findOneBy.mockResolvedValue(user);

    await service.delete(1);

    expect(repo.softRemove).toHaveBeenCalledWith(user);
  });

  it('должен бросить NotFoundException при удалении несуществующего пользователя', async () => {
    repo.findOneBy.mockResolvedValue(null);

    await expect(service.delete(999)).rejects.toThrow(NotFoundException);
  });

  it('должен вернуть пароль пользователя', async () => {
    const qb: any = {
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockResolvedValue({ password: 'hashed' }),
    };

    repo.createQueryBuilder.mockReturnValue(qb);

    const result = await service.getPassword(1);

    expect(result).toEqual({ password: 'hashed' });
    expect(qb.where).toHaveBeenCalledWith('users.id = :id', { id: 1 });
  });
});
