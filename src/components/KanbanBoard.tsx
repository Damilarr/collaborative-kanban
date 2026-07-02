import React, { useState, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Task, ColumnType, Priority } from "../hooks/useKanbanData";
import { KanbanColumn } from "./KanbanColumn";
import { SearchIcon, FilterIcon, SortIcon, PlusIcon, LiveToggleIcon, BoardTabIcon, ListTabIcon, TableTabIcon } from "./Icons";

interface KanbanBoardProps {
  tasks: Task[];
  onDropTask: (taskId: string, targetColumn: ColumnType) => void;
  onDeleteTask: (id: string) => void;
  onResetBoard: () => void;
  onOpenMobileSidebar?: () => void;
}

type SortOption = "none" | "title" | "dueDate" | "priority" | "comments";

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onDropTask,
  onDeleteTask,
  onResetBoard,
  onOpenMobileSidebar,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<"all" | Priority>("all");
  const [sortBy, setSortBy] = useState<SortOption>("none");
  const [activeTab, setActiveTab] = useState<"board" | "list" | "table">("board");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleOpenCreateModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("modal", "create-task");
    router.push(pathname + "?" + params.toString());
  };

  const handleOpenEditModal = (task: Task) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("modal", "edit-task");
    params.set("taskId", task.id);
    router.push(pathname + "?" + params.toString());
  };

  const parseDueDate = (dateStr: string): number => {
    try {
      const parts = dateStr.split(" ");
      if (parts.length < 3) return 0;
      const day = parseInt(parts[0]);
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthIdx = months.indexOf(parts[1]);
      const year = parseInt(parts[2]);
      return new Date(year, monthIdx !== -1 ? monthIdx : 0, day).getTime();
    } catch {
      return 0;
    }
  };

  const processedTasks = useMemo(() => {
    let result = [...tasks];

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query)
      );
    }

    if (priorityFilter !== "all") {
      result = result.filter((task) => task.priority === priorityFilter);
    }

    if (sortBy === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "dueDate") {
      result.sort((a, b) => parseDueDate(a.dueDate) - parseDueDate(b.dueDate));
    } else if (sortBy === "priority") {
      const priorityWeights = { high: 3, medium: 2, low: 1 };
      result.sort((a, b) => priorityWeights[b.priority] - priorityWeights[a.priority]);
    } else if (sortBy === "comments") {
      result.sort((a, b) => b.commentsCount - a.commentsCount);
    }

    return result;
  }, [tasks, searchQuery, priorityFilter, sortBy]);

  const todoTasks = useMemo(() => processedTasks.filter((t) => t.column === "todo"), [processedTasks]);
  const progressTasks = useMemo(() => processedTasks.filter((t) => t.column === "progress"), [processedTasks]);
  const completedTasks = useMemo(() => processedTasks.filter((t) => t.column === "completed"), [processedTasks]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F8F9FA]">
      <header className="bg-white px-6 md:px-10 py-6 shrink-0">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              {onOpenMobileSidebar && (
                <button
                  onClick={onOpenMobileSidebar}
                  className="p-2 -ml-2 text-[#5C6370] hover:text-[#1A1C1E] hover:bg-gray-100 rounded-lg lg:hidden cursor-pointer shrink-0"
                  type="button"
                  aria-label="Open navigation menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="18" x2="20" y2="18" />
                  </svg>
                </button>
              )}
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#1A1C1E] font-sans">
                Tasks
              </h1>
            </div>

            <div className="flex items-center select-none shrink-0">
              <button
                onClick={handleOpenCreateModal}
                className="flex items-center justify-center gap-1.5 px-4.5 py-2.5 bg-brand-primary hover:bg-brand-primary-hover active:scale-95 text-white text-[14px] font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
              >
                <PlusIcon size={16} />
                <span className="hidden sm:inline">Create New Task</span>
                <span className="sm:hidden">Create Task</span>
              </button>
            </div>
          </div>

          <p className="text-sm text-[#5C6370] font-medium leading-normal">
            Organize your work and collaborate with your team
          </p>
        </div>
      </header>

      <div className="bg-white px-6 md:px-10 border-b border-[#ECEEF0] flex flex-col lg:flex-row gap-0 lg:gap-4 items-stretch justify-between shrink-0 select-none min-h-[52px]">
        <div className="flex items-stretch justify-between lg:justify-start gap-6 w-full lg:w-auto">
          <div className="flex items-stretch gap-6">
            {[
              { id: "board", label: "Board", icon: BoardTabIcon },
              { id: "list", label: "List", icon: ListTabIcon },
              { id: "table", label: "Table", icon: TableTabIcon },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-1 h-full border-b-2 -mb-[1px] text-[14px] font-semibold transition-all cursor-pointer py-3.5 lg:py-0 ${
                    isActive
                      ? "border-brand-primary text-brand-primary font-bold"
                      : "border-transparent text-[#5C6370] hover:text-[#1A1C1E]"
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-brand-primary" : "text-[#8E95A2]"} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className={`lg:hidden flex items-center justify-center px-3 py-1.5 text-[#5C6370] hover:text-[#1A1C1E] active:scale-95 transition-all cursor-pointer self-center rounded-lg border my-2 ${
              showMobileFilters ? "bg-gray-100 border-gray-300 text-[#1A1C1E]" : "bg-white border-[#ECEEF0]"
            }`}
            title="Toggle search and filters"
          >
            <FilterIcon size={14} className="mr-1.5 shrink-0" />
            <span className="text-xs font-semibold">Filters</span>
          </button>
        </div>

        <div className={`flex-wrap items-center gap-4 py-3 lg:py-2.5 w-full lg:w-auto lg:flex border-t border-[#ECEEF0] lg:border-t-0 ${showMobileFilters ? "flex animate-slide-down" : "hidden"}`}>
          <button
            onClick={onResetBoard}
            className="px-3.5 py-2.5 text-xs font-semibold text-gray-500 hover:text-brand-primary hover:bg-gray-50 border border-[#ECEEF0] rounded-lg transition-colors cursor-pointer"
            title="Reset board to default state"
          >
            Reset Default
          </button>

          <div className="relative flex items-center bg-white border border-[#ECEEF0] rounded-lg px-3 py-2 text-xs font-semibold text-[#5C6370] hover:border-gray-300 transition-colors focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/10 cursor-pointer">
            <FilterIcon size={14} className="text-[#8E95A2] mr-1.5 shrink-0" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="bg-transparent pr-4 focus:outline-none cursor-pointer font-semibold text-[#1A1C1E] appearance-none"
            >
              <option value="all">Filter</option>
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <div className="absolute right-2.5 pointer-events-none text-gray-400 text-[8px]">▼</div>
          </div>

          <div className="relative flex items-center bg-white border border-[#ECEEF0] rounded-lg px-3 py-2 text-xs font-semibold text-[#5C6370] hover:border-gray-300 transition-colors focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/10 cursor-pointer">
            <SortIcon size={14} className="text-[#8E95A2] mr-1.5 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent pr-4 focus:outline-none cursor-pointer font-semibold text-[#1A1C1E] appearance-none"
            >
              <option value="none">Sort</option>
              <option value="title">Alphabetical</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="comments">Comments</option>
            </select>
            <div className="absolute right-2.5 pointer-events-none text-gray-400 text-[8px]">▼</div>
          </div>

          <div className="relative flex-1 sm:flex-initial flex items-center bg-[#FAFBFB] border border-[#ECEEF0] rounded-lg px-3 py-2 focus-within:bg-white focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/10 transition-all min-w-[180px]">
            <SearchIcon className="text-[#8E95A2] mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-medium focus:outline-none placeholder-gray-400 text-[#1A1C1E] bg-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-gray-400 hover:text-gray-600 text-xs px-1.5 rounded-full cursor-pointer hover:bg-gray-100"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <style>{`
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slide-down {
            animation: slideDown 0.2s ease-out forwards;
          }
        `}</style>
      </div>

      <div className="flex-1 overflow-x-auto p-6 md:p-10 select-none custom-scrollbar">
        {activeTab === "board" ? (
          <div className="flex lg:grid lg:grid-cols-3 gap-6 h-full items-start w-full snap-x snap-mandatory overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scroll-smooth">
            <KanbanColumn
              title="To-Do"
              columnType="todo"
              tasks={todoTasks}
              onDropTask={onDropTask}
              onDeleteTask={onDeleteTask}
              onEditTask={handleOpenEditModal}
            />
            <KanbanColumn
              title="In Progress"
              columnType="progress"
              tasks={progressTasks}
              onDropTask={onDropTask}
              onDeleteTask={onDeleteTask}
              onEditTask={handleOpenEditModal}
            />
            <KanbanColumn
              title="Completed"
              columnType="completed"
              tasks={completedTasks}
              onDropTask={onDropTask}
              onDeleteTask={onDeleteTask}
              onEditTask={handleOpenEditModal}
            />
          </div>
        ) : (
          <div className="bg-white border border-[#ECEEF0] rounded-2xl p-8 text-center text-[#5C6370] shadow-sm max-w-2xl mx-auto my-12">
            <svg
              className="w-16 h-16 text-brand-primary/20 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-[17px] font-bold text-[#1A1C1E] mb-2">View not fully active</h3>
            <p className="text-sm text-[#8E95A2] leading-relaxed max-w-md mx-auto">
              The Alignio Kanban application is optimized for the **Board View** to demonstrate Drag & Drop interaction. Click the **Board** tab to resume.
            </p>
            <button
              onClick={() => setActiveTab("board")}
              className="mt-5 px-5 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold rounded-xl cursor-pointer transition-colors shadow-sm"
            >
              Switch to Board View
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
