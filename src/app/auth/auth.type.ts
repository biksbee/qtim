import { OneTimePasswordType, USERS_TOKENS_TYPES } from '../../utils/constants';

export type UserAuthType = {
  email: string;
  accessCode?: string;
  password?: string;
}

export type UserRegType = {
  email: string;
  accessCode: string;
}

export type GenerateAuthResponseType = Omit<UserRegType, 'accessCode'> & {
  id: number;
  type?: USERS_TOKENS_TYPES;
}

export type GetAccessCodeType = {
  email: string;
};

export type CreateUserByGoogleType = Omit<UserRegType, 'accessCode'> & {
  firstName?: string;
  secondName?: string;
  // avatarUrl
}

export type TypeOneTimePasswordType = {
  type: OneTimePasswordType;
}

export type GenerateTokenPayloadType = {
  id: number;
  email: string;
  typeId: USERS_TOKENS_TYPES
}

export type RefreshAuthType = {
  refreshToken: string;
}

export type ApiLoginType = {
  user_id?: number;
  client_id: string;
  client_secret: string;
}