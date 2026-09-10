import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface NodeWithPrereqs {
  id: string;
  title: string;
  roadmapId: string;
  prerequisites: { prerequisiteNodeId: string }[];
  reversePrereqs?: { nodeId: string }[];
  positionX: number;
  positionY: number;
}

const CONFIG = {
  nodeWidth: 290,
  nodeHeight: 150,
  horizontalGap: 70,
  verticalGap: 130,
  centerX: 600,
  startY: 80,
};

function layoutRoadmapNodes(nodes: NodeWithPrereqs[]) {
  if (nodes.length === 0) return [];

  const nodeMap = new Map<string, NodeWithPrereqs>();
  const incomingMap = new Map<string, string[]>(); // target -> [prereqIds]
  const outgoingMap = new Map<string, string[]>(); // source -> [dependentIds]

  nodes.forEach((n) => {
    nodeMap.set(n.id, n);
    incomingMap.set(n.id, []);
    outgoingMap.set(n.id, []);
  });

  nodes.forEach((n) => {
    n.prerequisites.forEach((p) => {
      if (nodeMap.has(p.prerequisiteNodeId)) {
        incomingMap.get(n.id)!.push(p.prerequisiteNodeId);
        outgoingMap.get(p.prerequisiteNodeId)!.push(n.id);
      }
    });
  });

  // 1. Compute Level (Longest path from roots)
  const nodeLevels = new Map<string, number>();

  function getLevel(nodeId: string, visited = new Set<string>()): number {
    if (nodeLevels.has(nodeId)) return nodeLevels.get(nodeId)!;
    if (visited.has(nodeId)) return 0; // Prevent cycle loops

    visited.add(nodeId);
    const parents = incomingMap.get(nodeId) || [];
    if (parents.length === 0) {
      nodeLevels.set(nodeId, 0);
      return 0;
    }

    let maxParentLevel = 0;
    for (const pId of parents) {
      const pLvl = getLevel(pId, new Set(visited));
      if (pLvl >= maxParentLevel) {
        maxParentLevel = pLvl + 1;
      }
    }

    nodeLevels.set(nodeId, maxParentLevel);
    return maxParentLevel;
  }

  nodes.forEach((n) => getLevel(n.id));

  // 2. Group nodes by level
  const levelsMap = new Map<number, string[]>();
  nodes.forEach((n) => {
    const lvl = nodeLevels.get(n.id) || 0;
    if (!levelsMap.has(lvl)) levelsMap.set(lvl, []);
    levelsMap.get(lvl)!.push(n.id);
  });

  const sortedLevels = Array.from(levelsMap.keys()).sort((a, b) => a - b);

  // Position storage: id -> { x, y }
  const positions = new Map<string, { x: number; y: number }>();

  // Helper to center a level
  function assignLevelX(levelIndex: number, nodeIds: string[]) {
    const count = nodeIds.length;
    const totalWidth = count * CONFIG.nodeWidth + (count - 1) * CONFIG.horizontalGap;
    const startX = CONFIG.centerX - totalWidth / 2;
    const y = CONFIG.startY + levelIndex * (CONFIG.nodeHeight + CONFIG.verticalGap);

    nodeIds.forEach((id, idx) => {
      const x = Math.round(startX + idx * (CONFIG.nodeWidth + CONFIG.horizontalGap));
      positions.set(id, { x, y });
    });
  }

  // 3. Initial placement for Level 0
  if (levelsMap.has(0)) {
    assignLevelX(0, levelsMap.get(0)!);
  }

  // 4. Downward sweep: Sort subsequent levels by barycenter of parents
  for (let l = 1; l < sortedLevels.length; l++) {
    const lvl = sortedLevels[l];
    const nodeIds = levelsMap.get(lvl)!;

    // Calculate barycenter for each node
    const barycenters = nodeIds.map((id) => {
      const parents = incomingMap.get(id) || [];
      const parentXs = parents
        .map((pId) => positions.get(pId)?.x)
        .filter((x): x is number => x !== undefined);

      const avgX =
        parentXs.length > 0
          ? parentXs.reduce((sum, x) => sum + x, 0) / parentXs.length
          : CONFIG.centerX;

      return { id, avgX };
    });

    // Sort by barycenter
    barycenters.sort((a, b) => a.avgX - b.avgX);
    const sortedIds = barycenters.map((b) => b.id);
    levelsMap.set(lvl, sortedIds);

    assignLevelX(lvl, sortedIds);
  }

  // 5. Upward sweep: Adjust earlier levels if parents have children concentrated in a specific area
  for (let l = sortedLevels.length - 2; l >= 0; l--) {
    const lvl = sortedLevels[l];
    const nodeIds = levelsMap.get(lvl)!;

    const barycenters = nodeIds.map((id) => {
      const children = outgoingMap.get(id) || [];
      const childXs = children
        .map((cId) => positions.get(cId)?.x)
        .filter((x): x is number => x !== undefined);

      const avgX =
        childXs.length > 0
          ? childXs.reduce((sum, x) => sum + x, 0) / childXs.length
          : positions.get(id)?.x || CONFIG.centerX;

      return { id, avgX };
    });

    barycenters.sort((a, b) => a.avgX - b.avgX);
    const sortedIds = barycenters.map((b) => b.id);
    levelsMap.set(lvl, sortedIds);
    assignLevelX(lvl, sortedIds);
  }

  // Final Downward Sweep to guarantee consistency
  for (let l = 1; l < sortedLevels.length; l++) {
    const lvl = sortedLevels[l];
    const nodeIds = levelsMap.get(lvl)!;

    const barycenters = nodeIds.map((id) => {
      const parents = incomingMap.get(id) || [];
      const parentXs = parents
        .map((pId) => positions.get(pId)?.x)
        .filter((x): x is number => x !== undefined);

      const avgX =
        parentXs.length > 0
          ? parentXs.reduce((sum, x) => sum + x, 0) / parentXs.length
          : CONFIG.centerX;

      return { id, avgX };
    });

    barycenters.sort((a, b) => a.avgX - b.avgX);
    const sortedIds = barycenters.map((b) => b.id);
    assignLevelX(lvl, sortedIds);
  }

  return nodes.map((n) => {
    const pos = positions.get(n.id) || { x: 300, y: 100 };
    return {
      id: n.id,
      title: n.title,
      positionX: pos.x,
      positionY: pos.y,
    };
  });
}

async function main() {
  console.log(' Starting auto-layout optimization for all roadmaps...');

  const roadmaps = await prisma.roadmap.findMany({
    include: {
      nodes: {
        include: {
          prerequisites: true,
        },
      },
    },
  });

  for (const rm of roadmaps) {
    console.log(`\n Laying out roadmap: "${rm.title}" (${rm.slug}) with ${rm.nodes.length} nodes...`);

    const laidOutNodes = layoutRoadmapNodes(rm.nodes as any);

    // Update nodes in DB
    for (const item of laidOutNodes) {
      await prisma.node.update({
        where: { id: item.id },
        data: {
          positionX: item.positionX,
          positionY: item.positionY,
        },
      });
    }

    console.log(` Finished "${rm.title}". Sample node positions:`);
    laidOutNodes.slice(0, 4).forEach((n) => {
      console.log(`   - [${n.title}]: (X: ${n.positionX}, Y: ${n.positionY})`);
    });
  }

  console.log('\n All roadmaps auto-layout completed and persisted to database!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
