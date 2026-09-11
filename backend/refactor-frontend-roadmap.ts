import { PrismaClient } from '@prisma/client';

const dbs = [
  { name: 'SUPABASE', client: new PrismaClient() },
  { name: 'LOCAL DOCKER', client: new PrismaClient({ datasources: { db: { url: "postgresql://edukad:edukad_secret_password@localhost:5432/edukad_db?schema=public" } } }) }
];

// Target structure of 32 nodes for frontend-dev
// Title -> { prereqs: string[], description: string, deliverable: boolean, resources: any[] }
const NEW_RESOURCES = {
  'تبدیل طراحی به کد (Figma to Code)': [
    {
      title: '🎬 From Figma to Code / Creating a resume page',
      type: 'VIDEO_URL',
      content: 'https://www.youtube.com/watch?v=LkZPd0oRlMQ'
    },
    {
      title: 'مستندات پیاده‌سازی طراحی در کد — Figma Dev Mode',
      type: 'LINK',
      content: 'https://help.figma.com/hc/en-us/articles/15023124644247-Guide-to-Dev-Mode'
    },
    {
      title: 'مأموریت: پیاده‌سازی کامپوننت لندینگ رکاد از روی فیگما',
      type: 'MARKDOWN_TEXT',
      content: '### مأموریت تبدیل دیزاین فیگما به کد تمیز\n\nفایل طراحی لندینگ کافه کارآفرینی رکاد را از تیم UI/UX تحویل بگیر و یک سکشن کامل (Hero Section) آن را با رعایت دقیق فاصله‌ها، فونت‌ها و رنگ‌ها با HTML/CSS ریسپانسیو پیاده‌سازی کن.'
    }
  ],
  'امنیت پایه وب (XSS, CORS, CSP)': [
    {
      title: '🎬 Learn CORS In 6 Minutes',
      type: 'VIDEO_URL',
      content: 'https://www.youtube.com/watch?v=PNtFSVU-YTI'
    },
    {
      title: 'راهنمای امنیت وب و جلوگیری از XSS — MDN Web Docs',
      type: 'LINK',
      content: 'https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting'
    },
    {
      title: 'مأموریت: اعتبارسنجی و ایمن‌سازی ورودی‌های فرم پیام',
      type: 'MARKDOWN_TEXT',
      content: '### مأموریت امن‌سازی فرم ارتباط با ما\n\nدر فرم تماس سایت مدرسه رکاد، اسکریپت‌های تست XSS (مانند `<script>alert(1)</script>`) را تست کن و مکانیسم پاکسازی (Sanitization) و محدودسازی Content Security Policy را پیاده‌سازی کن.'
    }
  ],
  'دیپلوی و هاستینگ (Vercel/Netlify)': [
    {
      title: '🎬 Deploy Your Next.js App FAST with Vercel + Custom Domain Setup',
      type: 'VIDEO_URL',
      content: 'https://www.youtube.com/watch?v=d9lEm31FeG4'
    },
    {
      title: 'مستندات دیپلوی ورسل — Vercel Deployment Documentation',
      type: 'LINK',
      content: 'https://vercel.com/docs/deployments/overview'
    },
    {
      title: 'مأموریت: استقرار پروژه روی دامنه تستی ورسل',
      type: 'MARKDOWN_TEXT',
      content: '### مأموریت دیپلوی نسخه آزمایشی سامانه Edukad\n\nریپازیتوری پروژه را به حساب کاربری Vercel متصل کن، متغیرهای محیطی مورد نیاز را تنظیم کرده و لینک زنده دپلوی را به منتور تحویل بده.'
    }
  ]
};

// Layout coordinates algorithm for 32 nodes
// Levels & Columns
const NODE_FLOW: Array<{
  title: string;
  prereqs: string[];
  levelY: number;
  colX: number;
  description?: string;
}> = [
  { title: 'مبانی وب و HTML سمانتیک', prereqs: [], levelY: 60, colX: 885 },
  { title: 'پایه‌های استایل‌دهی با CSS', prereqs: ['مبانی وب و HTML سمانتیک'], levelY: 320, colX: 885 },
  { title: 'چیدمان با Flexbox', prereqs: ['پایه‌های استایل‌دهی با CSS'], levelY: 580, colX: 885 },
  { title: 'چیدمان با CSS Grid', prereqs: ['چیدمان با Flexbox'], levelY: 840, colX: 885 },
  { title: 'طراحی رسپانسیو و Mobile-First', prereqs: ['چیدمان با CSS Grid'], levelY: 1100, colX: 885 },
  
  // New: Figma to Code
  { title: 'تبدیل طراحی به کد (Figma to Code)', prereqs: ['طراحی رسپانسیو و Mobile-First'], levelY: 1360, colX: 885, description: 'خواندن فایل‌های فیگما تیم UI/UX، استخراج توکن‌های رنگ و فاصله، و تبدیل دقیق اتود به کد HTML و CSS ریسپانسیو' },
  
  // Parallel track after responsive & figma
  { title: 'گیت و گیت‌هاب', prereqs: ['تبدیل طراحی به کد (Figma to Code)'], levelY: 1620, colX: 515 },
  { title: 'مبانی جاوااسکریپت', prereqs: ['تبدیل طراحی به کد (Figma to Code)'], levelY: 1620, colX: 885 },
  { title: 'دسترسی‌پذیری وب (Accessibility - WCAG)', prereqs: ['تبدیل طراحی به کد (Figma to Code)'], levelY: 1620, colX: 1255 },

  { title: 'تعامل با DOM و Event ها', prereqs: ['مبانی جاوااسکریپت'], levelY: 1880, colX: 885 },
  { title: 'جاوااسکریپت پیشرفته (ES6+)', prereqs: ['تعامل با DOM و Event ها'], levelY: 2140, colX: 885 },

  // New: Security
  { title: 'امنیت پایه وب (XSS, CORS, CSP)', prereqs: ['جاوااسکریپت پیشرفته (ES6+)'], levelY: 2400, colX: 885, description: 'آشنایی با خطرات XSS در فرانت‌اند، تنظیمات CORS برای ارتباط با بک‌اند و پیاده‌سازی هدرهای امنیتی CSP' },

  { title: 'مدیریت پکیج‌ها (npm/yarn) و Bundler ها', prereqs: ['امنیت پایه وب (XSS, CORS, CSP)'], levelY: 2660, colX: 885 },
  
  { title: 'مبانی React', prereqs: ['مدیریت پکیج‌ها (npm/yarn) و Bundler ها'], levelY: 2920, colX: 885 },
  
  // Moved: TypeScript right after React Basics
  { title: 'مبانی TypeScript', prereqs: ['مبانی React'], levelY: 3180, colX: 700 },
  { title: 'مدیریت State در React', prereqs: ['مبانی React'], levelY: 3180, colX: 1070 },

  { title: 'استایل‌دهی با Tailwind CSS', prereqs: ['مبانی React'], levelY: 3440, colX: 515 },
  { title: 'فرم‌ها در React (React Hook Form)', prereqs: ['مدیریت State در React', 'مبانی TypeScript'], levelY: 3440, colX: 885 },
  // Marked as Good-to-know
  { title: 'استیت ماشین‌ها با XState', prereqs: ['مدیریت State در React'], levelY: 3440, colX: 1255, description: 'مدیریت وضعیت‌های پیچیده و حالت‌های متناهی با ماشین حالت و اکتورها در React (اختیاری و تخصصی)' },

  { title: 'انیمیشن‌های اینتراکتیو با Framer Motion', prereqs: ['استایل‌دهی با Tailwind CSS'], levelY: 3700, colX: 330 },
  { title: 'استوری‌بوک و توسعه کامپوننت‌محور (Storybook)', prereqs: ['استایل‌دهی با Tailwind CSS'], levelY: 3700, colX: 700 },
  { title: 'مدیریت فرم‌های پیچیده و اعتبارسنجی با Zod', prereqs: ['فرم‌ها در React (React Hook Form)', 'مبانی TypeScript'], levelY: 3700, colX: 1070 },
  { title: 'ارتباط با API (TanStack Query)', prereqs: ['فرم‌ها در React (React Hook Form)'], levelY: 3700, colX: 1440 },

  { title: 'مبانی Next.js (App Router)', prereqs: ['ارتباط با API (TanStack Query)', 'مدیریت فرم‌های پیچیده و اعتبارسنجی با Zod'], levelY: 3960, colX: 885 },

  // New: Deploy & Hosting
  { title: 'دیپلوی و هاستینگ (Vercel/Netlify)', prereqs: ['مبانی Next.js (App Router)'], levelY: 4220, colX: 700, description: 'دیپلوی مداوم برنامه‌های Next.js روی Vercel، تنظیم دامنه‌های اختصاصی و مدیریت متغیرهای محیطی' },
  { title: 'ارتباط زنده با WebSockets در فرانت‌اند', prereqs: ['مبانی Next.js (App Router)'], levelY: 4220, colX: 1070 },

  { title: 'تست‌نویسی فرانت‌اند', prereqs: ['دیپلوی و هاستینگ (Vercel/Netlify)'], levelY: 4480, colX: 330 },
  { title: 'پرفورمنس و Web Vitals', prereqs: ['دیپلوی و هاستینگ (Vercel/Netlify)'], levelY: 4480, colX: 700 },
  { title: 'کامپوننت‌های سمت سرور (React Server Components)', prereqs: ['مبانی Next.js (App Router)'], levelY: 4480, colX: 1070 },
  { title: 'سئو تکنیکال برای Next.js (Metadata API & Sitemap)', prereqs: ['مبانی Next.js (App Router)'], levelY: 4480, colX: 1440 },

  { title: 'پایپ‌لاین CI/CD و تست‌های اتوماتیک گیت‌هاب اکشنز', prereqs: ['تست‌نویسی فرانت‌اند'], levelY: 4740, colX: 700 },
  { title: 'معماری پیشرفته (Micro-frontends / Monorepo)', prereqs: ['پرفورمنس و Web Vitals'], levelY: 4740, colX: 1070 }
];

async function applyRefactor(dbName: string, prisma: PrismaClient) {
  console.log(`\n================ REFACTORING ${dbName} ================`);
  const roadmap = await prisma.roadmap.findUnique({
    where: { slug: 'frontend-dev' },
    include: { nodes: true }
  });

  if (!roadmap) {
    console.error(`Roadmap frontend-dev not found in ${dbName}`);
    return;
  }

  // 1. Delete Docker node from frontend-dev
  const dockerNode = roadmap.nodes.find(n => n.title.includes('Docker') || n.title.includes('کانتینرسازی'));
  if (dockerNode) {
    console.log(`1. Deleting Docker node: "${dockerNode.title}" (${dockerNode.id})`);
    // Foreign keys cascade or manual delete
    await prisma.nodePrerequisite.deleteMany({
      where: { OR: [{ nodeId: dockerNode.id }, { prerequisiteNodeId: dockerNode.id }] }
    });
    await prisma.resource.deleteMany({ where: { nodeId: dockerNode.id } });
    await prisma.nodeProgress.deleteMany({ where: { nodeId: dockerNode.id } });
    await prisma.node.delete({ where: { id: dockerNode.id } });
    console.log(`   Docker node deleted.`);
  }

  // 2. Ensure the 3 new nodes exist (or update if already created)
  const nodeMap = new Map<string, string>(); // title -> id
  const currentNodes = await prisma.node.findMany({ where: { roadmapId: roadmap.id } });
  for (const n of currentNodes) {
    nodeMap.set(n.title.trim(), n.id);
  }

  console.log('2. Upserting nodes with new layout coordinates...');
  for (const item of NODE_FLOW) {
    let nid = nodeMap.get(item.title);
    if (!nid) {
      const created = await prisma.node.create({
        data: {
          roadmapId: roadmap.id,
          title: item.title,
          description: item.description || `آموزش و مأموریت عملی ${item.title}`,
          positionX: item.colX,
          positionY: item.levelY,
          hasDeliverable: true
        }
      });
      nid = created.id;
      nodeMap.set(item.title, nid);
      console.log(`   + Created new node: "${item.title}"`);

      // Add resources for new node
      const resList = (NEW_RESOURCES as any)[item.title];
      if (resList) {
        for (const res of resList) {
          await prisma.resource.create({
            data: {
              nodeId: nid,
              title: res.title,
              type: res.type,
              content: res.content
            }
          });
        }
        console.log(`     Added ${resList.length} resources to "${item.title}"`);
      }
    } else {
      // Update coordinates
      await prisma.node.update({
        where: { id: nid },
        data: {
          positionX: item.colX,
          positionY: item.levelY,
          ...(item.description ? { description: item.description } : {})
        }
      });
    }
  }

  // 3. Clear existing prerequisites for frontend-dev to rebuild clean DAG
  console.log('3. Rebuilding DAG prerequisites for frontend-dev...');
  const allFrontendNodeIds = Array.from(nodeMap.values());
  await prisma.nodePrerequisite.deleteMany({
    where: { nodeId: { in: allFrontendNodeIds } }
  });

  for (const item of NODE_FLOW) {
    const currentNodeId = nodeMap.get(item.title)!;
    for (const prereqTitle of item.prereqs) {
      const prereqNodeId = nodeMap.get(prereqTitle);
      if (prereqNodeId) {
        await prisma.nodePrerequisite.create({
          data: {
            nodeId: currentNodeId,
            prerequisiteNodeId: prereqNodeId
          }
        });
      } else {
        console.warn(`   ! Prereq not found: "${prereqTitle}" for "${item.title}"`);
      }
    }
  }

  // 4. Enroll active users to any new nodes (create NodeProgress if needed)
  console.log('4. Syncing user node progresses for new nodes...');
  const userRoadmaps = await prisma.userRoadmap.findMany({ where: { roadmapId: roadmap.id } });
  for (const ur of userRoadmaps) {
    for (const item of NODE_FLOW) {
      const nid = nodeMap.get(item.title)!;
      const prog = await prisma.nodeProgress.findUnique({
        where: { userId_nodeId: { userId: ur.studentId, nodeId: nid } }
      });
      if (!prog) {
        // If has no prereqs, unlock it, else lock it
        const isStart = item.prereqs.length === 0;
        await prisma.nodeProgress.create({
          data: {
            userId: ur.studentId,
            nodeId: nid,
            status: isStart ? 'UNLOCKED' : 'LOCKED'
          }
        });
      }
    }
  }

  // Verification count
  const updatedNodes = await prisma.node.findMany({
    where: { roadmapId: roadmap.id },
    include: {
      prerequisites: true,
      resources: { where: { type: 'VIDEO_URL' } }
    }
  });

  console.log(`\n✔ Result for ${dbName}:`);
  console.log(`   Total Nodes: ${updatedNodes.length} (Expected: 32)`);
  const vids = updatedNodes.filter(n => n.resources.length > 0).length;
  console.log(`   Nodes with VIDEO_URL: ${vids}/${updatedNodes.length}`);
}

async function main() {
  for (const db of dbs) {
    await applyRefactor(db.name, db.client);
  }
}

main()
  .catch(e => {
    console.error('Migration error:', e);
    process.exit(1);
  })
  .finally(async () => {
    for (const db of dbs) {
      await db.client.$disconnect();
    }
  });
