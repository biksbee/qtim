export type UserCreateType = {
  email: string;
  password: string;
};

export type GetUserType = {
  id?: number;
  relations?: string[];
  select?: string | string[] | 'all';
}