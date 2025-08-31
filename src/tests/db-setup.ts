
import { PrismaClient } from '@prisma/client';



const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL || 'postgresql://user:password@localhost:5433/test_invoice_management?schema=public'
  }
}
});


beforeAll(async () => {
  // clean database before running tests
  await cleanDatabase();
});

afterAll(async () => {
  // clean database after tests
  await cleanDatabase();
  await prisma.$disconnect();
});

export async function cleanDatabase() {
  const tablenames = await prisma.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename FROM pg_tables WHERE schemaname='public'
  `;

  for (const { tablename } of tablenames) {
    if (tablename !== '_prisma_migrations') {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "public"."${tablename}" CASCADE;`);
    }
  }
}

export { prisma };