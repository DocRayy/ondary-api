import { Repository } from 'typeorm';
import { hashPassword } from '../../common/security/password.util';
import { UserEntity } from '../entities';

export async function seedAdminUser(usersRepository: Repository<UserEntity>) {
  const password = await hashPassword('Admin123');
  const existingAdmin = await usersRepository.findOne({
    where: { username: 'admin' },
  });

  if (existingAdmin) {
    await usersRepository.update(existingAdmin.id, {
      email: existingAdmin.email || 'admin@ondary.local',
      password,
      name: existingAdmin.name || 'Administrator',
      role: existingAdmin.role || 'member',
      status: 'active',
      is_verified: true,
    });

    return usersRepository.findOneOrFail({ where: { id: existingAdmin.id } });
  }

  return usersRepository.save(
    usersRepository.create({
      username: 'admin',
      email: 'admin@ondary.local',
      password,
      name: 'Administrator',
      role: 'member',
      status: 'active',
      is_verified: true,
    }),
  );
}
