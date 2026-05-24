import dataSource from './typeorm.config';
import { UserEntity } from './entities';
import { seedAdminUser } from './seeders/admin.seeder';

async function bootstrap() {
  await dataSource.initialize();

  try {
    const admin = await seedAdminUser(dataSource.getRepository(UserEntity));
    console.log(`Admin user ready: ${admin.username}`);
  } finally {
    await dataSource.destroy();
  }
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
