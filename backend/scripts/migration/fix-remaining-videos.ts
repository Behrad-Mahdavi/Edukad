import { PrismaClient } from '@prisma/client';

const local = new PrismaClient({ datasources: { db: { url: "postgresql://edukad:edukad_secret_password@localhost:5432/edukad_db?schema=public" } } });
const remote = new PrismaClient();

const extras = [
  {
    slug: 'digital-marketer',
    title: 'آنالیز و ردیابی رویدادها (Google Tag Manager)',
    vTitle: 'Google Tag Manager Tutorial for Beginners (2025/2026)',
    vUrl: 'https://www.youtube.com/watch?v=kfg_lX_9Xn4'
  },
  {
    slug: 'digital-marketer',
    title: 'بازاریابی رویداد دیجیتال (Virtual Events)',
    vTitle: 'Virtual Event Marketing: How to Promote Your Online Event',
    vUrl: 'https://www.youtube.com/watch?v=Fq_u0Kx6T50'
  },
  {
    slug: 'motion-graphic-designer',
    title: 'ایجاد سیستم‌های کنترل‌گر با Expressions',
    vTitle: 'How to use Expression Controls in Adobe After Effects (Explained Ep. 9)',
    vUrl: 'https://www.youtube.com/watch?v=hc4_txAEy6k'
  },
  {
    slug: 'video-editor',
    title: 'اسلو موشن و تایم‌ remapping',
    vTitle: 'Smooth Speed Ramp in Premiere Pro!',
    vUrl: 'https://www.youtube.com/watch?v=gtrcAKl1Rfs'
  }
];

async function fix(prisma: PrismaClient, label: string) {
  console.log(`Fixing remaining in ${label}...`);
  for (const item of extras) {
    const node = await prisma.node.findFirst({
      where: {
        title: { contains: item.title.slice(0, 15) },
        roadmap: { slug: item.slug }
      },
      include: { resources: { where: { type: 'VIDEO_URL' } } }
    });

    if (node) {
      if (node.resources.length > 0) {
        await prisma.resource.update({
          where: { id: node.resources[0].id },
          data: { title: '🎬 ' + item.vTitle, content: item.vUrl }
        });
      } else {
        await prisma.resource.create({
          data: {
            nodeId: node.id,
            title: '🎬 ' + item.vTitle,
            type: 'VIDEO_URL',
            content: item.vUrl
          }
        });
      }
      console.log(`  + Updated: [${item.slug}] ${node.title}`);
    } else {
      console.warn(`  ! Node not found for [${item.slug}] ${item.title}`);
    }
  }
}

async function main() {
  await fix(remote, 'Supabase');
  await fix(local, 'Local Docker');
  console.log('Done!');
}

main().finally(async () => {
  await local.$disconnect();
  await remote.$disconnect();
});
