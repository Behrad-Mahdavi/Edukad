import { Test, TestingModule } from '@nestjs/testing';
import { RoadmapsService } from './roadmaps.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('RoadmapsService - DFS Cycle Detection', () => {
  let service: RoadmapsService;
  let mockPrisma: any;

  beforeEach(async () => {
    // In-memory adjacency list representing prerequisites:
    // map: nodeId -> array of prerequisiteNodeIds
    const prereqGraph = new Map<string, string[]>();

    mockPrisma = {
      nodePrerequisite: {
        findMany: jest.fn().mockImplementation(({ where }: { where: { nodeId: string } }) => {
          const prereqs = prereqGraph.get(where.nodeId) || [];
          return Promise.resolve(prereqs.map((pId) => ({ prerequisiteNodeId: pId })));
        }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoadmapsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<RoadmapsService>(RoadmapsService);

    // Setup a chain: Node C depends on B, Node B depends on A
    // (A is root, B requires A, C requires B)
    // C -> [B]
    // B -> [A]
    // A -> []
    prereqGraph.set('C', ['B']);
    prereqGraph.set('B', ['A']);
    prereqGraph.set('A', []);
  });

  it('should detect self-loop cycle (Node A depends on Node A)', async () => {
    const isCycle = await service.checkCycle('A', 'A');
    expect(isCycle).toBe(true);
  });

  it('should detect direct 2-node cycle (A depends on B when B already depends on A)', async () => {
    // B depends on A already. If we try to make A depend on B:
    const isCycle = await service.checkCycle('A', 'B');
    expect(isCycle).toBe(true);
  });

  it('should detect transitive 3-node cycle (A depends on C when C depends on B and B depends on A)', async () => {
    // C -> B -> A. If we try to make A depend on C:
    const isCycle = await service.checkCycle('A', 'C');
    expect(isCycle).toBe(true);
  });

  it('should allow valid non-cyclical prerequisite (C depends on D when D has no connection to C)', async () => {
    // D is an independent node
    const isCycle = await service.checkCycle('C', 'D');
    expect(isCycle).toBe(false);
  });
});
