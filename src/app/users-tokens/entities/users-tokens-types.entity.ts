import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UsersTokensEntity } from './users-tokens.entity';

@Entity('users_tokens_types')
export class UsersTokensTypesEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'boolean', default: false })
  need_encryption: boolean

  @Column({ type: 'varchar', nullable: true })
  lifetime: string;

  @OneToMany(() => UsersTokensEntity, token => token.type)
  tokens: UsersTokensEntity[];
}