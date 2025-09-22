import {
  BeforeInsert,
  BeforeUpdate,
  Column, CreateDateColumn, DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsersTokensEntity } from '../users-tokens/entities/users-tokens.entity';
import { ArticlesEntity } from '../articles/articles.entity';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', nullable: true, select: false  })
  password: string;

  @OneToMany(() => UsersTokensEntity, (token) => token.user)
  tokens: UsersTokensEntity[];

  @OneToMany(() => ArticlesEntity, (article) => article.author)
  articles: ArticlesEntity[];

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}