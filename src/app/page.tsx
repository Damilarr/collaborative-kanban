"use client";

import { Suspense } from "react";
import { Sidebar } from "../components/Sidebar";
import { KanbanBoard } from "../components/KanbanBoard";
import { TaskModal } from "../components/TaskModal";
import { SkeletonLoader } from "../components/SkeletonLoader";
import { useKanbanData } from "../hooks/useKanbanData";

function BoardContent() {
  const {
    tasks,
    isLoading,
    addTask,
    updateTaskColumn,
    editTask,
    deleteTask,
    resetBoard,
  } = useKanbanData();

  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="flex h-screen w-screen bg-[#F8F9FA] overflow-hidden">
      {/* Sidebar - hidden on mobile, visible on desktop */}
      <Sidebar currentTab="Tasks" />

      {/* Main Board */}
      <KanbanBoard
        tasks={tasks}
        onDropTask={updateTaskColumn}
        onDeleteTask={deleteTask}
        onResetBoard={resetBoard}
      />

      {/* Task Modal - handles URL query synchronization */}
      <TaskModal
        onAddTask={addTask}
        onEditTask={editTask}
        tasks={tasks}
      />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <BoardContent />
    </Suspense>
  );
}
