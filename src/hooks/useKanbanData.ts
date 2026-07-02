import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";

export interface Assignee {
  name: string;
  initials: string;
  color: string;
  avatarUrl?: string;
}

export type Priority = "low" | "medium" | "high";
export type ColumnType = "todo" | "progress" | "completed";

export interface Task {
  id: string;
  title: string;
  description: string;
  column: ColumnType;
  priority: Priority;
  dueDate: string;
  commentsCount: number;
  attachmentsCount: number;
  assignees: Assignee[];
}

export const TEAM_MEMBERS: Assignee[] = [
  { name: "Emma Jeff", initials: "EJ", color: "bg-orange-500 text-white" },
  { name: "Liam Carter", initials: "LC", color: "bg-blue-500 text-white" },
  { name: "Sophia Miller", initials: "SM", color: "bg-emerald-500 text-white" },
  { name: "Noah Davis", initials: "ND", color: "bg-purple-500 text-white" },
  { name: "Olivia Taylor", initials: "OT", color: "bg-pink-500 text-white" },
];

const INITIAL_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Monthly Budget Review",
    description: "Review and adjust the monthly budget to align with financial goals.",
    column: "todo",
    priority: "low",
    dueDate: "29 Jan 2025",
    commentsCount: 16,
    attachmentsCount: 2,
    assignees: [TEAM_MEMBERS[0], TEAM_MEMBERS[1], TEAM_MEMBERS[2]],
  },
  {
    id: "task-2",
    title: "Investment Portfolio Analysis",
    description: "Analyze investment portfolio performance and make adjustments as needed.",
    column: "todo",
    priority: "high",
    dueDate: "24 Jan 2025",
    commentsCount: 30,
    attachmentsCount: 5,
    assignees: [TEAM_MEMBERS[0], TEAM_MEMBERS[1], TEAM_MEMBERS[3]],
  },
  {
    id: "task-3",
    title: "Tax Preparation",
    description: "Gather necessary documents and prepare for tax season.",
    column: "progress",
    priority: "low",
    dueDate: "31 Jan 2025",
    commentsCount: 10,
    attachmentsCount: 4,
    assignees: [TEAM_MEMBERS[1], TEAM_MEMBERS[2], TEAM_MEMBERS[3]],
  },
  {
    id: "task-4",
    title: "Savings Account Check-up",
    description: "Review savings account interest rates and consider new options.",
    column: "progress",
    priority: "medium",
    dueDate: "3 Feb 2025",
    commentsCount: 8,
    attachmentsCount: 1,
    assignees: [TEAM_MEMBERS[2]],
  },
  {
    id: "task-5",
    title: "Payroll Management",
    description: "Process payroll for employees, ensuring all salaries are calculated correctly and on time.",
    column: "progress",
    priority: "low",
    dueDate: "31 Jan 2025",
    commentsCount: 8,
    attachmentsCount: 4,
    assignees: [TEAM_MEMBERS[0], TEAM_MEMBERS[1], TEAM_MEMBERS[4]],
  },
  {
    id: "task-6",
    title: "Debt Repayment Plan",
    description: "Create a plan to pay off outstanding debts.",
    column: "completed",
    priority: "high",
    dueDate: "28 Jan 2025",
    commentsCount: 20,
    attachmentsCount: 4,
    assignees: [TEAM_MEMBERS[0], TEAM_MEMBERS[2], TEAM_MEMBERS[3]],
  },
  {
    id: "task-7",
    title: "Expense Approval",
    description: "Review and approve employee expense reports, ensuring they align with company policies.",
    column: "completed",
    priority: "high",
    dueDate: "28 Jan 2025",
    commentsCount: 10,
    attachmentsCount: 4,
    assignees: [TEAM_MEMBERS[0], TEAM_MEMBERS[3], TEAM_MEMBERS[4]],
  },
];

const LOCAL_STORAGE_KEY = "alignio_kanban_tasks";
const COLLAB_MODE_KEY = "alignio_live_collab";

export const useKanbanData = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Ref to keep track of current tasks for use inside intervals/callbacks
  const tasksRef = useRef<Task[]>([]);
  tasksRef.current = tasks;

  // Load initial tasks
  useEffect(() => {
    const savedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
    
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {
        console.error("Failed to parse tasks from localStorage", e);
        setTasks(INITIAL_TASKS);
      }
    } else {
      setTasks(INITIAL_TASKS);
    }
    
    // Simulate loading for loading skeleton demo
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);

  // Save tasks to localStorage when state changes
  const saveTasks = useCallback((newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newTasks));
  }, []);



  // Add Task
  const addTask = useCallback((taskData: Omit<Task, "id" | "commentsCount" | "attachmentsCount">) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      commentsCount: 0,
      attachmentsCount: 0,
    };
    const updated = [newTask, ...tasksRef.current];
    saveTasks(updated);
    toast.success("Task Created Successfully", {
      description: `"${newTask.title}" added to ${newTask.column === "todo" ? "To-Do" : newTask.column === "progress" ? "In Progress" : "Completed"}`,
      duration: 3000
    });
    return newTask;
  }, [saveTasks]);

  // Update Task Column
  const updateTaskColumn = useCallback((taskId: string, newColumn: ColumnType) => {
    const currentTasks = tasksRef.current;
    const taskIndex = currentTasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) return;

    const task = currentTasks[taskIndex];
    if (task.column === newColumn) return;

    const updatedTask = { ...task, column: newColumn };
    const updatedTasks = currentTasks.map((t) => (t.id === taskId ? updatedTask : t));
    
    saveTasks(updatedTasks);
    
    const colName = newColumn === "todo" ? "To-Do" : newColumn === "progress" ? "In Progress" : "Completed";
    toast.info("Task Moved", {
      description: `"${task.title}" is now in ${colName}.`,
      duration: 2000
    });
  }, [saveTasks]);

  // Edit Task
  const editTask = useCallback((taskId: string, updatedFields: Partial<Task>) => {
    const currentTasks = tasksRef.current;
    const updatedTasks = currentTasks.map((t) => {
      if (t.id === taskId) {
        const merged = { ...t, ...updatedFields };
        return merged;
      }
      return t;
    });
    saveTasks(updatedTasks);
  }, [saveTasks]);

  // Delete Task
  const deleteTask = useCallback((taskId: string) => {
    const currentTasks = tasksRef.current;
    const task = currentTasks.find((t) => t.id === taskId);
    if (!task) return;

    const updatedTasks = currentTasks.filter((t) => t.id !== taskId);
    saveTasks(updatedTasks);
    toast.error("Task Deleted", {
      description: `"${task.title}" has been removed from the board.`,
      duration: 3000
    });
  }, [saveTasks]);

  // Reset Board to default
  const resetBoard = useCallback(() => {
    saveTasks(INITIAL_TASKS);
    toast.success("Board Reset", {
      description: "Restored columns to default mock tasks.",
      duration: 3000
    });
  }, [saveTasks]);

  return {
    tasks,
    isLoading,
    addTask,
    updateTaskColumn,
    editTask,
    deleteTask,
    resetBoard,
  };
};
