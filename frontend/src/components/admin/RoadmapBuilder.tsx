'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  MarkerType,
  BackgroundVariant,
  Handle,
  Position,
} from '@xyflow/react';
import { api } from '@/lib/api';
import {
  Plus,
  Trash2,
  Edit3,
  Layers,
  Save,
  AlertCircle,
  CheckCircle2,
  Link as LinkIcon,
  Video,
  FileText,
  X,
  ExternalLink,
  Settings,
  HelpCircle,
  Eye,
  Workflow,
  Compass,
  Sparkles,
} from 'lucide-react';
import { computeHierarchicalLayout } from '@/lib/graph-layout';

// Custom Node for the Admin Canvas
function AdminNodeComponent({ data }: { data: any }) {
  return (
    <div
      onClick={() => data.onEdit(data.node)}
      className="relative w-64 rounded-tl-2xl rounded-br-2xl bg-white border-2 border-primary p-3.5 shadow-[4px_5px_0_0_#21295a] text-right cursor-pointer hover:border-secondary hover:shadow-[4px_5px_0_0_#58bdaf] transition-all group"
    >
      {/* Target Handle (Top: incoming prerequisites) */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-primary !w-3.5 !h-3.5 !border-2 !border-white hover:scale-125 transition-transform"
        title="ورودی (پیش‌نیازهای این گره را به اینجا وصل کنید)"
      />

      <div className="flex items-center justify-between gap-1 mb-2">
        <span
          className={`text-[9px] font-black px-2 py-0.5 rounded ${
            data.hasDeliverable
              ? 'bg-accent/15 text-accent border border-accent/30'
              : 'bg-slate-100 text-slate-500 border border-slate-200'
          }`}
        >
          {data.hasDeliverable ? 'دارای مأموریت' : 'مطالعه آزاد'}
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            data.onEdit(data.node);
          }}
          className="p-1 rounded-lg bg-bg-lavender border border-primary text-primary hover:bg-secondary hover:text-white transition-colors"
          title="ویرایش گره"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>
      </div>

      <h4 className="font-black text-xs text-primary leading-snug line-clamp-2">
        {data.title}
      </h4>

      {data.description && (
        <p className="text-[11px] text-slate-500 line-clamp-1 mt-1 leading-relaxed">
          {data.description}
        </p>
      )}

      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-semibold">
        <span>{data.resourceCount} منبع پیوست</span>
        <span className="text-secondary-dark font-bold group-hover:underline">
          ویرایش و جزئیات ↗
        </span>
      </div>

      {/* Source Handle (Bottom: outgoing prerequisite to other nodes) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-secondary !w-3.5 !h-3.5 !border-2 !border-white hover:scale-125 transition-transform"
        title="خروجی (این گره پیش‌نیاز گره‌های بعدی خواهد شد)"
      />
    </div>
  );
}

const nodeTypes = {
  adminNode: AdminNodeComponent,
};

interface RoadmapBuilderProps {
  roadmaps: any[];
  onRefresh: () => void;
}

export function RoadmapBuilder({ roadmaps, onRefresh }: RoadmapBuilderProps) {
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string>(
    roadmaps[0]?.id || '',
  );
  const [currentRoadmap, setCurrentRoadmap] = useState<any | null>(null);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modals state
  const [showCreateRoadmapModal, setShowCreateRoadmapModal] = useState(false);
  const [showEditRoadmapModal, setShowEditRoadmapModal] = useState(false);
  const [editingNode, setEditingNode] = useState<any | null>(null);
  const [isNewNode, setIsNewNode] = useState(false);

  // Form states for Create Roadmap
  const [newRmTitle, setNewRmTitle] = useState('');
  const [newRmSlug, setNewRmSlug] = useState('');
  const [newRmDesc, setNewRmDesc] = useState('');
  const [newRmDept, setNewRmDept] = useState<'ENGINEERS' | 'ARTISTS' | 'OPS'>('ENGINEERS');
  const [newRmStatus, setNewRmStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT');

  // Form states for Edit Roadmap
  const [editRmTitle, setEditRmTitle] = useState('');
  const [editRmSlug, setEditRmSlug] = useState('');
  const [editRmDesc, setEditRmDesc] = useState('');
  const [editRmDept, setEditRmDept] = useState<'ENGINEERS' | 'ARTISTS' | 'OPS'>('ENGINEERS');
  const [editRmStatus, setEditRmStatus] = useState<'DRAFT' | 'PUBLISHED' | 'ARCHIVED'>('DRAFT');

  // Node editing form state
  const [nodeTitle, setNodeTitle] = useState('');
  const [nodeDesc, setNodeDesc] = useState('');
  const [nodeHasDeliverable, setNodeHasDeliverable] = useState(true);
  const [nodePosX, setNodePosX] = useState(100);
  const [nodePosY, setNodePosY] = useState(100);

  // Resource adding inside node editor
  const [resTitle, setResTitle] = useState('');
  const [resType, setResType] = useState<'LINK' | 'VIDEO_URL' | 'MARKDOWN_TEXT' | 'FILE'>('LINK');
  const [resContent, setResContent] = useState('');

  // Prerequisite adding inside node editor
  const [selectedPrereqId, setSelectedPrereqId] = useState('');

  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Load detailed roadmap with nodes
  const loadRoadmapDetails = useCallback(async (slug: string) => {
    setFetching(true);
    setError(null);
    try {
      const data = await api.roadmaps.getBySlug(slug);
      setCurrentRoadmap(data);

      // Build React Flow nodes
      const flowNodes = data.nodes.map((node: any) => ({
        id: node.id,
        type: 'adminNode',
        position: { x: node.positionX, y: node.positionY },
        data: {
          id: node.id,
          title: node.title,
          description: node.description,
          hasDeliverable: node.hasDeliverable,
          resourceCount: node.resources?.length || 0,
          node,
          onEdit: (n: any) => openNodeEditor(n, false),
        },
      }));

      // Build edges
      const flowEdges: Edge[] = [];
      data.nodes.forEach((node: any) => {
        node.prerequisites?.forEach((prereq: any) => {
          flowEdges.push({
            id: `edge-${prereq.prerequisiteNodeId}-${node.id}`,
            source: prereq.prerequisiteNodeId,
            target: node.id,
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#21295a', strokeWidth: 2.5 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#21295a',
              width: 16,
              height: 16,
            },
          });
        });
      });

      setNodes(flowNodes);
      setEdges(flowEdges);
    } catch (err: any) {
      setError(err?.message || 'خطا در بارگذاری مسیر');
    } finally {
      setFetching(false);
    }
  }, [setNodes, setEdges]);

  useEffect(() => {
    if (selectedRoadmapId) {
      const rm = roadmaps.find((r) => r.id === selectedRoadmapId);
      if (rm) {
        loadRoadmapDetails(rm.slug);
      }
    } else if (roadmaps.length > 0) {
      setSelectedRoadmapId(roadmaps[0].id);
    }
  }, [selectedRoadmapId, roadmaps, loadRoadmapDetails]);

  // Handle Drag & Drop connection in React Flow (Auto add prerequisite)
  const onConnect = useCallback(
    async (connection: Connection) => {
      if (!connection.source || !connection.target) return;
      setError(null);
      try {
        // target node requires source node
        await api.roadmaps.addPrerequisite(connection.target, connection.source);
        setSuccessMsg('ارتباط پیش‌نیاز با موفقیت برقرار شد!');
        if (currentRoadmap) {
          await loadRoadmapDetails(currentRoadmap.slug);
          onRefresh();
        }
      } catch (err: any) {
        setError(err?.message || 'خطا در ایجاد ارتباط پیش‌نیاز (بررسی چرخه دورانی)');
      }
    },
    [currentRoadmap, loadRoadmapDetails, onRefresh],
  );

  // Handle Edge Delete directly on Canvas
  const onEdgesDelete = useCallback(
    async (deletedEdges: Edge[]) => {
      for (const edge of deletedEdges) {
        try {
          await api.roadmaps.removePrerequisite(edge.target, edge.source);
        } catch (err: any) {
          console.error(err);
        }
      }
      setSuccessMsg('اتصال پیش‌نیاز حذف گردید.');
      if (currentRoadmap) {
        await loadRoadmapDetails(currentRoadmap.slug);
        onRefresh();
      }
    },
    [currentRoadmap, loadRoadmapDetails, onRefresh],
  );

  // Save Node Positions
  const handleSavePositions = async () => {
    if (!nodes || nodes.length === 0) return;
    try {
      const updates = nodes.map((n) => ({
        id: n.id,
        positionX: n.position.x,
        positionY: n.position.y,
      }));
      await api.roadmaps.updatePositions(updates);
      setSuccessMsg('چیدمان گره‌ها در دیتابیس با موفقیت ذخیره شد!');
    } catch (err: any) {
      setError(err?.message || 'خطا در ذخیره موقعیت گره‌ها');
    }
  };

  // Auto-arrange all nodes hierarchically and save positions
  const handleAutoLayout = async () => {
    if (!currentRoadmap || !currentRoadmap.nodes || currentRoadmap.nodes.length === 0) return;
    try {
      const laidOut = computeHierarchicalLayout(currentRoadmap.nodes);
      const updates = laidOut.map((n) => ({
        id: n.id,
        positionX: n.positionX,
        positionY: n.positionY,
      }));
      await api.roadmaps.updatePositions(updates);
      setSuccessMsg('چیدمان گره‌ها به صورت درختی و مرتب بازآرایی و ذخیره شد!');
      await loadRoadmapDetails(currentRoadmap.slug);
      onRefresh();
    } catch (err: any) {
      setError(err?.message || 'خطا در مرتب‌سازی خودکار');
    }
  };

  // Open Node Editor Modal
  const openNodeEditor = (node: any, isNew: boolean) => {
    setIsNewNode(isNew);
    if (isNew) {
      setEditingNode({ id: 'new', roadmapId: currentRoadmap?.id });
      setNodeTitle('');
      setNodeDesc('');
      setNodeHasDeliverable(true);
      // Place new node cleanly below the existing nodes so it does not overlap
      const maxExistingY = nodes.reduce((max, n) => Math.max(max, n.position.y), 0);
      setNodePosX(360);
      setNodePosY(maxExistingY > 0 ? maxExistingY + 220 : 50);
    } else {
      setEditingNode(node);
      setNodeTitle(node.title);
      setNodeDesc(node.description || '');
      setNodeHasDeliverable(node.hasDeliverable);
      setNodePosX(node.positionX);
      setNodePosY(node.positionY);
    }
    setError(null);
    setResTitle('');
    setResContent('');
    setSelectedPrereqId('');
  };

  // Save Node (Create or Update)
  const handleSaveNode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nodeTitle.trim()) {
      setError('عنوان گره الزامی است');
      return;
    }

    try {
      if (isNewNode) {
        await api.roadmaps.createNode({
          roadmapId: currentRoadmap.id,
          title: nodeTitle.trim(),
          description: nodeDesc.trim(),
          hasDeliverable: nodeHasDeliverable,
          positionX: nodePosX,
          positionY: nodePosY,
        });
        setSuccessMsg('گره جدید ایجاد شد! (نسخه ساختاری مسیر ارتقا یافت)');
      } else {
        await api.roadmaps.updateNode(editingNode.id, {
          title: nodeTitle.trim(),
          description: nodeDesc.trim(),
          hasDeliverable: nodeHasDeliverable,
        });
        setSuccessMsg('مشخصات گره با موفقیت ویرایش شد.');
      }
      setEditingNode(null);
      await loadRoadmapDetails(currentRoadmap.slug);
      onRefresh();
    } catch (err: any) {
      setError(err?.message || 'خطا در ذخیره گره');
    }
  };

  // Delete Node
  const handleDeleteNode = async (nodeId: string) => {
    if (
      !confirm(
        'آیا از حذف این گره اطمینان دارید؟ تمام پیش‌نیازها، سابمیشن‌ها و منابع آن حذف خواهند شد.',
      )
    )
      return;
    try {
      await api.roadmaps.deleteNode(nodeId);
      setSuccessMsg('گره حذف شد و نسخه مسیر ارتقا یافت.');
      setEditingNode(null);
      await loadRoadmapDetails(currentRoadmap.slug);
      onRefresh();
    } catch (err: any) {
      setError(err?.message || 'خطا در حذف گره');
    }
  };

  // Add Resource to Node
  const handleAddResource = async () => {
    if (!resTitle.trim() || !resContent.trim() || !editingNode) return;
    try {
      await api.roadmaps.addResource(editingNode.id, {
        title: resTitle.trim(),
        type: resType,
        content: resContent.trim(),
      });
      setResTitle('');
      setResContent('');
      setSuccessMsg('منبع جدید به گره اضافه گردید.');
      await loadRoadmapDetails(currentRoadmap.slug);
      const updated = (await api.roadmaps.getBySlug(currentRoadmap.slug)).nodes.find(
        (n: any) => n.id === editingNode.id,
      );
      if (updated) setEditingNode(updated);
    } catch (err: any) {
      setError(err?.message || 'خطا در افزودن منبع');
    }
  };

  // Delete Resource
  const handleDeleteResource = async (resId: string) => {
    try {
      await api.roadmaps.deleteResource(resId);
      setSuccessMsg('منبع حذف شد.');
      await loadRoadmapDetails(currentRoadmap.slug);
      const updated = (await api.roadmaps.getBySlug(currentRoadmap.slug)).nodes.find(
        (n: any) => n.id === editingNode.id,
      );
      if (updated) setEditingNode(updated);
    } catch (err: any) {
      setError(err?.message || 'خطا در حذف منبع');
    }
  };

  // Add Prerequisite from editor
  const handleAddPrereqInEditor = async () => {
    if (!selectedPrereqId || !editingNode) return;
    try {
      await api.roadmaps.addPrerequisite(editingNode.id, selectedPrereqId);
      setSuccessMsg('پیش‌نیاز اضافه شد.');
      setSelectedPrereqId('');
      await loadRoadmapDetails(currentRoadmap.slug);
      const updated = (await api.roadmaps.getBySlug(currentRoadmap.slug)).nodes.find(
        (n: any) => n.id === editingNode.id,
      );
      if (updated) setEditingNode(updated);
      onRefresh();
    } catch (err: any) {
      setError(err?.message || 'خطا در ایجاد پیش‌نیاز');
    }
  };

  // Remove Prerequisite
  const handleRemovePrereq = async (prereqId: string) => {
    if (!editingNode) return;
    try {
      await api.roadmaps.removePrerequisite(editingNode.id, prereqId);
      setSuccessMsg('پیش‌نیاز حذف شد.');
      await loadRoadmapDetails(currentRoadmap.slug);
      const updated = (await api.roadmaps.getBySlug(currentRoadmap.slug)).nodes.find(
        (n: any) => n.id === editingNode.id,
      );
      if (updated) setEditingNode(updated);
      onRefresh();
    } catch (err: any) {
      setError(err?.message || 'خطا در حذف پیش‌نیاز');
    }
  };

  // Create Roadmap Handler
  const handleCreateRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRmTitle.trim() || !newRmSlug.trim()) return;
    try {
      const created = await api.roadmaps.createRoadmap({
        title: newRmTitle.trim(),
        slug: newRmSlug.trim(),
        description: newRmDesc.trim(),
        department: newRmDept,
        status: newRmStatus,
      });
      setShowCreateRoadmapModal(false);
      setNewRmTitle('');
      setNewRmSlug('');
      setNewRmDesc('');
      setSuccessMsg('مسیر یادگیری جدید با موفقیت ایجاد شد!');
      onRefresh();
      setSelectedRoadmapId(created.id);
    } catch (err: any) {
      setError(err?.message || 'خطا در ایجاد مسیر');
    }
  };

  // Open Edit Roadmap Modal
  const openEditRoadmapModal = () => {
    if (!currentRoadmap) return;
    setEditRmTitle(currentRoadmap.title);
    setEditRmSlug(currentRoadmap.slug);
    setEditRmDesc(currentRoadmap.description || '');
    setEditRmDept(currentRoadmap.department);
    setEditRmStatus(currentRoadmap.status);
    setShowEditRoadmapModal(true);
  };

  // Update Roadmap Details
  const handleUpdateRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRoadmap) return;
    try {
      await api.roadmaps.updateRoadmap(currentRoadmap.id, {
        title: editRmTitle.trim(),
        slug: editRmSlug.trim(),
        description: editRmDesc.trim(),
        department: editRmDept,
        status: editRmStatus,
      });
      setShowEditRoadmapModal(false);
      setSuccessMsg('مشخصات مسیر با موفقیت بروزرسانی شد.');
      onRefresh();
      await loadRoadmapDetails(editRmSlug.trim());
    } catch (err: any) {
      setError(err?.message || 'خطا در ویرایش مسیر');
    }
  };

  // Delete Roadmap
  const handleDeleteRoadmap = async () => {
    if (!currentRoadmap) return;
    if (
      !confirm(
        `آیا از حذف کامل مسیر «${currentRoadmap.title}» اطمینان دارید؟ تمامی گره‌ها، منابع و ثبت‌نام‌های آن حذف خواهند شد.`,
      )
    )
      return;
    try {
      await api.roadmaps.deleteRoadmap(currentRoadmap.id);
      setShowEditRoadmapModal(false);
      setSuccessMsg('مسیر یادگیری به طور کامل حذف شد.');
      onRefresh();
      const remaining = roadmaps.filter((r) => r.id !== currentRoadmap.id);
      if (remaining.length > 0) {
        setSelectedRoadmapId(remaining[0].id);
      } else {
        setSelectedRoadmapId('');
        setCurrentRoadmap(null);
      }
    } catch (err: any) {
      setError(err?.message || 'خطا در حذف مسیر');
    }
  };

  // Toggle Roadmap Status (DRAFT <-> PUBLISHED)
  const handleToggleStatus = async () => {
    if (!currentRoadmap) return;
    const newStatus = currentRoadmap.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      await api.roadmaps.updateRoadmap(currentRoadmap.id, { status: newStatus });
      setSuccessMsg(`وضعیت مسیر به ${newStatus} تغییر یافت.`);
      await loadRoadmapDetails(currentRoadmap.slug);
      onRefresh();
    } catch (err: any) {
      setError(err?.message || 'خطا در تغییر وضعیت');
    }
  };

  return (
    <div className="space-y-4 text-right">
      {/* Alert Messages */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border-2 border-rose-400 text-rose-700 text-xs font-bold flex items-center justify-between gap-2 shadow-[2px_3px_0_0_#e0195b]">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-700 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border-2 border-emerald-400 text-emerald-700 text-xs font-bold flex items-center justify-between gap-2 shadow-[2px_3px_0_0_#10b981]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-400 hover:text-emerald-700 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Toolbar: Roadmap Selector, Edit Roadmap, Status & Action Buttons */}
      <div className="sticker-card p-4 bg-white border-2 border-primary flex flex-wrap items-center justify-between gap-4">
        {/* Selector & Create */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <Workflow className="w-4 h-4 text-secondary" />
            <label className="text-xs font-bold text-primary">مسیر فعال:</label>
          </div>
          <select
            value={selectedRoadmapId}
            onChange={(e) => setSelectedRoadmapId(e.target.value)}
            className="px-3 py-1.5 rounded-xl border-2 border-primary bg-white text-xs font-black text-primary focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            {roadmaps.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title} ({r.department} - نسخه {r.version})
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setShowCreateRoadmapModal(true)}
            className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold shadow-[2px_3px_0_0_#58bdaf] hover:-translate-y-0.5 transition-transform flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            مسیر جدید
          </button>

          {currentRoadmap && (
            <button
              type="button"
              onClick={openEditRoadmapModal}
              className="px-3 py-1.5 rounded-xl border-2 border-primary bg-bg-lavender text-primary text-xs font-bold hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
              title="ویرایش عنوان، دپارتمان و مشخصات کلی این مسیر"
            >
              <Settings className="w-3.5 h-3.5 text-secondary-dark" />
              ویرایش مشخصات مسیر
            </button>
          )}

          {currentRoadmap && (
            <Link
              href={`/roadmaps/${currentRoadmap.slug}`}
              target="_blank"
              className="px-3 py-1.5 rounded-xl border-2 border-primary bg-white text-primary text-xs font-bold hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
              title="مشاهده گراف در نمای دانش‌آموز"
            >
              <Eye className="w-3.5 h-3.5 text-tertiary" />
              نمای دانش‌آموز ↗
            </Link>
          )}
        </div>

        {/* Roadmap Info & Status */}
        {currentRoadmap && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-semibold">
                نسخه ساختاری: {currentRoadmap.version}
              </span>
              <span className="text-xs font-black text-primary">
                {currentRoadmap.nodes?.length || 0} گره مهارتی
              </span>
            </div>

            <button
              type="button"
              onClick={handleToggleStatus}
              className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
                currentRoadmap.status === 'PUBLISHED'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-600 hover:bg-emerald-200'
                  : 'bg-amber-100 text-amber-800 border-amber-600 hover:bg-amber-200'
              }`}
            >
              وضعیت: {currentRoadmap.status === 'PUBLISHED' ? 'منتشر شده' : 'پیش‌نویس (DRAFT)'}
            </button>
          </div>
        )}

        {/* Action Buttons: Add Node, Auto Layout & Save Layout */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={handleAutoLayout}
            disabled={!currentRoadmap}
            className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-purple-600 text-white text-[11px] sm:text-xs font-black shadow-[2px_3px_0_0_#21295a] hover:-translate-y-0.5 transition-transform flex items-center gap-1 cursor-pointer disabled:opacity-50"
            title="چیدمان استاندارد و درختی گره‌ها از بالا به پایین"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden xs:inline">مرتب‌سازی خودکار</span>
          </button>

          <button
            type="button"
            onClick={() => openNodeEditor(null, true)}
            disabled={!currentRoadmap}
            className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-accent text-white text-[11px] sm:text-xs font-black shadow-[2px_3px_0_0_#21295a] hover:-translate-y-0.5 transition-transform flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" />
            افزودن گره
          </button>

          <button
            type="button"
            onClick={handleSavePositions}
            disabled={!currentRoadmap}
            className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-secondary text-white text-[11px] sm:text-xs font-black shadow-[2px_3px_0_0_#347e75] hover:-translate-y-0.5 transition-transform flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            ذخیره چیدمان
          </button>
        </div>
      </div>

      {/* Interactive Visual Canvas with React Flow */}
      <div className="h-[480px] sm:h-[600px] md:h-[640px] relative bg-slate-50 border-2 border-primary rounded-xl sm:rounded-2xl shadow-[4px_5px_0_0_#21295a] overflow-hidden select-none">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgesDelete={onEdgesDelete}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.25, minZoom: 0.25, maxZoom: 1.1 }}
          minZoom={0.2}
          maxZoom={1.5}
          panOnDrag={true}
          zoomOnPinch={true}
          zoomOnDoubleClick={false}
          preventScrolling={true}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1.5} color="#cbd5e1" />
          <Controls
            position="bottom-left"
            showInteractive={false}
            className="!bg-white !border-2 !border-primary !rounded-xl !shadow-[2px_3px_0_0_#21295a] scale-90 sm:scale-100 origin-bottom-left"
          />
          <MiniMap className="hidden md:block !bg-white !border-2 !border-primary !rounded-xl !shadow-[2px_3px_0_0_#21295a]" />
        </ReactFlow>

        {/* Helper Floating Badge (Hidden on small mobile screens to prevent obscuring canvas) */}
        <div className="hidden sm:flex absolute top-3 right-3 bg-white/95 border-2 border-primary rounded-xl px-3 py-1.5 text-[11px] font-bold text-slate-700 shadow-[2px_2px_0_0_#21295a] items-center gap-2 max-w-lg z-10">
          <HelpCircle className="w-4 h-4 text-secondary flex-shrink-0" />
          <span>
            <strong>راهنمای مهارت:</strong> گره‌ها از بالا به پایین بر اساس پیش‌نیاز مرتب شده‌اند. برای اتصال، دایره خروجی (پایین) را به ورودی (بالا) وصل کنید.
          </span>
        </div>
      </div>

      {/* MODAL 1: CREATE ROADMAP */}
      {showCreateRoadmapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-xs">
          <div className="box-pattern bg-white border-2 border-primary rounded-3xl w-full max-w-lg shadow-[8px_10px_0_0_#21295a] overflow-hidden text-right">
            <div className="p-5 bg-bg-lavender border-b-2 border-primary flex items-center justify-between">
              <h3 className="font-black text-lg text-primary">ساخت مسیر یادگیری جدید</h3>
              <button
                type="button"
                onClick={() => setShowCreateRoadmapModal(false)}
                className="p-1 rounded-lg border border-primary hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoadmap} className="p-5 space-y-4">
              <div>
                <label className="block font-bold text-xs text-primary mb-1">عنوان مسیر *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: توسعه‌دهنده هوش مصنوعی و داده"
                  value={newRmTitle}
                  onChange={(e) => {
                    setNewRmTitle(e.target.value);
                    if (!newRmSlug) {
                      setNewRmSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/\s+/g, '-')
                          .replace(/[^a-z0-9-]/g, ''),
                      );
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-primary text-xs font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-xs text-primary mb-1">نامک یکتا (Slug) *</label>
                <input
                  type="text"
                  required
                  placeholder="ai-data-developer"
                  value={newRmSlug}
                  onChange={(e) => setNewRmSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-primary text-xs font-mono ltr text-left"
                />
              </div>

              <div>
                <label className="block font-bold text-xs text-primary mb-1">دپارتمان</label>
                <select
                  value={newRmDept}
                  onChange={(e: any) => setNewRmDept(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-primary text-xs font-bold"
                >
                  <option value="ENGINEERS">مهندسی و برنامه‌نویسی (ENGINEERS)</option>
                  <option value="ARTISTS">آرتیست‌ها و رسانه (ARTISTS)</option>
                  <option value="OPS">آچارفرانسه و عملیات (OPS)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-xs text-primary mb-1">توضیحات مسیر</label>
                <textarea
                  rows={3}
                  placeholder="اهداف مسیر و مأموریت‌های باشگاه در این نقش..."
                  value={newRmDesc}
                  onChange={(e) => setNewRmDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-primary text-xs"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateRoadmapModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-black shadow-[2px_3px_0_0_#58bdaf] cursor-pointer"
                >
                  ایجاد مسیر
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT ROADMAP DETAILS */}
      {showEditRoadmapModal && currentRoadmap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-xs">
          <div className="box-pattern bg-white border-2 border-primary rounded-3xl w-full max-w-lg shadow-[8px_10px_0_0_#21295a] overflow-hidden text-right">
            <div className="p-5 bg-bg-lavender border-b-2 border-primary flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-secondary-dark block">
                  تنظیمات و متادیتا
                </span>
                <h3 className="font-black text-lg text-primary">ویرایش مشخصات مسیر یادگیری</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowEditRoadmapModal(false)}
                className="p-1 rounded-lg border border-primary hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateRoadmap} className="p-5 space-y-4">
              <div>
                <label className="block font-bold text-xs text-primary mb-1">عنوان مسیر *</label>
                <input
                  type="text"
                  required
                  value={editRmTitle}
                  onChange={(e) => setEditRmTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-primary text-xs font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-xs text-primary mb-1">نامک یکتا (Slug) *</label>
                <input
                  type="text"
                  required
                  value={editRmSlug}
                  onChange={(e) => setEditRmSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-primary text-xs font-mono ltr text-left"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-xs text-primary mb-1">دپارتمان</label>
                  <select
                    value={editRmDept}
                    onChange={(e: any) => setEditRmDept(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-primary text-xs font-bold"
                  >
                    <option value="ENGINEERS">مهندسی (ENGINEERS)</option>
                    <option value="ARTISTS">آرتیست‌ها (ARTISTS)</option>
                    <option value="OPS">عملیات (OPS)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-xs text-primary mb-1">وضعیت انتشار</label>
                  <select
                    value={editRmStatus}
                    onChange={(e: any) => setEditRmStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-primary text-xs font-bold"
                  >
                    <option value="DRAFT">پیش‌نویس (DRAFT)</option>
                    <option value="PUBLISHED">منتشر شده (PUBLISHED)</option>
                    <option value="ARCHIVED">بایگانی شده (ARCHIVED)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-xs text-primary mb-1">توضیحات مسیر</label>
                <textarea
                  rows={3}
                  value={editRmDesc}
                  onChange={(e) => setEditRmDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-primary text-xs leading-relaxed"
                />
              </div>

              <div className="pt-4 border-t flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleDeleteRoadmap}
                  className="px-3 py-2 rounded-xl border-2 border-rose-500 text-rose-600 font-bold text-xs hover:bg-rose-50 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  حذف کامل مسیر
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEditRoadmapModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold cursor-pointer"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-black shadow-[2px_3px_0_0_#58bdaf] cursor-pointer"
                  >
                    ذخیره تغییرات
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: NODE & PREREQUISITE & RESOURCE EDITOR */}
      {editingNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-xs overflow-y-auto">
          <div className="box-pattern bg-white border-2 border-primary rounded-3xl w-full max-w-2xl shadow-[8px_10px_0_0_#21295a] overflow-hidden text-right my-8">
            <div className="p-5 bg-bg-lavender border-b-2 border-primary flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-secondary-dark block">
                  {isNewNode ? 'افزودن گره مهارتی جدید' : 'ویرایش گره و تنظیمات مهارت'}
                </span>
                <h3 className="font-black text-lg text-primary">
                  {isNewNode ? 'گره جدید در مسیر' : editingNode.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingNode(null)}
                className="p-1.5 rounded-xl border-2 border-primary bg-white hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Basic Fields */}
              <form onSubmit={handleSaveNode} className="space-y-4">
                <div>
                  <label className="block font-bold text-xs text-primary mb-1">عنوان مهارت / گره *</label>
                  <input
                    type="text"
                    required
                    value={nodeTitle}
                    onChange={(e) => setNodeTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-primary text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-xs text-primary mb-1">توضیحات و اهداف یادگیری</label>
                  <textarea
                    rows={3}
                    value={nodeDesc}
                    onChange={(e) => setNodeDesc(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-primary text-xs leading-relaxed"
                  />
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-bg-mint border border-secondary/30">
                  <input
                    type="checkbox"
                    id="hasDeliv"
                    checked={nodeHasDeliverable}
                    onChange={(e) => setNodeHasDeliverable(e.target.checked)}
                    className="w-4 h-4 rounded border-primary text-secondary focus:ring-secondary"
                  />
                  <label htmlFor="hasDeliv" className="text-xs font-bold text-primary cursor-pointer">
                    دارای مأموریت و تمرین ارسالی (اگر تیک برداشته شود، گره صرفاً مطالعه آزاد بوده و بدون سابمیشن تمرین انجام می‌شود)
                  </label>
                </div>

                <div className="flex items-center justify-between pt-2">
                  {!isNewNode && (
                    <button
                      type="button"
                      onClick={() => handleDeleteNode(editingNode.id)}
                      className="px-3 py-2 rounded-xl border-2 border-rose-500 text-rose-600 font-bold text-xs hover:bg-rose-50 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      حذف کامل این گره
                    </button>
                  )}

                  <button
                    type="submit"
                    className="mr-auto px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-black shadow-[3px_4px_0_0_#58bdaf] hover:-translate-y-0.5 transition-transform cursor-pointer"
                  >
                    {isNewNode ? 'ایجاد گره جدید' : 'ذخیره مشخصات گره'}
                  </button>
                </div>
              </form>

              {/* Prerequisites Manager (Only for existing node) */}
              {!isNewNode && (
                <div className="pt-4 border-t-2 border-slate-100">
                  <h4 className="font-extrabold text-xs text-primary mb-3 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-secondary" />
                    مدیریت پیش‌نیازهای این گره
                  </h4>

                  {/* List of current prerequisites */}
                  <div className="space-y-2 mb-3">
                    {editingNode.prerequisites?.length === 0 ? (
                      <p className="text-[11px] text-slate-400">این گره ریشه است و هیچ پیش‌نیازی ندارد.</p>
                    ) : (
                      editingNode.prerequisites?.map((p: any) => {
                        const prereqNode = currentRoadmap?.nodes?.find(
                          (n: any) => n.id === p.prerequisiteNodeId,
                        );
                        return (
                          <div
                            key={p.prerequisiteNodeId}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                          >
                            <span className="font-bold text-primary">
                              {prereqNode?.title || p.prerequisiteNodeId}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemovePrereq(p.prerequisiteNodeId)}
                              className="text-rose-600 hover:text-rose-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              قطع اتصال
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Add prerequisite dropdown */}
                  <div className="flex gap-2">
                    <select
                      value={selectedPrereqId}
                      onChange={(e) => setSelectedPrereqId(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-primary text-xs font-bold"
                    >
                      <option value="">-- افزودن گره پیش‌نیاز جدید --</option>
                      {currentRoadmap?.nodes
                        ?.filter((n: any) => n.id !== editingNode.id)
                        ?.map((n: any) => (
                          <option key={n.id} value={n.id}>
                            {n.title}
                          </option>
                        ))}
                    </select>

                    <button
                      type="button"
                      onClick={handleAddPrereqInEditor}
                      disabled={!selectedPrereqId}
                      className="px-4 py-2 rounded-xl bg-secondary text-white text-xs font-bold shadow-[2px_2px_0_0_#21295a] disabled:opacity-50 cursor-pointer"
                    >
                      افزودن پیش‌نیاز
                    </button>
                  </div>
                </div>
              )}

              {/* Resources Manager (Only for existing node) */}
              {!isNewNode && (
                <div className="pt-4 border-t-2 border-slate-100">
                  <h4 className="font-extrabold text-xs text-primary mb-3 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-tertiary" />
                    منابع یادگیری و شرح مأموریت ({editingNode.resources?.length || 0})
                  </h4>

                  {/* Existing resources */}
                  <div className="space-y-2 mb-4">
                    {editingNode.resources?.map((res: any) => (
                      <div
                        key={res.id}
                        className="p-3 rounded-xl bg-bg-mint/40 border border-secondary/30 flex items-start justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="font-bold text-primary flex items-center gap-1.5">
                            {res.type === 'LINK' && <LinkIcon className="w-3.5 h-3.5 text-secondary" />}
                            {res.type === 'VIDEO_URL' && <Video className="w-3.5 h-3.5 text-accent" />}
                            {res.type === 'MARKDOWN_TEXT' && <FileText className="w-3.5 h-3.5 text-tertiary" />}
                            {res.title}
                          </div>
                          <p className="text-[11px] text-slate-500 truncate max-w-md">
                            {res.content}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteResource(res.id)}
                          className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                          title="حذف منبع"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add New Resource Form */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <span className="text-[11px] font-bold text-primary block">افزودن منبع یا مأموریت جدید:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="عنوان منبع (مثال: ویدیوی راهنمای پروژه)"
                        value={resTitle}
                        onChange={(e) => setResTitle(e.target.value)}
                        className="px-3 py-2 rounded-xl border border-primary text-xs font-bold"
                      />
                      <select
                        value={resType}
                        onChange={(e: any) => setResType(e.target.value)}
                        className="px-3 py-2 rounded-xl border border-primary text-xs font-bold"
                      >
                        <option value="LINK">لینک اینترنتی (LINK)</option>
                        <option value="VIDEO_URL">ویدیوی آموزشی (VIDEO_URL)</option>
                        <option value="MARKDOWN_TEXT">متن و مأموریت تفصیلی (MARKDOWN)</option>
                        <option value="FILE">فایل دانلودی (FILE)</option>
                      </select>
                    </div>

                    <textarea
                      rows={2}
                      placeholder={
                        resType === 'MARKDOWN_TEXT'
                          ? 'متن مأموریت، چک‌لیست انتظارات و توضیحات پروژه...'
                          : 'آدرس URL یا مسیر فایل...'
                      }
                      value={resContent}
                      onChange={(e) => setResContent(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-primary text-xs"
                    />

                    <button
                      type="button"
                      onClick={handleAddResource}
                      disabled={!resTitle.trim() || !resContent.trim()}
                      className="px-4 py-2 rounded-xl bg-tertiary text-white text-xs font-bold shadow-[2px_2px_0_0_#21295a] disabled:opacity-50 cursor-pointer"
                    >
                      ثبت و افزودن منبع
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
