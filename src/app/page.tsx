"use client";

import { Suspense, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { KanbanBoard } from "../components/KanbanBoard";
import { TaskModal } from "../components/TaskModal";
import { SkeletonLoader } from "../components/SkeletonLoader";
import { useKanbanData } from "../hooks/useKanbanData";

function BoardContent() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
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

      {/* Mobile Sidebar Drawer Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-[1px] transition-opacity duration-300"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          {/* Drawer Panel */}
          <div 
            className="relative w-64 h-full bg-white flex flex-col justify-between shadow-2xl z-10 transition-transform duration-300"
            style={{
              animation: "slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards"
            }}
          >
            <Sidebar
              currentTab="Tasks"
              isMobile
              onClose={() => setIsMobileSidebarOpen(false)}
            />
          </div>
          {/* Slide-in Keyframe definition inline */}
          <style>{`
            @keyframes slideIn {
              from { transform: translateX(-100%); }
              to { transform: translateX(0); }
            }
          `}</style>
        </div>
      )}

      {/* Main Board */}
      <KanbanBoard
        tasks={tasks}
        onDropTask={updateTaskColumn}
        onDeleteTask={deleteTask}
        onResetBoard={resetBoard}
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
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
