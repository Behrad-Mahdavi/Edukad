import { PrismaClient } from '@prisma/client';
const remote = new PrismaClient();

async function main() {
  const byType = await remote.resource.groupBy({ by: ['type'], _count: { _all: true } });
  console.log('--- SUPABASE resources by type ---');
  for (const g of byType) console.log(g.type.padEnd(16) + g._count._all);

  console.log('\n--- Behrad roadmaps: nodes with a VIDEO_URL ---');
  for (const slug of ['uiux-designer', 'graphic-brand-designer']) {
    const r = await remote.roadmap.findUnique({
      where: { slug },
      include: { nodes: { select: { id: true, title: true, resources: { where: { type: 'VIDEO_URL' }, select: { content: true } } } } },
    });
    const withVid = r!.nodes.filter((n) => n.resources.length > 0).length;
    const withLayout = r!.nodes.filter((n) => n && (n as any).positionX !== null).length;
    console.log(slug.padEnd(26) + `${withVid}/${r!.nodes.length} nodes have video`);
  }

  console.log('\n--- broken / non-http resource links on Supabase ---');
  const bad = await remote.$queryRaw<Array<{ c: bigint }>>`
    SELECT count(*)::bigint AS c FROM "Resource"
    WHERE type IN ('LINK','VIDEO_URL') AND content NOT LIKE 'https%'`;
  console.log('non-https links:', String(bad[0].c));

  console.log('\n--- DAG cycle check ---');
  const cyc = await remote.$queryRaw<Array<{ id: string }>>`
    WITH RECURSIVE walk AS (
      SELECT "nodeId" AS start, "nodeId" AS cur, 1 AS depth, ARRAY["nodeId"]::text[] AS path
      FROM "NodePrerequisite"
      UNION ALL
      SELECT w.start, p."nodeId", w.depth + 1, w.path || p."nodeId"
      FROM walk w JOIN "NodePrerequisite" p ON p."prerequisiteNodeId" = w.cur
      WHERE w.depth < 40 AND NOT (w.path || p."nodeId") @> ARRAY[p."nodeId"]
    )
    SELECT DISTINCT start AS id FROM walk w
    JOIN "NodePrerequisite" p ON p."prerequisiteNodeId" = w.cur AND p."nodeId" = w.start`;
  console.log('cycles found:', (cyc as any[]).length);

  console.log('\n--- duplicate node titles per roadmap ---');
  const dups = await remote.$queryRaw<Array<{ slug: string; title: string; c: bigint }>>`
    SELECT r.slug, n.title, count(*)::bigint AS c
    FROM "Node" n JOIN "Roadmap" r ON r.id = n."roadmapId"
    GROUP BY r.slug, n.title HAVING count(*) > 1`;
  console.log(dups.length ? dups : 'none');

  console.log('\n--- stray roadmaps (not part of the 9 official positions) ---');
  const stray = await remote.$queryRaw<Array<{ slug: string; title: string; c: bigint }>>`
    SELECT r.slug, r.title, count(n.id)::bigint AS c
    FROM "Roadmap" r LEFT JOIN "Node" n ON n."roadmapId" = r.id
    WHERE r.slug NOT IN ('frontend-dev','backend-dev','uiux-designer','graphic-brand-designer',
      'motion-graphic-designer','video-editor','content-creator','digital-marketer','event-ops-coordinator')
    GROUP BY r.slug, r.title`;
  console.log(stray.length ? stray : 'none');
}
main().catch((e) => console.error(e.message.slice(0, 400))).finally(() => remote.$disconnect());
