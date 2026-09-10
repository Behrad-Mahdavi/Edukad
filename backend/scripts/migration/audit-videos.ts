import { PrismaClient } from '@prisma/client';

const dbs: Array<[string, PrismaClient]> = [
  ['SUPABASE', new PrismaClient()],
  ['LOCAL DOCKER', new PrismaClient({ datasources: { db: { url: "postgresql://edukad:edukad_secret_password@localhost:5432/edukad_db?schema=public" } } })],
];

async function run() {
  for (const [label, db] of dbs) {
    console.log(`\n########## ${label} ##########`);

    const dups = await db.$queryRaw<Array<{ nodeId: string; cnt: bigint }>>`
      SELECT "nodeId", count(*)::bigint AS cnt FROM "Resource"
      WHERE type='VIDEO_URL' GROUP BY "nodeId" HAVING count(*) > 1`;
    console.log(`nodes with >1 VIDEO_URL: ${dups.length}`);

    let removed = 0;
    for (const d of dups) {
      const rows = await db.resource.findMany({
        where: { nodeId: d.nodeId, type: 'VIDEO_URL' },
        orderBy: { updatedAt: 'desc' }
      });
      // keep the best: prefer https + non-empty url, else newest
      const keep = rows.find(r => /^https:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]{11}/.test(r.content)) ?? rows[0];
      for (const r of rows) {
        if (r.id !== keep.id) {
          await db.resource.delete({ where: { id: r.id } });
          removed++;
        }
      }
    }
    console.log(`duplicate rows deleted: ${removed}`);

    console.log('--- per-roadmap video coverage ---');
    const rms = await db.$queryRaw<Array<{ slug: string; nodes: bigint; withvid: bigint }>>`
      SELECT r.slug,
             count(DISTINCT n.id)::bigint AS nodes,
             count(DISTINCT CASE WHEN res.type='VIDEO_URL' THEN n.id END)::bigint AS withvid
      FROM "Roadmap" r
      JOIN "Node" n ON n."roadmapId"=r.id
      LEFT JOIN "Resource" res ON res."nodeId"=n.id
      GROUP BY r.slug ORDER BY r.slug`;
    for (const r of rms) {
      const flag = r.withvid === r.nodes ? '' : ' ';
      console.log(`${flag} ${r.slug.padEnd(26)} ${String(r.withvid)}/${String(r.nodes)}`);
    }

    const bad = await db.$queryRaw<Array<{ c: bigint }>>`
      SELECT count(*)::bigint c FROM "Resource" WHERE type='VIDEO_URL' AND content NOT LIKE 'https://www.youtube.com/watch?v=%'`;
    console.log(`malformed youtube urls: ${String(bad[0].c)}`);
    console.log(`total VIDEO_URL rows: ${await db.resource.count({ where: { type: 'VIDEO_URL' } })}`);
  }
}

run().catch(e => console.error('ERR', e.message.slice(0, 300))).finally(() => Promise.all(dbs.map(([, d]) => d.$disconnect())));
