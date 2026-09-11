import { PrismaClient } from '@prisma/client';

const dbs = [
  { name: 'SUPABASE', client: new PrismaClient() },
  { name: 'LOCAL DOCKER', client: new PrismaClient({ datasources: { db: { url: "postgresql://edukad:edukad_secret_password@localhost:5432/edukad_db?schema=public" } } }) }
];

const theoryNodes = [
  "مبانی اینترنت و HTTP",
  "مدیریت ترنزکشن‌های پیچیده و ACID در پایگاه داده",
  "معماری RESTful API",
  "طراحی API با GraphQL (در برابر REST)",
  "وب‌هوک‌ها (Webhooks) و معماری تعاملات خارجی",
  "معماری Microservices (مبانی)",
  "آشنایی با Docker",
  "معماری رویدادمحور با Message Broker (RabbitMQ)",
  "امنیت پیشرفته وب (CORS, CSRF, Helmet, SQL Injection)"
];

async function applyFix(dbName: string, prisma: PrismaClient) {
  console.log(`\n================ FIXING DELIVERABLES IN ${dbName} ================`);
  const roadmap = await prisma.roadmap.findUnique({
    where: { slug: 'backend-dev' }
  });

  if (!roadmap) return;

  const result = await prisma.node.updateMany({
    where: {
      roadmapId: roadmap.id,
      title: { in: theoryNodes }
    },
    data: {
      hasDeliverable: false
    }
  });

  const resultDeliverable = await prisma.node.updateMany({
    where: {
      roadmapId: roadmap.id,
      title: { notIn: theoryNodes }
    },
    data: {
      hasDeliverable: true
    }
  });

  console.log(`✅ Set hasDeliverable=false for ${result.count} theory nodes.`);
  console.log(`✅ Set hasDeliverable=true for ${resultDeliverable.count} practical nodes.`);

  const check = await prisma.node.findMany({
    where: { roadmapId: roadmap.id },
    select: { title: true, hasDeliverable: true },
    orderBy: { positionY: 'asc' }
  });

  const theoryFound = check.filter(n => !n.hasDeliverable).map(n => n.title);
  console.log('\nTheory Nodes (No Deliverable):');
  theoryFound.forEach(t => console.log(` - 🧠 ${t}`));
}

async function main() {
  for (const db of dbs) {
    await applyFix(db.name, db.client);
  }
  console.log('\n🎉 ALL DONE!');
}

main().catch(console.error).finally(async () => {
  for (const db of dbs) await db.client.$disconnect();
});
