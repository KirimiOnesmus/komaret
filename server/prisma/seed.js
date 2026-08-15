
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

  // Fixed service categories. This set is canonical and owner-managed only in
  // the sense that services are TAGGED to a category — the owner cannot add,
  // rename or delete categories. The 6 service-y ones are published (shown on
  // the public header/footer/home grid + services filter); Consultation and
  // Other are seeded unpublished so services can still be tagged internally
  // without surfacing them to visitors.
  const CATEGORIES = [
    { name: 'General Construction', slug: 'general-construction', isPublished: true, sortOrder: 1 },
    { name: 'Interior Design', slug: 'interior-design', isPublished: true, sortOrder: 2 },
    { name: 'Renovation', slug: 'renovation', isPublished: true, sortOrder: 3 },
    { name: 'Real Estate Development', slug: 'real-estate-development', isPublished: true, sortOrder: 4 },
    { name: 'Machinery Hire', slug: 'machinery-hire', isPublished: true, sortOrder: 5 },
    { name: 'Labour Supply', slug: 'labour-supply', isPublished: true, sortOrder: 6 },
    { name: 'Consultation', slug: 'consultation', isPublished: false, sortOrder: 7 },
    { name: 'Other', slug: 'other', isPublished: false, sortOrder: 8 },
  ];

  for (const c of CATEGORIES) {
    await prisma.serviceCategory.upsert({
      where: { slug: c.slug },
      update: { name: c.name, isPublished: c.isPublished, sortOrder: c.sortOrder },
      create: c,
    });
  }

  console.log(`Seeded ${CATEGORIES.length} service categories (${CATEGORIES.filter((c) => c.isPublished).length} published).`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
