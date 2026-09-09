'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  BackgroundVariant,
} from '@xyflow/react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { SkillNode } from '@/components/flow/SkillNode';
import { NodeDetailDrawer } from '@/components/drawer/NodeDetailDrawer';
import {
  ArrowRight,
  Sparkles,
  Award,
  Layers,
  Info,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';

const nodeTypes = {
  skillNode: SkillNode,
};

export default function RoadmapDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const { user, loading } = useAuth();

  const [roadmap, setRoadmap] = useState<any | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const fetchRoadmapData = useCallback(async () => {
    if (!slug) return;
    try {
      const data = await api.roadmaps.getBySlug(slug);
      setRoadmap(data);

      // Build React Flow Nodes
      const flowNodes = data.nodes.map((node: any) => {
        const progress = node.progresses?.[0];
        return {
          id: node.id,
          type: 'skillNode',
          position: { x: node.positionX, y: node.positionY },
          data: {
            id: node.id,
            title: node.title,
            description: node.description,
            hasDeliverable: node.hasDeliverable,
            status: progress ? progress.status : 'LOCKED',
            resourceCount: node.resources?.length || 0,
          },
        };
      });

      // Build React Flow Edges from prerequisites
      const flowEdges: any[] = [];
      data.nodes.forEach((node: any) => {
        node.prerequisites?.forEach((prereq: any) => {
          flowEdges.push({
            id: `edge-${prereq.prerequisiteNodeId}-${node.id}`,
            source: prereq.prerequisiteNodeId,
            target: node.id,
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#58bdaf', strokeWidth: 3 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#58bdaf',
              width: 18,
              height: 18,
            },
          });
        });
      });

      setNodes(flowNodes);
      setEdges(flowEdges);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  }, [slug, setNodes, setEdges]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
    if (user && slug) {
      fetchRoadmapData();
    }
  }, [user, loading, slug, router, fetchRoadmapData]);

  const onNodeClick = useCallback(
    (_: any, flowNode: any) => {
      setSelectedNodeId(flowNode.id);
    },
    [],
  );

  const selectedNode = useMemo(() => {
    if (!selectedNodeId || !roadmap) return null;
    return roadmap.nodes.find((n: any) => n.id === selectedNodeId) || null;
  }, [roadmap, selectedNodeId]);

  const selectedProgress = useMemo(() => {
    return selectedNode?.progresses?.[0] || null;
  }, [selectedNode]);

  const stats = useMemo(() => {
    if (!roadmap) return { total: 0, completed: 0, percent: 0 };
    const total = roadmap.nodes.length;
    const completed = roadmap.nodes.filter(
      (n: any) => n.progresses?.[0]?.status === 'COMPLETED',
    ).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percent };
  }, [roadmap]);

  if (loading || fetching) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center font-bold text-slate-500 animate-pulse">
          در حال بارگذاری درخت مهارت...
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold text-primary mb-2">مسیر یافت نشد</h2>
        <Link href="/" className="text-xs text-secondary font-bold hover:underline">
          بازگشت به خانه
        </Link>
      </div>
    );
  }

  const enrollment = roadmap.enrollments?.[0];

  return (
    <div className="h-[84vh] flex flex-col gap-3 text-right">
      {/* Top Banner / Roadmap Header */}
      <div className="bg-white border-2 border-primary rounded-2xl p-4 shadow-[4px_5px_0_0_#21295a] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-2 rounded-xl border-2 border-primary bg-bg-mint text-primary hover:bg-secondary hover:text-white transition-colors"
            title="بازگشت"
          >
            <ArrowRight className="w-5 h-5" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-xl text-primary">{roadmap.title}</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-secondary/20 text-secondary-dark">
                نسخه {roadmap.version}
              </span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
              {roadmap.description}
            </p>
          </div>
        </div>

        {/* Progress summary pill */}
        <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-bold">
              وضعیت تسلط:
            </span>
            <span className="text-xs font-black text-secondary-dark">
              {stats.percent}٪ ({stats.completed} از {stats.total} گره)
            </span>
          </div>

          <div className="w-24 h-2.5 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-secondary transition-all"
              style={{ width: `${stats.percent}%` }}
            />
          </div>

          {enrollment?.mentor && (
            <div className="pr-3 border-r border-slate-200 text-xs font-bold text-primary">
              <span className="text-[10px] text-slate-400 block font-medium">
                منتور ناظر:
              </span>
              {enrollment.mentor.fullName}
            </div>
          )}
        </div>
      </div>

      {/* React Flow Skill Tree Canvas */}
      <div className="flex-1 relative bg-slate-50 border-2 border-primary rounded-2xl shadow-[5px_6px_0_0_#21295a] overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1.5} color="#cbd5e1" />
          <Controls className="!bg-white !border-2 !border-primary !rounded-xl !shadow-[2px_3px_0_0_#21295a]" />
          <MiniMap
            className="!bg-white !border-2 !border-primary !rounded-xl !shadow-[2px_3px_0_0_#21295a]"
            nodeColor={(node: any) => {
              switch (node.data?.status) {
                case 'COMPLETED':
                  return '#059669';
                case 'SUBMITTED':
                  return '#ea580c';
                case 'NEEDS_REVISION':
                  return '#e11d48';
                case 'IN_PROGRESS':
                  return '#0d9488';
                case 'UNLOCKED':
                  return '#0284c7';
                default:
                  return '#94a3b8';
              }
            }}
          />
        </ReactFlow>

        {/* Legend Overlay Bar */}
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm border-2 border-primary rounded-xl px-3 py-2 shadow-[2px_3px_0_0_#21295a] text-[10px] font-bold flex flex-wrap items-center gap-3 text-slate-600">
          <span className="text-primary font-black">راهنمای وضعیت:</span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" />
            قفل
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
            آماده شروع
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block" />
            در حال انجام
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            در انتظار منتور
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
            نیازمند اصلاح
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
            تکمیل شده
          </span>
        </div>
      </div>

      {/* Node Detail Slide Drawer */}
      {selectedNode && (
        <NodeDetailDrawer
          node={selectedNode}
          progress={selectedProgress}
          onClose={() => setSelectedNodeId(null)}
          onRefresh={fetchRoadmapData}
        />
      )}
    </div>
  );
}
