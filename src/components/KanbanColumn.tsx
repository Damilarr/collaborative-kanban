import React, { useState } from "react";
import { Task, ColumnType } from "../hooks/useKanbanData";
import { KanbanCard } from "./KanbanCard";
import { ThreeDotsIcon } from "./Icons";

interface KanbanColumnProps {
  title: string;
  columnType: ColumnType;
  tasks: Task[];
  onDropTask: (taskId: string, targetColumn: ColumnType) => void;
  onDeleteTask: (id: string) => void;
  onEditTask?: (task: Task) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  columnType,
  tasks,
  onDropTask,
  onDeleteTask,
  onEditTask,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId) {
      onDropTask(taskId, columnType);
    }
  };

  // Get dot color for column headers
  const getDotClass = () => {
    switch (columnType) {
      case "todo":
        return "bg-[#C0C2C5]";
      case "progress":
        return "bg-[#F39C12]";
      case "completed":
        return "bg-[#2ECC71]";
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col bg-[#FAFBFB] rounded-2xl border border-[#ECEEF0] p-4.5 max-h-[calc(100vh-250px)] min-h-[500px] flex-shrink-0 w-[85vw] sm:w-[320px] md:w-auto snap-center transition-all duration-200 ${
        isDragOver ? "drag-over" : ""
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#F1F3F5] select-none">
        <div className="flex items-center gap-2">
          {/* Dot */}
          <span className={`w-2 h-2 rounded-full ${getDotClass()}`} />
          {/* Title */}
          <h3 className="font-semibold text-[15px] text-[#1A1C1E]">{title}</h3>
          {/* Count Badge */}
          <span className="w-5 h-5 rounded-full border border-brand-border bg-brand-light text-brand-primary text-[11px] font-bold flex items-center justify-center">
            {tasks.length}
          </span>
        </div>
        
        {/* Actions Menu */}
        <button
          type="button"
          className="text-[#8E95A2] hover:text-[#1A1C1E] hover:bg-gray-100 p-1 rounded-lg transition-colors cursor-pointer"
          title="Column options"
        >
          <ThreeDotsIcon size={18} />
        </button>
      </div>

      {/* Task Cards Container */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 no-scrollbar min-h-[100px]">
        {tasks.length === 0 ? (
          <div className="h-full min-h-[120px] border border-dashed border-[#E5E7EB] rounded-xl flex flex-col items-center justify-center p-4 text-center select-none text-gray-400 group/empty">
            <svg
              className="w-8 h-8 text-gray-300 group-hover/empty:text-brand-primary/45 transition-colors mb-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="9" y1="9" x2="15" y2="9" />
              <line x1="9" y1="13" x2="15" y2="13" />
              <line x1="9" y1="17" x2="13" y2="17" />
            </svg>
            <p className="text-xs font-medium">Drop tasks here</p>
          </div>
        ) : (
          tasks.map((task, idx) => (
            <KanbanCard
              key={task.id}
              task={task}
              index={idx}
              onDelete={onDeleteTask}
              onEdit={onEditTask}
            />
          ))
        )}
      </div>
    </div>
  );
};
