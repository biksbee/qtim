import {
  BeforeInsert,
  BeforeUpdate,
  Column, CreateDateColumn, DeleteDateColumn,
  Entity, JoinColumn, ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CompaniesEntity } from '../companies/entities/companies.entity';
import { UsersTokensEntity } from '../users-tokens/entities/users-tokens.entity';
import { WorkspaceUsersEntity } from '../workspaces/enitty/workspaces-users.entity';
import { CollectionsEntity } from '../collections/collections.entity';
import { ReportsEntity } from '../reports/entities/reports.entity';
import { ThreadsEntity } from '../threads/threads.entity';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  first_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  last_name: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', nullable: true})
  phone: string;

  //TODO lang, сделать декоратор для определения языка

  @Column({ type: 'varchar', nullable: true, select: false  })
  password: string;

  @ManyToOne(() => CompaniesEntity, company => company.users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id'})
  company: CompaniesEntity;

  @OneToMany(() => WorkspaceUsersEntity, workspace => workspace.user)
  workspaces: WorkspaceUsersEntity[];

  @OneToMany(() => CollectionsEntity, collection => collection.user)
  collections: CollectionsEntity[];

  @OneToMany(() => ReportsEntity, report => report.user)
  reports: ReportsEntity[];

  @OneToMany(() => UsersTokensEntity, (token) => token.user)
  tokens: UsersTokensEntity[];

  @OneToMany(() => ThreadsEntity, thread => thread.user)
  threads: ThreadsEntity[];

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