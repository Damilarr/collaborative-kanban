import React, { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Task, ColumnType, Priority, Assignee, TEAM_MEMBERS } from "../hooks/useKanbanData";
import { CloseIcon } from "./Icons";

interface TaskModalProps {
  onAddTask: (task: Omit<Task, "id" | "commentsCount" | "attachmentsCount">) => void;
  onEditTask?: (taskId: string, fields: Partial<Task>) => void;
  tasks: Task[];
}

export const TaskModal: React.FC<TaskModalProps> = ({
  onAddTask,
  onEditTask,
  tasks,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Modal mode: "create" | "edit" | null
  const [mode, setMode] = useState<"create" | "edit" | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Form Fields State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [column, setColumn] = useState<ColumnType>("todo");
  const [priority, setPriority] = useState<Priority>("low");
  const [dueDate, setDueDate] = useState("");
  const [selectedAssignees, setSelectedAssignees] = useState<Assignee[]>([]);

  // Validation Errors
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  // Sync state with URL Search Params
  useEffect(() => {
    const modalParam = searchParams.get("modal");
    const taskIdParam = searchParams.get("taskId");

    if (modalParam === "create-task") {
      setMode("create");
      setEditingTaskId(null);
      // Reset fields for new task
      setTitle("");
      setDescription("");
      setColumn("todo");
      setPriority("low");
      // Set default due date to today
      const today = new Date().toISOString().split("T")[0];
      setDueDate(today);
      setSelectedAssignees([TEAM_MEMBERS[0]]); // Emma Jeff default
      setErrors({});
    } else if (modalParam === "edit-task" && taskIdParam) {
      const taskToEdit = tasks.find((t) => t.id === taskIdParam);
      if (taskToEdit) {
        setMode("edit");
        setEditingTaskId(taskIdParam);
        setTitle(taskToEdit.title);
        setDescription(taskToEdit.description);
        setColumn(taskToEdit.column);
        setPriority(taskToEdit.priority);
        
        // Convert display date "29 Jan 2025" back to "YYYY-MM-DD" for HTML5 Date Input
        const formattedDate = parseDisplayDateToInputDate(taskToEdit.dueDate);
        setDueDate(formattedDate);
        setSelectedAssignees(taskToEdit.assignees);
        setErrors({});
      } else {
        // If task not found, close modal
        closeModal();
      }
    } else {
      setMode(null);
      setEditingTaskId(null);
    }
  }, [searchParams, tasks]);

  const closeModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("modal");
    params.delete("taskId");
    router.push(pathname + (params.toString() ? `?${params.toString()}` : ""));
  };

  // Date converters
  const parseDisplayDateToInputDate = (displayDate: string): string => {
    try {
      const parts = displayDate.split(" ");
      if (parts.length < 3) return new Date().toISOString().split("T")[0];
      
      const day = parts[0].padStart(2, "0");
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthIdx = months.indexOf(parts[1]);
      const month = monthIdx !== -1 ? String(monthIdx + 1).padStart(2, "0") : "01";
      const year = parts[2];
      
      return `${year}-${month}-${day}`;
    } catch {
      return new Date().toISOString().split("T")[0];
    }
  };

  const formatInputDateToDisplayDate = (dateStr: string): string => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      
      const day = date.getDate();
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      
      return `${day} ${month} ${year}`;
    } catch {
      return dateStr;
    }
  };

  const handleAssigneeToggle = (assignee: Assignee) => {
    setSelectedAssignees((prev) => {
      const exists = prev.some((a) => a.name === assignee.name);
      if (exists) {
        return prev.filter((a) => a.name !== assignee.name);
      } else {
        return [...prev, assignee];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side Validation
    const newErrors: { title?: string; description?: string } = {};
    if (!title.trim()) {
      newErrors.title = "Task Title cannot be empty";
    }
    if (!description.trim()) {
      newErrors.description = "Task Description cannot be empty";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const displayDueDate = formatInputDateToDisplayDate(dueDate);

    if (mode === "create") {
      onAddTask({
        title: title.trim(),
        description: description.trim(),
        column,
        priority,
        dueDate: displayDueDate,
        assignees: selectedAssignees.length > 0 ? selectedAssignees : [TEAM_MEMBERS[0]],
      });
    } else if (mode === "edit" && editingTaskId && onEditTask) {
      onEditTask(editingTaskId, {
        title: title.trim(),
        description: description.trim(),
        column,
        priority,
        dueDate: displayDueDate,
        assignees: selectedAssignees.length > 0 ? selectedAssignees : [TEAM_MEMBERS[0]],
      });
    }

    closeModal();
  };

  if (!mode) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[3px] flex items-center justify-center p-4 z-50 animate-fade-in">
      {/* Modal Card */}
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-[#E5E7EB] flex flex-col max-h-[90vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F1F3F5] select-none shrink-0">
          <h2 className="text-[17px] font-bold text-[#1A1C1E] tracking-tight">
            {mode === "create" ? "Create New Task" : "Edit Task"}
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-colors cursor-pointer"
            type="button"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Title Input */}
          <div className="space-y-1.5">
            <label htmlFor="task-title" className="text-xs font-bold uppercase tracking-wider text-[#8E95A2]">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim() && errors.title) {
                  setErrors((prev) => ({ ...prev, title: undefined }));
                }
              }}
              placeholder="e.g. Design Dashboard Prototypes"
              className={`w-full px-4 py-2.5 rounded-xl border text-[15px] font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all ${
                errors.title ? "border-red-400 ring-2 ring-red-400/10" : "border-[#E5E7EB]"
              }`}
            />
            {errors.title && (
              <p className="text-xs font-semibold text-red-500 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description Input */}
          <div className="space-y-1.5">
            <label htmlFor="task-desc" className="text-xs font-bold uppercase tracking-wider text-[#8E95A2]">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="task-desc"
              rows={3}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (e.target.value.trim() && errors.description) {
                  setErrors((prev) => ({ ...prev, description: undefined }));
                }
              }}
              placeholder="Review requirements and map user flows..."
              className={`w-full px-4 py-2.5 rounded-xl border text-[15px] font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all resize-none ${
                errors.description ? "border-red-400 ring-2 ring-red-400/10" : "border-[#E5E7EB]"
              }`}
            />
            {errors.description && (
              <p className="text-xs font-semibold text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Grid fields: Column & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Column Selector */}
            <div className="space-y-1.5">
              <label htmlFor="task-col" className="text-xs font-bold uppercase tracking-wider text-[#8E95A2]">
                Column
              </label>
              <select
                id="task-col"
                value={column}
                onChange={(e) => setColumn(e.target.value as ColumnType)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all cursor-pointer"
              >
                <option value="todo">To-Do</option>
                <option value="progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Priority Selector */}
            <div className="space-y-1.5">
              <label htmlFor="task-priority" className="text-xs font-bold uppercase tracking-wider text-[#8E95A2]">
                Priority
              </label>
              <select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all cursor-pointer"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Due Date field */}
          <div className="space-y-1.5">
            <label htmlFor="task-date" className="text-xs font-bold uppercase tracking-wider text-[#8E95A2]">
              Due Date
            </label>
            <input
              id="task-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all cursor-pointer"
            />
          </div>

          {/* Assignees selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#8E95A2]">
              Assign Team Members
            </label>
            <div className="grid grid-cols-2 gap-2 select-none">
              {TEAM_MEMBERS.map((member) => {
                const isSelected = selectedAssignees.some((a) => a.name === member.name);
                return (
                  <div
                    key={member.name}
                    onClick={() => handleAssigneeToggle(member)}
                    className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "border-brand-primary bg-brand-light/50 ring-1 ring-brand-primary/30"
                        : "border-[#ECEEF0] bg-[#FAFBFB] hover:bg-gray-50"
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${member.color}`}>
                      {member.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#1A1C1E] truncate">
                        {member.name}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions footer */}
          <div className="pt-4 border-t border-[#F1F3F5] flex items-center justify-end gap-3 select-none">
            <button
              onClick={closeModal}
              type="button"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer border border-[#E5E7EB] bg-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-primary hover:bg-brand-primary-hover active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              {mode === "create" ? "Create Task" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
