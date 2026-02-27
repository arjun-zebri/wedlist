"use client";

import { useRouter } from "next/navigation";
import {
  Mail,
  Phone,
  MoreHorizontal,
  Plus,
  Search,
  LayoutGrid,
  List,
  Users,
  TrendingUp,
  BarChart3,
  AlertCircle,
  Calendar,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { useState, useMemo } from "react";
import CustomSelect from "@/components/CustomSelect";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  closestCorners,
  useDroppable,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

const PIPELINE_STAGES = [
  "prospect",
  "trial",
  "listed",
  "active",
  "churned",
] as const;

type Stage = (typeof PIPELINE_STAGES)[number];

const STAGE_LABELS: Record<Stage, string> = {
  prospect: "Prospect",
  trial: "Trial",
  listed: "Listed",
  active: "Active",
  churned: "Churned",
};

const STAGE_BADGE_COLORS: Record<Stage, string> = {
  prospect: "bg-gray-100 text-gray-700",
  trial: "bg-blue-100 text-blue-700",
  listed: "bg-amber-100 text-amber-700",
  active: "bg-green-100 text-green-700",
  churned: "bg-red-100 text-red-700",
};

const LISTING_STATUS_COLORS: Record<string, string> = {
  free: "bg-gray-50 text-gray-600",
  trial: "bg-blue-50 text-blue-600",
  paid: "bg-green-50 text-green-600",
  expired: "bg-red-50 text-red-600",
};

// Sample MC data
const MC_DATA: Record<Stage, MC[]> = {
  prospect: [
    {
      id: 1,
      name: "Emma Williams",
      email: "emma@example.com",
      phone: "0412 345 678",
      mRR: null,
      listingStatus: "free",
      lastOutreach: "2025-02-20",
    },
    {
      id: 2,
      name: "David Lee",
      email: "david@example.com",
      phone: "0412 345 679",
      mRR: null,
      listingStatus: "free",
      lastOutreach: "2025-02-18",
    },
  ],
  trial: [
    {
      id: 3,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "0412 345 680",
      mRR: null,
      listingStatus: "trial",
      lastOutreach: "2025-02-22",
    },
  ],
  listed: [
    {
      id: 4,
      name: "Marcus Chen",
      email: "marcus@example.com",
      phone: "0412 345 681",
      mRR: 0,
      listingStatus: "free",
      lastOutreach: "2025-02-15",
    },
    {
      id: 5,
      name: "Lisa Anderson",
      email: "lisa@example.com",
      phone: "0412 345 682",
      mRR: 0,
      listingStatus: "free",
      lastOutreach: "2025-02-10",
    },
  ],
  active: [
    {
      id: 6,
      name: "James Brown",
      email: "james@example.com",
      phone: "0412 345 683",
      mRR: 150,
      listingStatus: "paid",
      lastOutreach: "2025-02-25",
    },
    {
      id: 7,
      name: "Victoria Smith",
      email: "victoria@example.com",
      phone: "0412 345 684",
      mRR: 200,
      listingStatus: "paid",
      lastOutreach: "2025-02-24",
    },
    {
      id: 8,
      name: "Robert Taylor",
      email: "robert@example.com",
      phone: "0412 345 685",
      mRR: 100,
      listingStatus: "paid",
      lastOutreach: "2025-02-23",
    },
  ],
  churned: [
    {
      id: 9,
      name: "Michael Davis",
      email: "michael@example.com",
      phone: "0412 345 686",
      mRR: 0,
      listingStatus: "expired",
      lastOutreach: "2025-01-30",
    },
  ],
};

interface MC {
  id: number;
  name: string;
  email: string;
  phone: string;
  mRR: number | null;
  listingStatus: string;
  lastOutreach: string;
}

// Flatten all MCs with their stage for list view
function getAllMCs(): (MC & { stage: Stage })[] {
  const all: (MC & { stage: Stage })[] = [];
  for (const stage of PIPELINE_STAGES) {
    for (const mc of MC_DATA[stage]) {
      all.push({ ...mc, stage });
    }
  }
  return all;
}

// ──────────────────────────────────────
// KPI Summary
// ──────────────────────────────────────
function KPISummary() {
  const allMCs = getAllMCs();
  const totalMCs = allMCs.length;
  const activeCount = MC_DATA.active.length;
  const totalMRR = allMCs.reduce((sum, mc) => sum + (mc.mRR ?? 0), 0);
  const churnedCount = MC_DATA.churned.length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div className="rounded-lg bg-white p-3 shadow-[0_1px_2px_rgba(227,28,95,0.08)] border border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
            <Users className="w-4 h-4 text-gray-600" />
          </div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide truncate">
            Total MCs
          </p>
        </div>
        <p className="text-lg font-bold text-gray-900 flex-shrink-0">{totalMCs}</p>
      </div>

      <div className="rounded-lg bg-white p-3 shadow-[0_1px_2px_rgba(227,28,95,0.08)] border border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide truncate">
            Active
          </p>
        </div>
        <p className="text-lg font-bold text-gray-900 flex-shrink-0">{activeCount}</p>
      </div>

      <div className="rounded-lg bg-white p-3 shadow-[0_1px_2px_rgba(227,28,95,0.08)] border border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
            <BarChart3 className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide truncate">
            MRR
          </p>
        </div>
        <p className="text-lg font-bold text-gray-900 flex-shrink-0">
          ${totalMRR.toLocaleString()}
        </p>
      </div>

      <div className="rounded-lg bg-white p-3 shadow-[0_1px_2px_rgba(227,28,95,0.08)] border border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide truncate">
            Churned
          </p>
        </div>
        <p className="text-lg font-bold text-gray-900 flex-shrink-0">{churnedCount}</p>
      </div>
    </div>
  );
}

// ──────────────────────────────────────
// Kanban Card
// ──────────────────────────────────────
function DraggableMCCard({ mc, stage }: { mc: MC; stage: Stage }) {
  const router = useRouter();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `mc-${mc.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => router.push(`/super-admin/crm/mcs/${mc.id}/edit`)}
      className={`rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(227,28,95,0.08)] hover:shadow-[0_6px_16px_rgba(227,28,95,0.15)] hover:-translate-y-1 transition-all group cursor-pointer border border-gray-100 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate group-hover:text-[#E31C5F]">
            {mc.name}
          </p>
          <div
            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-2 ${
              LISTING_STATUS_COLORS[mc.listingStatus] ||
              "bg-gray-100 text-gray-700"
            }`}
          >
            {mc.listingStatus}
          </div>
        </div>
        <button
          className="p-1 rounded-lg hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="space-y-1.5 text-sm mb-3">
        <div className="flex items-center gap-2 text-gray-600 truncate">
          <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className="truncate text-xs">{mc.email}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className="text-xs">{mc.phone}</span>
        </div>
      </div>

      {mc.mRR !== null && mc.mRR > 0 && (
        <div className="pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">MRR</p>
          <p className="text-base font-bold text-green-600">${mc.mRR}/mo</p>
        </div>
      )}

      {mc.lastOutreach && (
        <div
          className={`flex items-center gap-1.5 text-xs mt-2 ${
            mc.mRR !== null && mc.mRR > 0 ? "" : "pt-3 border-t border-gray-100"
          }`}
        >
          <Calendar className="w-3 h-3 text-gray-400" />
          <span className="text-gray-500">
            Last outreach:{" "}
            {new Date(mc.lastOutreach).toLocaleDateString("en-AU", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────
// Kanban Column
// ──────────────────────────────────────
function KanbanColumn({ stage, mcs }: { stage: Stage; mcs: MC[] }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `stage-${stage}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col gap-4 transition-colors ${
        isOver ? "bg-rose-50/30 rounded-lg p-2" : ""
      }`}
    >
      <div className="sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                stage === "prospect"
                  ? "bg-gray-400"
                  : stage === "trial"
                  ? "bg-blue-400"
                  : stage === "listed"
                  ? "bg-amber-400"
                  : stage === "active"
                  ? "bg-green-400"
                  : "bg-red-400"
              }`}
            />
            <h3 className="font-semibold text-gray-900 uppercase text-xs tracking-wide">
              {STAGE_LABELS[stage]}
            </h3>
          </div>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {mcs.length}
          </span>
        </div>
      </div>

      {mcs.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center flex flex-col items-center justify-center min-h-[200px]">
          <p className="text-sm text-gray-400">No MCs in this stage</p>
        </div>
      ) : (
        <div className="space-y-3">
          <SortableContext
            items={mcs.map((mc) => `mc-${mc.id}`)}
            strategy={verticalListSortingStrategy}
          >
            {mcs.map((mc) => (
              <DraggableMCCard key={mc.id} mc={mc} stage={stage} />
            ))}
          </SortableContext>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────
// List View Table Row
// ──────────────────────────────────────
function MCListRow({ mc }: { mc: MC & { stage: Stage } }) {
  const stage = mc.stage;
  const router = useRouter();

  return (
    <tr
      onClick={() => router.push(`/super-admin/crm/mcs/${mc.id}/edit`)}
      className="border-b border-gray-100 hover:bg-rose-50/30 cursor-pointer transition-colors group"
    >
      <td className="py-3.5 px-4">
        <p className="font-medium text-gray-900 group-hover:text-[#E31C5F] transition-colors">
          {mc.name}
        </p>
      </td>
      <td className="py-3.5 px-4">
        <span className="text-sm text-gray-600">{mc.email}</span>
      </td>
      <td className="py-3.5 px-4">
        <span className="text-sm text-gray-600">{mc.phone}</span>
      </td>
      <td className="py-3.5 px-4">
        <span
          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${STAGE_BADGE_COLORS[stage]}`}
        >
          {STAGE_LABELS[stage]}
        </span>
      </td>
      <td className="py-3.5 px-4">
        <span
          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
            LISTING_STATUS_COLORS[mc.listingStatus] ||
            "bg-gray-100 text-gray-700"
          }`}
        >
          {mc.listingStatus}
        </span>
      </td>
      <td className="py-3.5 px-4 text-right">
        <span
          className={`text-sm font-semibold ${
            mc.mRR && mc.mRR > 0 ? "text-green-600" : "text-gray-400"
          }`}
        >
          {mc.mRR && mc.mRR > 0 ? `$${mc.mRR}/mo` : "—"}
        </span>
      </td>
      <td className="py-3.5 px-4 text-right">
        <span className="text-xs text-gray-500">
          {mc.lastOutreach
            ? new Date(mc.lastOutreach).toLocaleDateString("en-AU", {
                month: "short",
                day: "numeric",
              })
            : "—"}
        </span>
      </td>
    </tr>
  );
}

// ──────────────────────────────────────
// Main Page
// ──────────────────────────────────────
export default function CRMPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<Stage | "all">("all");
  const [mcData, setMcData] = useState(MC_DATA);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [draggedMC, setDraggedMC] = useState<(MC & { stage: Stage }) | null>(null);

  const allMCs = useMemo(() => {
    const all: (MC & { stage: Stage })[] = [];
    for (const stage of PIPELINE_STAGES) {
      for (const mc of mcData[stage]) {
        all.push({ ...mc, stage });
      }
    }
    return all;
  }, [mcData]);

  const filteredMCs = useMemo(() => {
    return allMCs.filter((mc) => {
      if (stageFilter !== "all" && mc.stage !== stageFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          mc.name.toLowerCase().includes(q) ||
          mc.email.toLowerCase().includes(q) ||
          mc.phone.includes(q)
        );
      }
      return true;
    });
  }, [allMCs, stageFilter, searchQuery]);

  // For kanban, group filtered MCs by stage
  const filteredByStage = useMemo(() => {
    const result: Record<Stage, MC[]> = {
      prospect: [],
      trial: [],
      listed: [],
      active: [],
      churned: [],
    };
    for (const mc of filteredMCs) {
      result[mc.stage].push(mc);
    }
    return result;
  }, [filteredMCs]);

  // Handle drag end - move MC to new stage
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);
    setDraggedMC(null);

    if (!over) return;

    const draggedId = active.id as string;
    const mcId = parseInt(draggedId.replace("mc-", ""));
    const overId = over.id as string;

    // Determine source and target stages
    let sourceStage: Stage | null = null;
    let targetStage: Stage | null = null;
    let draggedMC: MC | null = null;

    // Find the MC and source stage
    for (const stage of PIPELINE_STAGES) {
      const mc = mcData[stage].find((m) => m.id === mcId);
      if (mc) {
        draggedMC = mc;
        sourceStage = stage;
        break;
      }
    }

    // Find target stage from drop zone ID
    if (overId.startsWith("stage-")) {
      targetStage = overId.replace("stage-", "") as Stage;
    } else if (overId.startsWith("mc-")) {
      // Dropped on another MC, find its stage
      const targetMcId = parseInt(overId.replace("mc-", ""));
      for (const stage of PIPELINE_STAGES) {
        if (mcData[stage].find((m) => m.id === targetMcId)) {
          targetStage = stage;
          break;
        }
      }
    }

    // Move MC to target stage if different
    if (
      draggedMC &&
      sourceStage &&
      targetStage &&
      sourceStage !== targetStage
    ) {
      const newMcData = { ...mcData };

      // Remove from source stage
      newMcData[sourceStage] = newMcData[sourceStage].filter(
        (m) => m.id !== mcId
      );

      // Add to target stage
      newMcData[targetStage] = [...newMcData[targetStage], draggedMC];

      setMcData(newMcData);
    }
  };

  return (
    <div className="flex flex-col h-full gap-0">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 space-y-6 pb-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-1">
              MC Pipeline
            </h1>
            <p className="text-gray-500 text-sm">
              Track, manage, and convert MCs through your sales pipeline
            </p>
          </div>
          <button
            onClick={() => router.push("/super-admin/crm/mcs/new")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E31C5F] text-white text-sm font-semibold hover:bg-[#C4184F] transition-colors shadow-[0_2px_8px_rgba(227,28,95,0.25)]"
          >
            <Plus className="w-4 h-4" />
            Add MC
          </button>
        </div>

        {/* KPI Summary */}
        <KPISummary />

        {/* Toolbar: Search + Filters + View Toggle */}
        <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or phone..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm shadow-sm transition-colors focus:border-[#E31C5F] focus:outline-none focus:ring-2 focus:ring-[#E31C5F]/20"
            />
          </div>

          {/* Controls Group - Stage Filter + View Toggle */}
          <div className="flex gap-3 w-full lg:w-auto flex-shrink-0">
            {/* Stage Filter */}
            <div className="flex-1 lg:w-48">
              <CustomSelect
                value={stageFilter}
                onChange={(value) => setStageFilter(value as Stage | "all")}
                options={[
                  { value: "all", label: "All Stages" },
                  ...PIPELINE_STAGES.map((s) => ({
                    value: s,
                    label: STAGE_LABELS[s],
                  })),
                ]}
              />
            </div>

            {/* View Toggle */}
            <div className="flex rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex-shrink-0">
              <button
                onClick={() => setViewMode("kanban")}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${
                  viewMode === "kanban"
                    ? "bg-[#E31C5F] text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                Board
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${
                  viewMode === "list"
                    ? "bg-[#E31C5F] text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <List className="w-4 h-4" />
                List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-auto hide-scrollbar">
        {/* Kanban View */}
        {viewMode === "kanban" && (
          <DndContext
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
            onDragStart={(event) => {
              const draggedId = event.active.id as string;
              setActiveDragId(draggedId);

              // Find and set the dragged MC
              const mcId = parseInt(draggedId.replace("mc-", ""));
              for (const stage of PIPELINE_STAGES) {
                const mc = mcData[stage].find((m) => m.id === mcId);
                if (mc) {
                  setDraggedMC({ ...mc, stage });
                  break;
                }
              }
            }}
          >
            <div className="overflow-x-auto hide-scrollbar">
              <div
                className="inline-flex gap-6 pb-4"
                style={{ minWidth: stageFilter === "all" ? "1800px" : "100%" }}
              >
                {(stageFilter === "all" ? PIPELINE_STAGES : [stageFilter]).map(
                  (stage) => (
                    <div key={stage} className="flex-shrink-0 w-80">
                      <KanbanColumn
                        stage={stage}
                        mcs={filteredByStage[stage]}
                      />
                    </div>
                  )
                )}
              </div>
            </div>
            <DragOverlay>
              {draggedMC ? (
                <div className="rounded-2xl bg-white p-4 shadow-[0_6px_20px_rgba(227,28,95,0.25)] border border-gray-100 w-80 cursor-grabbing">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {draggedMC.name}
                      </p>
                      <div
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-2 ${
                          LISTING_STATUS_COLORS[draggedMC.listingStatus] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {draggedMC.listingStatus}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-sm mb-3">
                    <div className="flex items-center gap-2 text-gray-600 truncate">
                      <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span className="truncate text-xs">{draggedMC.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span className="text-xs">{draggedMC.phone}</span>
                    </div>
                  </div>

                  {draggedMC.mRR !== null && draggedMC.mRR > 0 && (
                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500">MRR</p>
                      <p className="text-base font-bold text-green-600">
                        ${draggedMC.mRR}/mo
                      </p>
                    </div>
                  )}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}

        {/* List View */}
        {viewMode === "list" && (
          <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(227,28,95,0.08)] border border-gray-100 overflow-auto hide-scrollbar flex-1 flex flex-col">
            {filteredMCs.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-400">No MCs match your search</p>
              </div>
            ) : (
              <div className="overflow-auto hide-scrollbar flex-1">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/50">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Phone
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Stage
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Listing
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        MRR
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Last Outreach
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMCs.map((mc) => (
                      <MCListRow key={mc.id} mc={mc} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between text-xs text-gray-500">
              <p>
                {filteredMCs.length} MC{filteredMCs.length !== 1 ? "s" : ""}{" "}
                total
              </p>
              <p>
                MRR:{" "}
                <span className="font-semibold text-green-600">
                  $
                  {filteredMCs
                    .reduce((s, mc) => s + (mc.mRR ?? 0), 0)
                    .toLocaleString()}
                  /mo
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
