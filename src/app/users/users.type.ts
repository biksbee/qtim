import { FilesType } from '../../modules/file-storage/file-storage.type';

export type UserCreateType = {
  email: string;
  accessCode?: string;
};

export type UserUpdateType = {
  first_name?: string;
  last_name?: string;
  file?: FilesType;
}

export type GetUserType = {
  id?: number;
  email?: string;
  relations?: string[];
  select?: string | string[] | 'all';
}