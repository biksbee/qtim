import { UsersTokensEntity } from './entities/users-tokens.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersTokensTypesEntity } from './entities/users-tokens-types.entity';
import { ConfigService } from '@nestjs/config';
import { UsersTokensCreateType, UsersTokensDeleteSameType, UsersTokensGetByTokenType } from './users-tokents.type';
import * as CryptoJS from 'crypto-js';
import * as Moment from 'moment';
import ms = require('ms');

@Injectable()
export class UsersTokensService {
  constructor(
    @InjectRepository(UsersTokensEntity)
    private readonly usersTokensRepository: Repository<UsersTokensEntity>,
    @InjectRepository(UsersTokensTypesEntity)
    private readonly usersTokensTypesEntityRepository: Repository<UsersTokensTypesEntity>,
    private readonly configService: ConfigService,
  ) {}

  async create(data: UsersTokensCreateType) {
    const secret = this.configService.get<string>('TOKEN_SECRET');
    const type = await this.usersTokensTypesEntityRepository.findOneBy({ id: data.type_id });
    if (type.need_encryption) {
      data.token = CryptoJS
        .HmacSHA512(data.token, secret)
        .toString()
    }
    const lifetime = type.lifetime ? ms(type.lifetime) : null;
    const expires_at = type.lifetime ? Moment().add(lifetime, 'ms') : null;
    const fingerprint = data.fingerprint
      ? CryptoJS
        .SHA512(data.fingerprint)
        .toString(CryptoJS.enc.Base64)
      : null;
    return this.usersTokensRepository.save({
      token: data.token,
      expires_at,
      fingerprint,
      type: type,
      user: data.user,
    })
  }

  async delete(id: number) {
    return await this.usersTokensRepository.delete({ id });
  }

  async getByToken(data: UsersTokensGetByTokenType) {
    const secret = this.configService.get<string>('TOKEN_SECRET');
    const type = await this.usersTokensTypesEntityRepository.findOneBy({ id: data.typeId });
    if (type.need_encryption) {
      data.token = CryptoJS
        .HmacSHA512(data.token, secret)
        .toString()
    }
    return await this.usersTokensRepository.findOneBy({
      token: data.token,
      type: { id: data.typeId }
    })
  }

  async deleteSame(data: UsersTokensDeleteSameType) {
    const fingerprint = data.fingerprint
      ? CryptoJS
        .SHA512(data.fingerprint)
        .toString(CryptoJS.enc.Base64)
      : null;
    return await this.usersTokensRepository.delete({
      user: { id: data.userId },
      type: { id: data.typeId },
      fingerprint
    })
  }

  async getType(id: number) {
    return this.usersTokensTypesEntityRepository.findOneBy({ id });
  }
}