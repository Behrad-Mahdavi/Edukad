const { PrismaClient } = require('@prisma/client');

async function countAll(label, prisma) {
  console.log('=== ' + label + ' ===');
  const tables = ['user', 'roadmap', 'node', 'resource', 'nodePrerequisite', 'userRoadmap', 'nodeProgress', 'nodeSubmission', 'notification'];
  for (const t of tables) {
    try {
      const c = await prisma[t].count();
      console.log(t.padEnd(20) + c);
    } catch (e) {
      console.log(t.padEnd(20) + 'ERR ' + e.message.slice(0, 60));
    }
  }
  console.log('--- roadmaps & nodes ---');
  try {
    const rms = await prisma.roadmap.findMany({ select: { slug: true, title: true, status: true, _count: { select: { nodes: true } } }, orderBy: { slug: 'asc' } });
    for (const r of rms) {
      console.log(r.slug.padEnd(26) + String(r._count.nodes).padStart(4) + '   ' + r.status);
    }
  } catch (e) { console.log('ERR', e.message.slice(0, 80)); }
}

async function main() {
  // Remote (Supabase) — uses backend/.env DATABASE_URL which currently points to Supabase
  const remote = new PrismaClient();
  await countAll('SUPABASE (remote, current .env)', remote);
  await remote.$disconnect();
}
main().catch((e) => { console.error('FATAL', e.message.slice(0, 300)); process.exit(1); });
