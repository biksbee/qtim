import { AppDataSource } from '../../../data-source';
import { UserTokensSeed } from './seed-user-tokens';

async function seed() {
  await AppDataSource.initialize();

  console.log('Starting seeding process...');
  await UserTokensSeed(AppDataSource);

  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  AppDataSource.destroy();
});