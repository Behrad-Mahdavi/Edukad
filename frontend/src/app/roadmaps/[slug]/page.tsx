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
import { toPersianDigits } from '@/lib/utils';
import { RokadLoader } from '@/components/ui/Loading';
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
    <div className="flex-1 relative bg-[#F8F9FA] dark:bg-[#0B0F17] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-male dark:shadow-ecosystem overflow-hidden select-none">
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
        <Background variant={BackgroundVariant.Dots} gap={20} size={1.5} color="#94a3b8" className="opacity-40" />

        {/* Desktop Controls */}
        <Controls
          position="bottom-left"
          showInteractive={false}
          className="!bg-white dark:!bg-[#151C28] !border !border-gray-200 dark:!border-gray-700 !rounded-xl !shadow-male dark:!shadow-ecosystem scale-90 sm:scale-100 origin-bottom-left"
        />

        {/* MiniMap */}
        <MiniMap
          className="hidden md:block !bg-white dark:!bg-[#151C28] !border !border-gray-200 dark:!border-gray-700 !rounded-xl !shadow-male dark:!shadow-ecosystem"
          nodeColor={(node: any) => {
            switch (node.data?.status) {
              case 'COMPLETED':
                return '#009966';
              case 'SUBMITTED':
                return '#F8A41D';
              case 'NEEDS_REVISION':
                return '#E0195B';
              case 'IN_PROGRESS':
                return '#59BBAF';
              case 'UNLOCKED':
                return '#0284c7';
              default:
                return '#94a3b8';
            }
          }}
        />
      </ReactFlow>

      {/* Mobile Floating Quick-Action Controls (Top-Left) */}
      <div className="sm:hidden absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-white/95 dark:bg-[#151C28]/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-1 shadow-male dark:shadow-ecosystem">
        <button
          type="button"
          onClick={() => fitView({ padding: 0.25, duration: 300 })}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sec dark:text-white active:scale-90 transition-transform flex items-center gap-1"
          title="تراز کردن روی کل نقشه"
        >
          <Maximize2 className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-black">تراز</span>
        </button>
        <div className="w-[1px] h-4 bg-gray-200 dark:bg-gray-700" />
        <button
          type="button"
          onClick={() => zoomIn({ duration: 200 })}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sec dark:text-white active:scale-90"
          title="بزرگ‌نمایی"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => zoomOut({ duration: 200 })}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sec dark:text-white active:scale-90"
          title="کوچک‌نمایی"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Desktop Legend Overlay Bar */}
      <div className="hidden sm:flex absolute bottom-3 right-3 bg-white/95 dark:bg-[#151C28]/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2 shadow-male dark:shadow-ecosystem text-[11px] font-bold flex-wrap items-center gap-3 text-ink-normal/80 dark:text-gray-300 z-10">
        <span className="text-sec dark:text-white font-black">راهنمای وضعیت:</span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-gray-400 inline-block" />
          <span>قفل</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
          <span>آماده شروع</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />
          <span>در حال انجام</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-college-normal inline-block" />
          <span>در انتظار منتور</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-female-normal inline-block" />
          <span>نیازمند اصلاح</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
          <span>تکمیل شده</span>
        </span>
      </div>

      {/* Mobile Legend Floating Button & Bottom Sheet */}
      <div className="sm:hidden absolute bottom-3 right-3 z-10">
        <button
          type="button"
          onClick={() => setShowMobileLegend(true)}
          className="flex items-center gap-1.5 bg-white/95 dark:bg-[#151C28]/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl px-2.5 py-1.5 shadow-sm text-[10px] font-bold text-sec dark:text-white active:scale-95 transition-transform cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-primary" />
          <span>راهنمای وضعیت</span>
        </button>

        {showMobileLegend && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center p-3 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#151C28] border border-gray-200 dark:border-gray-700 rounded-2xl w-full max-w-sm p-4 shadow-male dark:shadow-ecosystem text-right space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                <span className="font-black text-xs text-sec dark:text-white">راهنمای وضعیت گره‌ها</span>
                <button
                  type="button"
                  onClick={() => setShowMobileLegend(false)}
                  className="p-1 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 text-gray-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-ink-normal/80 dark:text-gray-300">
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-gray-50 dark:bg-[#1C2536] border border-gray-200 dark:border-gray-700">
                  <span className="w-3 h-3 rounded-full bg-gray-400 shrink-0" />
                  <span>قفل شده</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300">
                  <span className="w-3 h-3 rounded-full bg-sky-500 shrink-0" />
                  <span>آماده شروع</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-ecosystem-light dark:bg-ecosystem-darker/40 border border-primary/30 text-ecosystem-darker dark:text-ecosystem-light">
                  <span className="w-3 h-3 rounded-full bg-primary shrink-0" />
                  <span>در حال انجام</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-college-light dark:bg-college-darker/40 border border-college-normal/30 text-college-darker dark:text-college-light">
                  <span className="w-3 h-3 rounded-full bg-college-normal shrink-0" />
                  <span>در انتظار منتور</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-female-light dark:bg-female-darker/40 border border-female-normal/30 text-female-darker dark:text-female-light">
                  <span className="w-3 h-3 rounded-full bg-female-normal shrink-0" />
                  <span>نیازمند اصلاح</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                  <span className="w-3 h-3 rounded-full bg-emerald-600 shrink-0" />
                  <span>تکمیل شده</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowMobileLegend(false)}
                className="rokad-btn-primary w-full py-2 text-xs"
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
            style: { stroke: '#59BBAF', strokeWidth: 2.5 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#59BBAF',
              width: 16,
              height: 16,
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
      <RokadLoader
        title="در حال ترسیم و بارگذاری درخت مهارت‌های تعاملی..."
        subtitle="محاسبه پیش‌نیازها، وضعیت پیشرفت و دسترسی‌های گره‌ها"
        type="skill"
      />
    );
  }


  if (!roadmap) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold text-sec dark:text-white mb-2">مسیر یافت نشد</h2>
        <Link href="/" className="text-xs text-primary font-bold hover:underline">
          بازگشت به خانه
        </Link>
      </div>
    );
  }

  const enrollment = roadmap.enrollments?.[0];

  return (
    <div className="h-[calc(100dvh-105px)] sm:h-[84vh] flex flex-col gap-2 sm:gap-3 text-right">
      {/* Top Banner / Roadmap Header */}
      <div className="rokad-card bg-white dark:bg-[#151C28] border border-gray-200 dark:border-gray-800 rounded-2xl p-3 sm:p-4 shadow-male dark:shadow-ecosystem flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 shrink-0">
        <div className="flex items-center gap-2.5 sm:gap-4">
          <Link
            href="/"
            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1C2536] text-sec dark:text-white hover:bg-primary hover:text-white transition-colors shrink-0"
            title="بازگشت"
          >
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-black text-sm sm:text-lg md:text-xl text-sec dark:text-white truncate text-right bidi-text" dir="rtl">
                <bdi>{roadmap.title}</bdi>
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-ecosystem-light dark:bg-ecosystem-darker/60 text-ecosystem-darker dark:text-ecosystem-light border border-primary/30 shrink-0">
                نسخه {toPersianDigits(roadmap.version)}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-ink-normal/70 dark:text-gray-400 line-clamp-1 mt-0.5 text-right bidi-text" dir="rtl">
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
            className="rokad-btn-primary px-4 py-2 text-xs shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>{enrolling ? 'در حال فعال‌سازی...' : 'شروع این مسیر و باز کردن گره‌ها'}</span>
          </button>
        ) : (
          <div className="flex items-center justify-between sm:justify-end gap-3 bg-gray-50 dark:bg-[#1C2536] px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-gray-200 dark:border-gray-700 shrink-0">
            <div className="text-right">
              <span className="text-[10px] text-ink-normal/60 dark:text-gray-400 block font-bold">
                وضعیت تسلط:
              </span>
              <span className="text-xs font-black text-primary">
                {toPersianDigits(stats.percent)}٪ ({toPersianDigits(stats.completed)} از {toPersianDigits(stats.total)})
              </span>
            </div>

            <div className="w-20 sm:w-28 h-2 sm:h-2.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden shrink-0">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${stats.percent}%` }}
              />
            </div>

            {enrollment?.mentor && (
              <div className="pr-2.5 border-r border-gray-200 dark:border-gray-700 text-[10px] sm:text-xs font-bold text-sec dark:text-white hidden xs:block">
                <span className="text-[9px] text-ink-normal/60 dark:text-gray-400 block font-medium">
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
