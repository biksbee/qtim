import { socialNetworksTypesSeed } from './seed-social-networks-types';
import { AppDataSource } from '../../../data-source';
import { socialPostsTypesSeed } from './seed-social-posts-types';

async function seed() {
  await AppDataSource.initialize();

  console.log('Starting seeding process...');
  await socialNetworksTypesSeed(AppDataSource);
  await socialPostsTypesSeed(AppDataSource);

  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  AppDataSource.destroy();
});