const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const r = await p.roadmap.findUnique({
    where: { slug: 'backend-dev' },
    include: {
      nodes: {
        orderBy: { positionY: 'asc' },
        include: { resources: true }
      }
    }
  });

  console.log(`Backend Roadmap: ${r.title} (${r.nodes.length} nodes)`);
  r.nodes.forEach((n, i) => {
    console.log(`${i+1}. [${n.hasDeliverable ? 'DELIVERABLE' : 'CONCEPT_ONLY'}] ${n.title}`);
  });
}
main().finally(() => p.$disconnect());
