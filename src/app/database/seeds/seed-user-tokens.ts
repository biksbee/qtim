import { UsersTokensTypesEntity } from '../../users-tokens/entities/users-tokens-types.entity';
import { DataSource } from 'typeorm';

export async function UserTokensSeed(dataSource: DataSource) {
  const repo = dataSource.getRepository(UsersTokensTypesEntity);

  const item = {
    name: 'REFRESH',
    need_encryption: true,
    lifetime: '30d',
  };

  await repo.save(repo.create(item));
  console.log(`✅ Seeded: ${item.name}`);
}
