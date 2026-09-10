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
  ReactFlowProvider,
  useReactFlow,
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
  Maximize2,
  Plus,
  Minus,
  HelpCircle,
  X,
} from 'lucide-react';
import Link from 'next/link';

const nodeTypes = {
  skillNode: SkillNode,
};

// Sub-component inside ReactFlowProvider to control view & mobile actions
function CanvasFlowView({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onNodeClick,
  hasLoaded,
}: {
  nodes: any[];
  edges: any[];
  onNodesChange: any;
  onEdgesChange: any;
  onNodeClick: any;
  hasLoaded: boolean;
}) {
  const { fitView, zoomIn, zoomOut } = useReactFlow();
  const [showMobileLegend, setShowMobileLegend] = useState(false);

  // Auto-fit view when nodes load or change
  useEffect(() => {
    if (hasLoaded && nodes.length > 0) {
      const timer = setTimeout(() => {
        fitView({ padding: 0.25, duration: 450 });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [hasLoaded, nodes.length, fitView]);

  return (
    <div className="flex-1 relative bg-slate-50 border-2 border-primary rounded-xl sm:rounded-2xl shadow-[4px_5px_0_0_#21295a] overflow-hidden select-none">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.25, minZoom: 0.25, maxZoom: 1.1 }}
        minZoom={0.18}
        maxZoom={1.5}
        panOnDrag={true}
        zoomOnPinch={true}
        zoomOnDoubleClick={false}
        preventScrolling={true}
        attributionPosition="bottom-left"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1.5} color="#cbd5e1" />

        {/* Desktop Controls */}
        <Controls
          position="bottom-left"
          showInteractive={false}
          className="!bg-white !border-2 !border-primary !rounded-xl !shadow-[2px_3px_0_0_#21295a] scale-90 sm:scale-100 origin-bottom-left"
        />

        {/* MiniMap: Hidden on mobile (< md) to preserve full touch viewport */}
        <MiniMap
          className="hidden md:block !bg-white !border-2 !border-primary !rounded-xl !shadow-[2px_3px_0_0_#21295a]"
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

      {/* Mobile Floating Quick-Action Controls (Top-Left) */}
      <div className="sm:hidden absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm border-2 border-primary rounded-xl p-1 shadow-[2px_3px_0_0_#21295a]">
        <button
          type="button"
          onClick={() => fitView({ padding: 0.25, duration: 300 })}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-primary active:scale-90 transition-transform flex items-center gap-1"
          title="تراز کردن روی کل نقشه"
        >
          <Maximize2 className="w-4 h-4 text-secondary-dark" />
          <span className="text-[10px] font-black">تراز</span>
        </button>
        <div className="w-[1px] h-4 bg-slate-200" />
        <button
          type="button"
          onClick={() => zoomIn({ duration: 200 })}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-primary active:scale-90"
          title="بزرگ‌نمایی"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => zoomOut({ duration: 200 })}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-primary active:scale-90"
          title="کوچک‌نمایی"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Desktop Legend Overlay Bar */}
      <div className="hidden sm:flex absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm border-2 border-primary rounded-xl px-3 py-2 shadow-[2px_3px_0_0_#21295a] text-[10px] font-bold flex-wrap items-center gap-3 text-slate-600 z-10">
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

      {/* Mobile Legend Floating Button & Bottom Sheet */}
      <div className="sm:hidden absolute bottom-3 right-3 z-10">
        <button
          type="button"
          onClick={() => setShowMobileLegend(true)}
          className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm border-2 border-primary rounded-xl px-2.5 py-1.5 shadow-[2px_2px_0_0_#21295a] text-[10px] font-bold text-primary active:scale-95 transition-transform cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-secondary" />
          <span>راهنمای وضعیت</span>
        </button>

        {showMobileLegend && (
          <div className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-xs flex items-end justify-center p-3 animate-in fade-in duration-200">
            <div className="bg-white border-2 border-primary rounded-2xl w-full max-w-sm p-4 shadow-[4px_6px_0_0_#21295a] text-right space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-black text-xs text-primary">راهنمای وضعیت گره‌ها</span>
                <button
                  type="button"
                  onClick={() => setShowMobileLegend(false)}
                  className="p-1 rounded-lg border border-primary hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-slate-700">
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="w-3 h-3 rounded-full bg-slate-400 shrink-0" />
                  <span>قفل شده</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-800">
                  <span className="w-3 h-3 rounded-full bg-sky-500 shrink-0" />
                  <span>آماده شروع</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-800">
                  <span className="w-3 h-3 rounded-full bg-teal-600 shrink-0" />
                  <span>در حال انجام</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
                  <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                  <span>در انتظار منتور</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800">
                  <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0" />
                  <span>نیازمند اصلاح</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
                  <span className="w-3 h-3 rounded-full bg-emerald-600 shrink-0" />
                  <span>تکمیل شده</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowMobileLegend(false)}
                className="w-full py-2 rounded-xl bg-primary text-white text-xs font-black"
              >
                متوجه شدم
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RoadmapDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const { user, loading } = useAuth();

  const [roadmap, setRoadmap] = useState<any | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

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

  const handleSelfEnroll = async () => {
    if (!roadmap) return;
    try {
      setEnrolling(true);
      await api.enrollments.selfEnroll(roadmap.id);
      await fetchRoadmapData();
    } catch (err: any) {
      alert(err.message || 'خطا در ثبت‌نام مسیر');
    } finally {
      setEnrolling(false);
    }
  };

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
    <div className="h-[calc(100dvh-105px)] sm:h-[84vh] flex flex-col gap-2 sm:gap-3 text-right">
      {/* Top Banner / Roadmap Header - Mobile Optimized */}
      <div className="box-pattern pattern-cover bg-white border-2 border-primary rounded-xl sm:rounded-2xl p-2.5 sm:p-4 shadow-[3px_4px_0_0_#21295a] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 shrink-0">
        <div className="flex items-center gap-2.5 sm:gap-4">
          <Link
            href="/"
            className="p-1.5 sm:p-2 rounded-xl border-2 border-primary bg-bg-mint text-primary hover:bg-secondary hover:text-white transition-colors shrink-0"
            title="بازگشت"
          >
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-black text-sm sm:text-lg md:text-xl text-primary truncate text-right bidi-text" dir="rtl">
                <bdi>{roadmap.title}</bdi>
              </h1>
              <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded bg-secondary/20 text-secondary-dark shrink-0">
                نسخه {roadmap.version}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-1 mt-0.5 text-right bidi-text" dir="rtl">
              <bdi>{roadmap.description}</bdi>
            </p>
          </div>
        </div>

        {/* Enrollment Action or Progress summary pill */}
        {!enrollment ? (
          <button
            type="button"
            disabled={enrolling}
            onClick={handleSelfEnroll}
            className="px-4 py-2 rounded-xl bg-secondary text-white font-black text-xs shadow-[3px_4px_0_0_#21295a] hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-1.5 border border-primary shrink-0 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{enrolling ? 'در حال فعال‌سازی...' : 'شروع این مسیر و باز کردن گره‌ها'}</span>
          </button>
        ) : (
          <div className="flex items-center justify-between sm:justify-end gap-3 bg-slate-50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-slate-200 shrink-0">
            <div className="text-right">
              <span className="text-[9px] sm:text-[10px] text-slate-400 block font-bold">
                وضعیت تسلط:
              </span>
              <span className="text-xs font-black text-secondary-dark">
                {stats.percent}٪ ({stats.completed}/{stats.total})
              </span>
            </div>

            <div className="w-20 sm:w-28 h-2 sm:h-2.5 rounded-full bg-slate-200 overflow-hidden shrink-0">
              <div
                className="h-full bg-secondary transition-all"
                style={{ width: `${stats.percent}%` }}
              />
            </div>

            {enrollment?.mentor && (
              <div className="pr-2.5 border-r border-slate-200 text-[10px] sm:text-xs font-bold text-primary hidden xs:block">
                <span className="text-[9px] text-slate-400 block font-medium">
                  منتور ناظر:
                </span>
                {enrollment.mentor.fullName}
              </div>
            )}
          </div>
        )}
      </div>

      {/* React Flow Skill Tree Canvas wrapped in Provider */}
      <ReactFlowProvider>
        <CanvasFlowView
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          hasLoaded={!fetching && nodes.length > 0}
        />
      </ReactFlowProvider>

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
