
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.OWNER_EMAIL || 'owner@example.com';
  const password = process.env.OWNER_PASSWORD || 'ChangeMe123!';
  const rounds = Number(process.env.BCRYPT_ROUNDS) || 12;

  const passwordHash = await bcrypt.hash(password, rounds);

  const owner = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      role: 'OWNER',
      name: 'Owner',
      email,
      passwordHash,
      emailVerifiedAt: new Date(),
    },
  });

  console.log(`Owner ready: ${owner.email} (change the password after first login)`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
