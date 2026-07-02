import React, { useState } from "react";
import { Task, ColumnType } from "../hooks/useKanbanData";
import { FlagIcon, CommentIcon, AttachmentIcon, LightningIcon } from "./Icons";

interface KanbanCardProps {
  task: Task;
  index: number;
  onDelete: (id: string) => void;
  onEdit?: (task: Task) => void;
  onMoveTask?: (taskId: string, targetColumn: ColumnType) => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  task,
  index,
  onDelete,
  onEdit,
  onMoveTask,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData("text/plain", task.id);
    e.dataTransfer.effectAllowed = "move";
    
    setTimeout(() => {
      const el = document.getElementById(`card-${task.id}`);
      if (el) el.classList.add("card-dragging");
    }, 0);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    const el = document.getElementById(`card-${task.id}`);
    if (el) el.classList.remove("card-dragging");
  };

  const getPriorityConfig = () => {
    switch (task.priority) {
      case "low":
        return {
          bg: "bg-[#E0F2FE] text-[#0284C7]",
          icon: <LightningIcon className="w-3.5 h-3.5 fill-[#0284C7] shrink-0" />,
          label: "Low",
        };
      case "medium":
        return {
          bg: "bg-[#F3E8FF] text-[#7C3AED]",
          icon: <LightningIcon className="w-3.5 h-3.5 fill-[#7C3AED] shrink-0" />,
          label: "Medium",
        };
      case "high":
        return {
          bg: "bg-[#FEE2E2] text-[#DC2626]",
          icon: <FlagIcon className="w-3.5 h-3.5 shrink-0" />,
          label: "High",
        };
    }
  };

  const priority = getPriorityConfig();

  return (
    <div
      id={`card-${task.id}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`group relative bg-white border border-[#ECEEF0] rounded-xl p-4.5 shadow-sm hover:shadow-md hover:border-[#D1D5DB] transition-all duration-200 cursor-grab active:cursor-grabbing animate-card-fade-in`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold select-none ${priority.bg}`}>
            {priority.icon}
            <span>{priority.label}</span>
          </div>

          <div className="flex items-center gap-1">
            {task.column !== "todo" && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const prevCol = task.column === "completed" ? "progress" : "todo";
                  onMoveTask?.(task.id, prevCol);
                }}
                title="Move to previous column"
                className="w-5 h-5 rounded-md bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-400 hover:text-brand-primary flex items-center justify-center cursor-pointer transition-colors"
              >
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
            )}
            {task.column !== "completed" && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const nextCol = task.column === "todo" ? "progress" : "completed";
                  onMoveTask?.(task.id, nextCol);
                }}
                title="Move to next column"
                className="w-5 h-5 rounded-md bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-400 hover:text-brand-primary flex items-center justify-center cursor-pointer transition-colors"
              >
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#8E95A2] select-none font-medium">
          <FlagIcon className="w-3.5 h-3.5 text-[#8E95A2]" />
          <span>{task.dueDate}</span>
        </div>
      </div>

      <div className="mb-3 space-y-1.5 cursor-pointer" onClick={() => onEdit?.(task)}>
        <h4 className="text-[15px] font-semibold text-[#1A1C1E] tracking-tight leading-snug group-hover:text-brand-primary transition-colors">
          {task.title}
        </h4>
        <p className="text-sm text-[#5C6370] leading-relaxed line-clamp-2">
          {task.description}
        </p>
      </div>

      <div className="border-t border-[#F1F3F5] my-3" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-[#8E95A2] font-semibold select-none">
          <div className="flex items-center gap-1">
            <CommentIcon className="w-3.5 h-3.5" />
            <span>{task.commentsCount}</span>
          </div>
          {task.attachmentsCount > 0 && (
            <div className="flex items-center gap-1">
              <AttachmentIcon className="w-3.5 h-3.5" />
              <span>{task.attachmentsCount}</span>
            </div>
          )}
        </div>

        <div className="flex items-center -space-x-1.5 select-none">
          {task.assignees.map((assignee, idx) => (
            <div
              key={`${assignee.name}-${idx}`}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold border-2 border-white ring-1 ring-black/5 shrink-0 uppercase tracking-tighter ${assignee.color}`}
              title={assignee.name}
            >
              {assignee.initials}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center gap-1.5">
        {showDeleteConfirm ? (
          <div className="flex items-center bg-white border border-red-200 rounded-lg shadow-lg overflow-hidden py-0.5 px-1.5 gap-1.5 text-[10px] font-semibold z-10">
            <span className="text-red-600">Delete?</span>
            <button
              onClick={() => {
                onDelete(task.id);
                setShowDeleteConfirm(false);
              }}
              className="text-red-700 bg-red-50 hover:bg-red-100 px-1 rounded cursor-pointer"
            >
              Yes
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="text-gray-500 hover:bg-gray-100 px-1 rounded cursor-pointer"
            >
              No
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteConfirm(true);
            }}
            title="Delete task"
            className="w-6 h-6 rounded-full bg-white border border-[#E5E7EB] text-gray-400 hover:text-red-500 hover:border-red-200 flex items-center justify-center shadow-sm cursor-pointer hover:bg-red-50 transition-colors"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
