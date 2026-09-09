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
  nodeWidth: 280,
  nodeHeight: 140,
  horizontalGap: 60,
  verticalGap: 120,
  centerX: 450,
  startY: 50,
};

/**
 * Computes neat hierarchical coordinates for a graph of nodes.
 * Roots (0 prerequisites) sit at Level 0 (top), dependent nodes flow downwards.
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

  // Function to get level with cycle protection
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

  // Sort levels ascending
  const sortedLevelKeys = Array.from(levelsMap.keys()).sort((a, b) => a - b);

  // 4. Calculate X, Y positions
  const resultMap = new Map<string, { x: number; y: number }>();

  sortedLevelKeys.forEach((lvl) => {
    const nodesInLevel = levelsMap.get(lvl)!;
    const count = nodesInLevel.length;

    const totalWidth = count * opts.nodeWidth + (count - 1) * opts.horizontalGap;
    const startX = opts.centerX - totalWidth / 2;

    nodesInLevel.forEach((node, idx) => {
      const x = Math.round(startX + idx * (opts.nodeWidth + opts.horizontalGap));
      const y = Math.round(opts.startY + lvl * (opts.nodeHeight + opts.verticalGap));
      resultMap.set(node.id, { x, y });
    });
  });

  // 5. Return updated nodes
  return nodes.map((n) => {
    const pos = resultMap.get(n.id) || { x: 100, y: 100 };
    return {
      ...n,
      positionX: pos.x,
      positionY: pos.y,
    };
  });
}
