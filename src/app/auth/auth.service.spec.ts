import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UsersTokensService } from '../users-tokens/users-tokens.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let usersTokensService: jest.Mocked<UsersTokensService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: { getByEmail: jest.fn(), getPassword: jest.fn(), create: jest.fn(), get: jest.fn() } },
        { provide: UsersTokensService, useValue: { create: jest.fn(), delete: jest.fn(), getByToken: jest.fn(), deleteSame: jest.fn(), getType: jest.fn() } },
        { provide: JwtService, useValue: { sign: jest.fn().mockReturnValue('jwt_token'), verify: jest.fn() } },
        { provide: ConfigService, useValue: { get: jest.fn().mockReturnValue('secret') } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    usersTokensService = module.get(UsersTokensService);
  });

  it('должен быть определён', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('должен выбросить NotFoundException если пользователь не найден', async () => {
      usersService.getByEmail.mockResolvedValue(null);

      await expect(service.login({ email: 'test@test.com', password: '123' }, 'fingerprint'))
        .rejects.toThrow(NotFoundException);
    });

    it('должен выбросить BadRequestException если пароль неверный', async () => {
      usersService.getByEmail.mockResolvedValue({ id: 1, email: 'test@test.com' } as any);
      usersService.getPassword.mockResolvedValue({ password: 'hashed' });
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(service.login({ email: 'test@test.com', password: 'wrong' }, 'fp'))
        .rejects.toThrow(BadRequestException);
    });

    it('должен вернуть accessToken и refreshToken при успешном логине', async () => {usersService.getByEmail.mockResolvedValue({ id: 1, email: 'test@test.com' } as any);
      usersService.getPassword.mockResolvedValue({ password: 'hashed' });
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      usersTokensService.getType.mockResolvedValue({
        id: 1,
        name: 'REFRESH',
        lifetime: '1h',
        need_encryption: false,
        tokens: [],
      } as any);

      usersTokensService.deleteSame.mockResolvedValue(undefined);
      usersTokensService.create.mockResolvedValue(undefined);

      const result = await service.login({ email: 'test@test.com', password: '123' }, 'fp');

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });
});
