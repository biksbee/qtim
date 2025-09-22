import { InjectRepository } from '@nestjs/typeorm';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UsersTokensService } from '../users-tokens/users-tokens.service';
import { ParsedToken } from '../auth/auth.interface';
import { UserCreateType } from './users.type';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    private readonly configService: ConfigService,
    private readonly usersTokensService: UsersTokensService,
  ) {}

  async get(id: number): Promise<UsersEntity> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  async getByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }

  async getPassword(id: number): Promise<{ password: string }> {
    return await this.usersRepository
      .createQueryBuilder('users')
      .select('users.password', 'password')
      .where('users.id = :id', { id })
      .getRawOne();
  }

  async create(data: UserCreateType) {
    const candidate = await this.getByEmail(data.email);
    if (candidate) {
      throw new ConflictException('User with email already exists');
    }

    const instanceUserEntity = this.usersRepository.create({
      ...data,
    });

    const user = await this.usersRepository.save(instanceUserEntity);


    return this.get(user.id);
  }

  async delete(id: number): Promise<void> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersRepository.softRemove(user);
  }
}