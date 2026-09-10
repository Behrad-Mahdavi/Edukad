import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const local = new PrismaClient({
  datasources: { db: { url: "postgresql://edukad:edukad_secret_password@localhost:5432/edukad_db?schema=public" } }
});
const remote = new PrismaClient();

function norm(s: string): string {
  return s.normalize('NFC').trim().toLowerCase().replace(/[\u200B-\u200D\uFEFF]/g, '');
}

async function loadData() {
  const filePath = path.join(process.env.HOME || '/Users/behrad', 'Downloads/edukad_frontend_backend_final.json');
  const items: Array<{ node_title: string; youtube_title: string; youtube_url: string; channel?: string }> =
    JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  console.log(`Loaded ${items.length} items from downloads JSON.`);
  return items;
}

async function applyToDb(name: string, prisma: PrismaClient, items: Array<{ node_title: string; youtube_title: string; youtube_url: string }>) {
  console.log(`\n================== SYNCING TO ${name} ==================`);

  // Target roadmaps: frontend-dev, backend-dev
  const targetRoadmaps = ['frontend-dev', 'backend-dev'];

  const nodes = await prisma.node.findMany({
    where: { roadmap: { slug: { in: targetRoadmaps } } },
    include: {
      roadmap: { select: { slug: true } },
      resources: { where: { type: 'VIDEO_URL' } }
    }
  });

  console.log(`Found ${nodes.length} nodes in DB for frontend-dev + backend-dev.`);

  // Create lookup maps from JSON items
  const exactMap = new Map<string, typeof items[0]>();
  for (const it of items) {
    exactMap.set(norm(it.node_title), it);
  }

  let matched = 0;
  let updated = 0;
  let inserted = 0;
  const unmatchedNodes: string[] = [];

  for (const node of nodes) {
    const nNorm = norm(node.title);
    let matchedItem = exactMap.get(nNorm);

    // Fuzzy matching if exact fails
    if (!matchedItem) {
      for (const [k, it] of exactMap.entries()) {
        if (nNorm.includes(k) || k.includes(nNorm) ||
            (nNorm.split(' ')[0] === k.split(' ')[0] && nNorm.split(' ')[1] === k.split(' ')[1])) {
          matchedItem = it;
          break;
        }
      }
    }

    if (matchedItem) {
      matched++;
      const title = ' ' + matchedItem.youtube_title.slice(0, 95);
      const url = matchedItem.youtube_url.trim();

      if (node.resources.length > 0) {
        await prisma.resource.update({
          where: { id: node.resources[0].id },
          data: { title, content: url, updatedAt: new Date() }
        });
        updated++;
      } else {
        await prisma.resource.create({
          data: {
            nodeId: node.id,
            title,
            type: 'VIDEO_URL',
            content: url
          }
        });
        inserted++;
      }
    } else {
      unmatchedNodes.push(`[${node.roadmap.slug}] ${node.title}`);
    }
  }

  console.log(`Matched: ${matched}/${nodes.length} nodes.`);
  console.log(`Inserted: ${inserted}, Updated: ${updated}`);
  if (unmatchedNodes.length > 0) {
    console.log(`Unmatched nodes (${unmatchedNodes.length}):`, unmatchedNodes);
  }

  // Deduplicate VIDEO_URL just in case
  const dups = await prisma.$queryRaw<Array<{ nodeId: string; cnt: bigint }>>`
    SELECT "nodeId", count(*)::bigint AS cnt FROM "Resource"
    WHERE type='VIDEO_URL' GROUP BY "nodeId" HAVING count(*) > 1`;
  for (const d of dups) {
    const rows = await prisma.resource.findMany({
      where: { nodeId: d.nodeId, type: 'VIDEO_URL' },
      orderBy: { updatedAt: 'desc' }
    });
    for (let i = 1; i < rows.length; i++) {
      await prisma.resource.delete({ where: { id: rows[i].id } });
    }
  }
}

async function verifyAll(prisma: PrismaClient, name: string) {
  console.log(`\n--- ${name} SUMMARY ---`);
  const rms = await prisma.roadmap.findMany({
    where: {
      slug: {
        in: [
          'frontend-dev', 'backend-dev', 'uiux-designer', 'graphic-brand-designer',
          'motion-graphic-designer', 'video-editor', 'content-creator',
          'digital-marketer', 'event-ops-coordinator'
        ]
      }
    },
    select: {
      slug: true,
      title: true,
      _count: { select: { nodes: true } },
      nodes: {
        select: {
          id: true,
          resources: { where: { type: 'VIDEO_URL' }, select: { id: true } }
        }
      }
    },
    orderBy: { slug: 'asc' }
  });

  let totalNodes = 0;
  let totalVideos = 0;

  for (const r of rms) {
    const vids = r.nodes.filter(n => n.resources.length > 0).length;
    totalNodes += r._count.nodes;
    totalVideos += vids;
    const status = vids === r._count.nodes ? '' : '';
    console.log(`${status} ${r.slug.padEnd(26)} ${vids}/${r._count.nodes} (${r.title})`);
  }
  console.log(`\nTOTAL OVERALL: ${totalVideos}/${totalNodes} nodes have VIDEO_URL.`);
}

async function main() {
  const items = await loadData();
  await applyToDb('LOCAL DOCKER', local, items);
  await applyToDb('SUPABASE (Remote)', remote, items);

  await verifyAll(remote, 'SUPABASE');
}

main()
  .catch(e => {
    console.error('Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await local.$disconnect();
    await remote.$disconnect();
  });
