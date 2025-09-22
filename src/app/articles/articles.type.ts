import { ListType } from '../../utils/type';
import { ARTICLE_STATUS } from '../../utils/constants';

export type FilterArticlesType = Partial<{
  id?: number;
  title?: string;
  slug?: string;
  status?: ARTICLE_STATUS;
  tags?: string[];
  author?: number;
  publishedFrom?: Date;
  publishedTo?: Date;
}>

export type ListArticlesType = ListType & {
  filter?: FilterArticlesType
}

export type CreateArticleType = {
  title: string;
  content: string;
  tags?: string[];
}

export type UpdateArticleType = Partial<CreateArticleType>