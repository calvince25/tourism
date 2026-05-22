const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'omondicalvince4714@gmail.com';
  const name = 'Calvince';
  const password = 'sambusa';
  
  console.log(`Hashing password for ${email}...`);
  const hashedPassword = await bcrypt.hash(password, 12);
  
  console.log(`Upserting admin user into the database...`);
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      isFirstAdmin: true
    },
    create: {
      name,
      email,
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      isFirstAdmin: true
    }
  });
  
  console.log(`✅ Admin user seeded successfully! ID: ${user.id}`);
}

main()
  .catch((err) => {
    console.error('Error seeding admin user:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
