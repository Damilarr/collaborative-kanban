import React from "react";
import {
  LogoIcon,
  DashboardIcon,
  TasksIcon,
  ProjectsIcon,
  CalendarIcon,
  IntegrationsIcon,
  TeamIcon,
  HelpIcon,
  SettingsIcon,
} from "./Icons";

interface SidebarProps {
  currentTab?: string;
  isMobile?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab = "Tasks",
  isMobile = false,
  onClose,
}) => {
  const menuItems = [
    { name: "Dashboard", icon: DashboardIcon },
    { name: "Tasks", icon: TasksIcon },
    { name: "Projects", icon: ProjectsIcon },
    { name: "Calendar", icon: CalendarIcon },
    { name: "Integrations", icon: IntegrationsIcon },
    { name: "Team", icon: TeamIcon },
  ];

  const bottomItems = [
    { name: "Help Centre", icon: HelpIcon },
    { name: "Settings", icon: SettingsIcon },
  ];

  const wrapperClass = isMobile
    ? "w-full h-full bg-white flex flex-col justify-between py-6 select-none"
    : "w-64 border-r border-[#ECEEF0] bg-white h-screen flex flex-col justify-between py-6 shrink-0 hidden lg:flex";

  return (
    <aside className={wrapperClass}>
      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between px-6 mb-8 select-none">
          <div className="flex items-center gap-3 cursor-pointer">
            <LogoIcon size={30} />
            <span className="text-xl font-bold tracking-tight text-[#1A1C1E] font-sans">
              Alignio
            </span>
          </div>
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 md:hidden cursor-pointer"
              type="button"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.name === currentTab;
            return (
              <div key={item.name} className="px-3">
                <button
                  type="button"
                  className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-[15px] font-semibold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "bg-brand-light text-brand-primary"
                      : "text-[#5C6370] hover:bg-[#F8F9FA] hover:text-[#1A1C1E]"
                  }`}
                >
                  <Icon
                    size={20}
                    className={isActive ? "text-brand-primary" : "text-[#8E95A2]"}
                  />
                  <span>{item.name}</span>
                </button>
              </div>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-6 pt-4 border-t border-[#F1F3F5]">
        <div className="space-y-1">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.name} className="px-3">
                <button
                  type="button"
                  className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-[15px] font-medium text-[#5C6370] hover:bg-[#F8F9FA] hover:text-[#1A1C1E] transition-all duration-150 cursor-pointer"
                >
                  <Icon size={20} className="text-[#8E95A2]" />
                  <span>{item.name}</span>
                </button>
              </div>
            );
          })}
        </div>

        <div className="px-4">
          <div className="flex items-center justify-between p-3 rounded-xl border border-[#ECEEF0] bg-[#FAFBFB] hover:bg-[#FAF9F6] transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-primary text-white font-bold text-sm flex items-center justify-center border-2 border-white shadow-sm shrink-0 overflow-hidden relative">
                <span className="font-sans tracking-wider">EJ</span>
                <img
                  src="/emma_jeff_avatar.jpg"
                  alt="Emma Jeff"
                  className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300"
                  onLoad={(e) => (e.currentTarget.style.opacity = "1")}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#1A1C1E] truncate group-hover:text-brand-primary transition-colors">
                  Emma Jeff
                </p>
                <p className="text-xs text-[#8E95A2] truncate">
                  emmajeff@gmail.com
                </p>
              </div>
            </div>
            <svg
              className="w-4 h-4 text-[#8E95A2] group-hover:text-brand-primary transition-colors"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </div>
        </div>
      </div>
    </aside>
  );
};
