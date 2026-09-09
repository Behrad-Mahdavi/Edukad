import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

// Connect to both Local Docker and Supabase (DATABASE_URL in .env)
const local = new PrismaClient({
  datasources: { db: { url: "postgresql://edukad:edukad_secret_password@localhost:5432/edukad_db?schema=public" } }
});
const remote = new PrismaClient();

function norm(s: string): string {
  return s.normalize('NFC').trim();
}

async function loadFiles() {
  const docsDir = path.join(process.env.HOME || '/Users/behrad', 'Desktop/Projects/edukad/docs');
  
  const files = [
    { file: 'Content Creator Social Media Manager.json', slug: 'content-creator' },
    { file: 'Digital Marketing Specialist.json', slug: 'digital-marketer' },
    { file: 'Event & Operations Coordinator.json', slug: 'event-ops-coordinator' },
    { file: 'edukad_skill_nodes.json', slug: 'video-motion' } // this has video editor + motion graphic
  ];

  const videoMap: Record<string, { title: string; url: string; rawTitle: string }> = {};

  for (const f of files) {
    const fullPath = path.join(docsDir, f.file);
    if (!fs.existsSync(fullPath)) {
      console.warn('File not found:', fullPath);
      continue;
    }
    const items = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
    console.log(`Loaded ${items.length} items from ${f.file}`);
    for (const item of items) {
      if (item.node_title && item.youtube_url) {
        videoMap[norm(item.node_title)] = {
          title: item.youtube_title || 'ویدیوی آموزشی',
          url: item.youtube_url.trim(),
          rawTitle: item.node_title
        };
      }
    }
  }

  console.log(`Total unique video mappings collected: ${Object.keys(videoMap).length}`);
  return videoMap;
}

async function applyVideosToDb(name: string, prisma: PrismaClient, videoMap: Record<string, { title: string; url: string; rawTitle: string }>) {
  console.log(`\n================== APPLYING TO ${name} ==================`);
  
  // Get all nodes from DB
  const nodes = await prisma.node.findMany({
    select: {
      id: true,
      title: true,
      roadmap: { select: { slug: true } },
      resources: { where: { type: 'VIDEO_URL' }, select: { id: true, content: true } }
    }
  });

  let matched = 0;
  let inserted = 0;
  let updated = 0;
  let missing: string[] = [];

  for (const node of nodes) {
    const nTitle = norm(node.title);
    const videoData = videoMap[nTitle];

    if (videoData) {
      matched++;
      const resourceTitle = '🎬 ' + videoData.title.slice(0, 95);
      const url = videoData.url;

      if (node.resources.length > 0) {
        // Update existing
        await prisma.resource.update({
          where: { id: node.resources[0].id },
          data: {
            title: resourceTitle,
            content: url
          }
        });
        updated++;
      } else {
        // Insert new VIDEO_URL
        await prisma.resource.create({
          data: {
            nodeId: node.id,
            title: resourceTitle,
            type: 'VIDEO_URL',
            content: url
          }
        });
        inserted++;
      }
    }
  }

  console.log(`[${name}] Matched nodes: ${matched}/${nodes.length}`);
  console.log(`[${name}] Inserted new videos: ${inserted}, Updated: ${updated}`);

  // Summary per roadmap
  const rms = await prisma.roadmap.findMany({
    select: {
      slug: true,
      _count: { select: { nodes: true } },
      nodes: {
        select: {
          resources: { where: { type: 'VIDEO_URL' }, select: { id: true } }
        }
      }
    },
    orderBy: { slug: 'asc' }
  });

  console.log(`\n--- ${name} VIDEO STATS BY ROADMAP ---`);
  for (const r of rms) {
    const withVid = r.nodes.filter(n => n.resources.length > 0).length;
    console.log(`${r.slug.padEnd(26)} ${withVid}/${r._count.nodes} nodes have VIDEO_URL`);
  }
}

async function main() {
  const videoMap = await loadFiles();

  // Apply to remote Supabase
  await applyVideosToDb('SUPABASE (Remote)', remote, videoMap);

  // Apply to local Docker
  await applyVideosToDb('LOCAL DOCKER', local, videoMap);

  console.log('\n✅ ALL VIDEOS FROM ATTACHED JSON FILES APPLIED SUCCESSFULLY!');
}

main()
  .catch(e => {
    console.error('Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await local.$disconnect();
    await remote.$disconnect();
  });
