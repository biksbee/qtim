import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ARTICLE_STATUS } from '../../utils/constants';
import { UsersEntity } from '../users/users.entity';
import { slugify } from 'transliteration';
import { v4 as uuid } from 'uuid';

@Entity('articles')
export class ArticlesEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255, unique: true })
  slug: string;

  @Column('text')
  content: string;

  @Column({
    type: 'enum',
    enum: ARTICLE_STATUS,
    default: ARTICLE_STATUS.DRAFT,
  })
  status: ARTICLE_STATUS;

  @Column('simple-array', { nullable: true })
  tags?: string[];

  @Column({ type: 'timestamp', nullable: true })
  publishedAt?: Date;

  @ManyToOne(() => UsersEntity, (user) => user.articles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  author: UsersEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  generateSlug() {
    if (!this.slug) {
      this.slug = uuid() + ':' + slugify(this.title, { lowercase: true, separator: '-' });
    }
  }

  @BeforeUpdate()
  changeStatus() {
    if (this.status === ARTICLE_STATUS.PUBLISHED) {
      this.publishedAt = new Date;
    } else if (this.status === ARTICLE_STATUS.ARCHIVED) {
      this.publishedAt = null;
    }
  }
}