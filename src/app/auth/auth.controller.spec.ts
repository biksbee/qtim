import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthDto } from './auth.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockResolvedValue({ accessToken: 'token', refreshToken: 'refresh' }),
            registration: jest.fn().mockResolvedValue({ accessToken: 'token', refreshToken: 'refresh' }),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should call service.login on POST /login', async () => {
    const dto: AuthDto = { email: 'test@test.com', password: '123' };
    const req: any = { fingerprint: { hash: 'fp' } };

    const result = await controller.login(dto, req);

    expect(service.login).toHaveBeenCalledWith(dto, 'fp');
    expect(result).toEqual({ accessToken: 'token', refreshToken: 'refresh' });
  });

  it('should call service.registration on POST /registration', async () => {
    const dto: AuthDto = { email: 'test@test.com', password: '123' };
    const req: any = { fingerprint: { hash: 'fp' } };

    const result = await controller.registration(dto, req);

    expect(service.registration).toHaveBeenCalledWith(dto, 'fp');
    expect(result).toEqual({ accessToken: 'token', refreshToken: 'refresh' });
  });
});
