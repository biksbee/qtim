export type PaginationType = {
  page?: number;
  limit?: number;
}

export type OrderType = {
  field?: string;
  by?: 'ASC' | 'DESC';
}

export type ListType = {
  pagination?: PaginationType;
  order?: OrderType;
}