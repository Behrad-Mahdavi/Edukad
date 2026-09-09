/**
 * Graph Layout Utility for Edukad Roadmaps
 * Automatically arranges skill tree DAG nodes into clean, non-overlapping hierarchical tiers (Top-to-Bottom).
 */

export interface LayoutNode {
  id: string;
  prerequisites?: { prerequisiteNodeId: string }[];
  positionX?: number;
  positionY?: number;
  [key: string]: any;
}

export interface LayoutEdge {
  source: string; // prerequisiteNodeId
  target: string; // nodeId
}

export interface LayoutOptions {
  nodeWidth?: number;
  nodeHeight?: number;
  horizontalGap?: number;
  verticalGap?: number;
  centerX?: number;
  startY?: number;
}

const DEFAULT_OPTIONS: Required<LayoutOptions> = {
  nodeWidth: 290,
  nodeHeight: 150,
  horizontalGap: 70,
  verticalGap: 130,
  centerX: 600,
  startY: 80,
};

/**
 * Computes neat hierarchical coordinates for a graph of nodes using a Sugiyama-style barycenter heuristic.
 * Roots (0 prerequisites) sit at Level 0 (top), dependent nodes flow downwards neatly without crossing.
 */
export function computeHierarchicalLayout<T extends LayoutNode>(
  nodes: T[],
  edges?: LayoutEdge[],
  customOptions?: LayoutOptions,
): (T & { positionX: number; positionY: number })[] {
  if (!nodes || nodes.length === 0) return [];

  const opts = { ...DEFAULT_OPTIONS, ...customOptions };

  // 1. Build adjacency map: incoming prerequisites for each node
  const incomingMap = new Map<string, Set<string>>();
  const outgoingMap = new Map<string, Set<string>>();

  nodes.forEach((n) => {
    incomingMap.set(n.id, new Set());
    outgoingMap.set(n.id, new Set());
  });

  // Populate from node.prerequisites or edges
  if (edges && edges.length > 0) {
    edges.forEach((e) => {
      if (incomingMap.has(e.target) && incomingMap.has(e.source)) {
        incomingMap.get(e.target)!.add(e.source);
        outgoingMap.get(e.source)!.add(e.target);
      }
    });
  } else {
    nodes.forEach((n) => {
      if (Array.isArray(n.prerequisites)) {
        n.prerequisites.forEach((p) => {
          if (incomingMap.has(n.id) && incomingMap.has(p.prerequisiteNodeId)) {
            incomingMap.get(n.id)!.add(p.prerequisiteNodeId);
            outgoingMap.get(p.prerequisiteNodeId)?.add(n.id);
          }
        });
      }
    });
  }

  // 2. Compute depth for each node (longest path from root)
  const nodeLevels = new Map<string, number>();

  function getNodeLevel(nodeId: string, visited = new Set<string>()): number {
    if (nodeLevels.has(nodeId)) {
      return nodeLevels.get(nodeId)!;
    }

    if (visited.has(nodeId)) {
      return 0; // Break cycle
    }

    visited.add(nodeId);
    const prereqs = incomingMap.get(nodeId) || new Set();

    if (prereqs.size === 0) {
      nodeLevels.set(nodeId, 0);
      return 0;
    }

    let maxPrereqLevel = 0;
    prereqs.forEach((pId) => {
      const pLevel = getNodeLevel(pId, new Set(visited));
      if (pLevel >= maxPrereqLevel) {
        maxPrereqLevel = pLevel + 1;
      }
    });

    nodeLevels.set(nodeId, maxPrereqLevel);
    return maxPrereqLevel;
  }

  // Calculate for all nodes
  nodes.forEach((n) => getNodeLevel(n.id));

  // 3. Group nodes by level
  const levelsMap = new Map<number, T[]>();
  nodes.forEach((n) => {
    const lvl = nodeLevels.get(n.id) || 0;
    if (!levelsMap.has(lvl)) {
      levelsMap.set(lvl, []);
    }
    levelsMap.get(lvl)!.push(n);
  });

  const sortedLevelKeys = Array.from(levelsMap.keys()).sort((a, b) => a - b);
  const resultMap = new Map<string, { x: number; y: number }>();

  function assignLevelPositions(lvl: number, levelNodes: T[]) {
    const count = levelNodes.length;
    const totalWidth = count * opts.nodeWidth + (count - 1) * opts.horizontalGap;
    const startX = opts.centerX - totalWidth / 2;
    const y = Math.round(opts.startY + lvl * (opts.nodeHeight + opts.verticalGap));

    levelNodes.forEach((node, idx) => {
      const x = Math.round(startX + idx * (opts.nodeWidth + opts.horizontalGap));
      resultMap.set(node.id, { x, y });
    });
  }

  // Initial Level 0 placement
  if (levelsMap.has(0)) {
    assignLevelPositions(0, levelsMap.get(0)!);
  }

  // 4. Downward Barycenter Sweep: Sort level nodes according to average X of their incoming parents
  for (let i = 1; i < sortedLevelKeys.length; i++) {
    const lvl = sortedLevelKeys[i];
    const levelNodes = levelsMap.get(lvl)!;

    levelNodes.sort((a, b) => {
      const parentsA = Array.from(incomingMap.get(a.id) || []);
      const parentsB = Array.from(incomingMap.get(b.id) || []);

      const getAvgX = (parents: string[]) => {
        const xs = parents
          .map((pId) => resultMap.get(pId)?.x)
          .filter((x): x is number => x !== undefined);
        return xs.length > 0 ? xs.reduce((acc, v) => acc + v, 0) / xs.length : opts.centerX;
      };

      return getAvgX(parentsA) - getAvgX(parentsB);
    });

    assignLevelPositions(lvl, levelNodes);
  }

  // 5. Upward Barycenter Sweep: Re-align parent nodes above their children
  for (let i = sortedLevelKeys.length - 2; i >= 0; i--) {
    const lvl = sortedLevelKeys[i];
    const levelNodes = levelsMap.get(lvl)!;

    levelNodes.sort((a, b) => {
      const childrenA = Array.from(outgoingMap.get(a.id) || []);
      const childrenB = Array.from(outgoingMap.get(b.id) || []);

      const getAvgX = (children: string[]) => {
        const xs = children
          .map((cId) => resultMap.get(cId)?.x)
          .filter((x): x is number => x !== undefined);
        return xs.length > 0
          ? xs.reduce((acc, v) => acc + v, 0) / xs.length
          : resultMap.get(a.id)?.x || opts.centerX;
      };

      return getAvgX(childrenA) - getAvgX(childrenB);
    });

    assignLevelPositions(lvl, levelNodes);
  }

  // 6. Return updated nodes
  return nodes.map((n) => {
    const pos = resultMap.get(n.id) || { x: 100, y: 100 };
    return {
      ...n,
      positionX: pos.x,
      positionY: pos.y,
    };
  });
}
