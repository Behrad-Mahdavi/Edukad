import { PrismaClient, Department, ResourceType, RoadmapStatus } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface RoadmapJson {
  id: string;
  title: string;
  department: Department;
  description: string;
  nodes: NodeJson[];
}

interface NodeJson {
  id: string;
  title: string;
  level: 'ضروری' | 'خوب-است-بدانی';
  tier: 'مبتدی' | 'حرفه‌ای' | 'مربی';
  description: string;
  shared_with?: string[];
  resources: { title: string; url?: string; type: ResourceType }[];
  task: string;
  prerequisites: string[];
}

async function main() {
  const roadmapsDir = path.join(__dirname, 'data', 'roadmaps');
  if (!fs.existsSync(roadmapsDir)) {
    console.error(`Directory not found: ${roadmapsDir}`);
    return;
  }

  const files = fs.readdirSync(roadmapsDir).filter(f => f.endsWith('.json'));

  for (const file of files) {
    const filePath = path.join(roadmapsDir, file);
    const data: RoadmapJson = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    console.log(`Importing roadmap: ${data.title}...`);

    // Check if roadmap exists
    const existingRoadmap = await prisma.roadmap.findUnique({
      where: { slug: data.id },
      include: { _count: { select: { nodes: true } } },
    });
    
    if (existingRoadmap && existingRoadmap._count.nodes >= 30) {
      console.log(`Roadmap ${data.title} (${data.id}) already exists with ${existingRoadmap._count.nodes} nodes. Skipping...`);
      continue;
    }

    if (existingRoadmap) {
      await prisma.roadmap.delete({ where: { slug: data.id } });
    }

    const roadmap = await prisma.roadmap.create({
      data: {
        title: data.title,
        slug: data.id,
        description: data.description,
        department: data.department,
        status: RoadmapStatus.PUBLISHED,
        version: 1,
      },
    });

    const nodeIdMap = new Map<string, string>(); // Maps JSON id to DB id

    // Create Nodes
    for (let i = 0; i < data.nodes.length; i++) {
      const nodeData = data.nodes[i];
      const desc = `**سطح:** ${nodeData.tier} | **اهمیت:** ${nodeData.level}\n\n${nodeData.description}`;
      
      const resourcesToCreate = nodeData.resources.map(r => ({
        title: r.title,
        type: r.type,
        content: r.url || 'لینک در دسترس نیست',
      }));

      // Add Task as a resource
      resourcesToCreate.push({
        title: 'شرح مأموریت',
        type: ResourceType.MARKDOWN_TEXT,
        content: nodeData.task,
      });

      const dbNode = await prisma.node.create({
        data: {
          roadmapId: roadmap.id,
          title: nodeData.title,
          description: desc,
          positionX: 0,
          positionY: 0,
          hasDeliverable: true,
          resources: {
            create: resourcesToCreate,
          },
        },
      });

      nodeIdMap.set(nodeData.id, dbNode.id);
    }

    // Create Prerequisites
    for (const nodeData of data.nodes) {
      const targetDbNodeId = nodeIdMap.get(nodeData.id);
      if (!targetDbNodeId) continue;

      for (const prereqId of nodeData.prerequisites) {
        const sourceDbNodeId = nodeIdMap.get(prereqId);
        if (sourceDbNodeId) {
          await prisma.nodePrerequisite.create({
            data: {
              nodeId: targetDbNodeId,
              prerequisiteNodeId: sourceDbNodeId,
            },
          });
        }
      }
    }

    // Apply auto-layout hierarchically
    const dbNodesWithPrereqs = await prisma.node.findMany({
      where: { roadmapId: roadmap.id },
      include: { prerequisites: true },
    });

    const incomingMap = new Map<string, string[]>();
    const outgoingMap = new Map<string, string[]>();
    const nodeLevels = new Map<string, number>();

    dbNodesWithPrereqs.forEach((n) => {
      incomingMap.set(n.id, n.prerequisites.map((p) => p.prerequisiteNodeId));
      outgoingMap.set(n.id, []);
    });

    dbNodesWithPrereqs.forEach((n) => {
      n.prerequisites.forEach((p) => {
        outgoingMap.get(p.prerequisiteNodeId)?.push(n.id);
      });
    });

    function getLevel(nodeId: string, visited = new Set<string>()): number {
      if (nodeLevels.has(nodeId)) return nodeLevels.get(nodeId)!;
      if (visited.has(nodeId)) return 0;
      visited.add(nodeId);
      const parents = incomingMap.get(nodeId) || [];
      if (parents.length === 0) {
        nodeLevels.set(nodeId, 0);
        return 0;
      }
      let maxLvl = 0;
      for (const p of parents) {
        const lvl = getLevel(p, new Set(visited));
        if (lvl >= maxLvl) maxLvl = lvl + 1;
      }
      nodeLevels.set(nodeId, maxLvl);
      return maxLvl;
    }

    dbNodesWithPrereqs.forEach((n) => getLevel(n.id));

    const levelsMap = new Map<number, string[]>();
    dbNodesWithPrereqs.forEach((n) => {
      const lvl = nodeLevels.get(n.id) || 0;
      if (!levelsMap.has(lvl)) levelsMap.set(lvl, []);
      levelsMap.get(lvl)!.push(n.id);
    });

    const sortedLevels = Array.from(levelsMap.keys()).sort((a, b) => a - b);
    const positions = new Map<string, { x: number; y: number }>();
    const nodeWidth = 290;
    const nodeHeight = 150;
    const horizontalGap = 70;
    const verticalGap = 130;
    const centerX = 600;
    const startY = 80;

    function assignLvl(l: number, ids: string[]) {
      const count = ids.length;
      const totalWidth = count * nodeWidth + (count - 1) * horizontalGap;
      const startX = centerX - totalWidth / 2;
      const y = startY + l * (nodeHeight + verticalGap);
      ids.forEach((id, idx) => {
        positions.set(id, {
          x: Math.round(startX + idx * (nodeWidth + horizontalGap)),
          y,
        });
      });
    }

    sortedLevels.forEach((l) => assignLvl(l, levelsMap.get(l)!));

    // Update DB
    for (const n of dbNodesWithPrereqs) {
      const pos = positions.get(n.id);
      if (pos) {
        await prisma.node.update({
          where: { id: n.id },
          data: { positionX: pos.x, positionY: pos.y },
        });
      }
    }

    console.log(` Roadmap ${data.title} imported and auto-laid-out successfully with ${data.nodes.length} nodes.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
