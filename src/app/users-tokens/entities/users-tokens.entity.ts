import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsersTokensTypesEntity } from './users-tokens-types.entity';
import { UsersEntity } from '../../users/users.entity';

@Entity('users_tokens')
export class UsersTokensEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar' })
  token: string;

  @Column({ type: 'varchar' })
  fingerprint: string;

  @Column({ type: 'timestamp' })
  expires_at: Date;

  @ManyToOne(() => UsersTokensTypesEntity, type => type.tokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'type_id' })
  type: UsersTokensTypesEntity

  @ManyToOne(() => UsersEntity, user => user.tokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}