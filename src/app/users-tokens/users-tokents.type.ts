import { GenerateAuthResponseType } from '../auth/auth.type';

export type UsersTokensCreateType = {
  token: string;
  type_id: number;
  fingerprint: string;
  user: GenerateAuthResponseType;
}

export type UsersTokensDeleteSameType = {
  userId: number;
  fingerprint: string;
  typeId: number;
}

export type UsersTokensDeleteByTokenType = {
  userId: number;
  refreshToken: string;
  typeId: number;
}

export type UsersTokensGetByTokenType = {
  token: string;
  typeId: number;
}