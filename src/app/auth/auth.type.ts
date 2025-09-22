import { USERS_TOKENS_TYPES } from '../../utils/constants';

export type AuthType = {
  email: string;
  password: string;
}

export type GenerateAuthResponseType = Partial<AuthType> & {
  id: number;
  type?: USERS_TOKENS_TYPES;
}

export type GenerateTokenPayloadType = {
  id: number;
  email: string;
  typeId: USERS_TOKENS_TYPES
}

export type RefreshAuthType = {
  refreshToken: string;
}