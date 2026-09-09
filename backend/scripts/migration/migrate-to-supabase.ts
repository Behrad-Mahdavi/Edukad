import { PrismaClient } from '@prisma/client';

const local = new PrismaClient({
  datasources: { db: { url: "postgresql://edukad:edukad_secret_password@localhost:5432/edukad_db?schema=public" } }
});
const remote = new PrismaClient();

async function wipeRemote() {
  console.log('0. Wiping Supabase (reverse-FK order)...');
  await remote.$transaction([
    remote.notification.deleteMany(),
    remote.nodeSubmission.deleteMany(),
    remote.nodeProgress.deleteMany(),
    remote.userRoadmap.deleteMany(),
    remote.resource.deleteMany(),
    remote.nodePrerequisite.deleteMany(),
    remote.node.deleteMany(),
    remote.roadmap.deleteMany(),
    remote.user.deleteMany(),
  ]);
  console.log('   wiped.');
}

async function copyTable(name: string, fetch: () => Promise<any[]>, createMany: (data: any[]) => Promise<any>) {
  const rows = await fetch();
  const CHUNK = 100;
  for (let i = 0; i < rows.length; i += CHUNK) {
    await createMany(rows.slice(i, i + CHUNK));
    console.log(`   ${name}: ${Math.min(i + CHUNK, rows.length)}/${rows.length}`);
  }
  return rows.length;
}

async function main() {
  await wipeRemote();

  console.log('1. Users');
  await copyTable('user', () => local.user.findMany(), (d) => remote.user.createMany({ data: d, skipDuplicates: true }));

  console.log('2. Roadmaps');
  await copyTable('roadmap', () => local.roadmap.findMany(), (d) => remote.roadmap.createMany({ data: d, skipDuplicates: true }));

  console.log('3. Nodes');
  await copyTable('node', () => local.node.findMany(), (d) => remote.node.createMany({ data: d, skipDuplicates: true }));

  console.log('4. Prerequisites (after all nodes exist)');
  await copyTable('prereq', () => local.nodePrerequisite.findMany(), (d) => remote.nodePrerequisite.createMany({ data: d, skipDuplicates: true }));

  console.log('5. Resources');
  await copyTable('resource', () => local.resource.findMany(), (d) => remote.resource.createMany({ data: d, skipDuplicates: true }));

  console.log('6. Enrollments');
  await copyTable('enrollment', () => local.userRoadmap.findMany(), (d) => remote.userRoadmap.createMany({ data: d, skipDuplicates: true }));

  console.log('7. NodeProgress');
  await copyTable('progress', () => local.nodeProgress.findMany(), (d) => remote.nodeProgress.createMany({ data: d, skipDuplicates: true }));

  console.log('8. Submissions & Notifications (if any)');
  await copyTable('submission', () => local.nodeSubmission.findMany(), (d) => d.length ? remote.nodeSubmission.createMany({ data: d, skipDuplicates: true }) : Promise.resolve());
  await copyTable('notification', () => local.notification.findMany(), (d) => d.length ? remote.notification.createMany({ data: d, skipDuplicates: true }) : Promise.resolve());

  console.log('\n=== VERIFY SUPABASE ===');
  console.log('user:           ', await remote.user.count());
  console.log('roadmap:        ', await remote.roadmap.count());
  console.log('node:           ', await remote.node.count());
  console.log('nodePrereq:     ', await remote.nodePrerequisite.count());
  console.log('resource:       ', await remote.resource.count());
  console.log('userRoadmap:    ', await remote.userRoadmap.count());
  console.log('nodeProgress:   ', await remote.nodeProgress.count());
  console.log('\n--- roadmaps & node counts ---');
  const rms = await remote.roadmap.findMany({ select: { slug: true, _count: { select: { nodes: true } } }, orderBy: { slug: 'asc' } });
  for (const r of rms) console.log(r.slug.padEnd(26) + r._count.nodes);
  console.log('\n🎉 SUPABASE FULLY SYNCED WITH LOCAL DOCKER');
}

main()
  .catch((e) => { console.error('Migration failed:', e.message ? e.message.slice(0, 500) : e); process.exit(1); })
  .finally(async () => { await local.$disconnect(); await remote.$disconnect(); });
