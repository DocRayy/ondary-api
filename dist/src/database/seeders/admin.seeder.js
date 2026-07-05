"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAdminUser = seedAdminUser;
const password_util_1 = require("../../common/security/password.util");
async function seedAdminUser(usersRepository) {
    const password = await (0, password_util_1.hashPassword)('Admin123');
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
    return usersRepository.save(usersRepository.create({
        username: 'admin',
        email: 'admin@ondary.local',
        password,
        name: 'Administrator',
        role: 'member',
        status: 'active',
        is_verified: true,
    }));
}
//# sourceMappingURL=admin.seeder.js.map