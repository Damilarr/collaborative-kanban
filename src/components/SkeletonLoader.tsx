import React from "react";

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="flex h-screen w-screen bg-[#F8F9FA] overflow-hidden select-none">
      <div className="w-64 border-r border-[#ECEEF0] bg-white h-screen flex flex-col justify-between py-6 shrink-0 hidden md:flex">
        <div className="flex flex-col flex-1 px-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-full bg-[#E9ECEF] animate-pulse shimmer-effect" />
            <div className="h-5 w-24 bg-[#E9ECEF] rounded animate-pulse shimmer-effect" />
          </div>
          <div className="space-y-4 flex-1">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center gap-3 py-1">
                <div className="w-5 h-5 bg-[#E9ECEF] rounded animate-pulse shimmer-effect" />
                <div className="h-4 w-32 bg-[#E9ECEF] rounded animate-pulse shimmer-effect" />
              </div>
            ))}
          </div>
        </div>
        <div className="px-4 border-t border-[#F1F3F5] pt-6">
          <div className="flex items-center gap-3 p-3 rounded-xl border border-[#ECEEF0] bg-[#FAFBFB]">
            <div className="w-10 h-10 rounded-full bg-[#E9ECEF] animate-pulse shimmer-effect" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-20 bg-[#E9ECEF] rounded animate-pulse shimmer-effect" />
              <div className="h-3 w-28 bg-[#E9ECEF] rounded animate-pulse shimmer-effect" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-[#ECEEF0] px-6 md:px-10 py-6 flex items-center justify-between shrink-0">
          <div className="space-y-2">
            <div className="h-8 w-24 bg-[#E9ECEF] rounded animate-pulse shimmer-effect" />
            <div className="h-4 w-64 bg-[#E9ECEF] rounded animate-pulse shimmer-effect" />
          </div>
          <div className="h-10 w-36 bg-[#E9ECEF] rounded-lg animate-pulse shimmer-effect" />
        </header>

        <div className="bg-white px-6 md:px-10 py-4 border-b border-[#F1F3F5] flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shrink-0">
          <div className="flex gap-4">
            <div className="h-6 w-12 bg-[#E9ECEF] rounded animate-pulse shimmer-effect" />
            <div className="h-6 w-12 bg-[#E9ECEF] rounded animate-pulse shimmer-effect" />
            <div className="h-6 w-12 bg-[#E9ECEF] rounded animate-pulse shimmer-effect" />
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="h-9 w-20 bg-[#E9ECEF] rounded-lg animate-pulse shimmer-effect" />
            <div className="h-9 w-20 bg-[#E9ECEF] rounded-lg animate-pulse shimmer-effect" />
            <div className="h-9 w-44 bg-[#E9ECEF] rounded-lg animate-pulse shimmer-effect flex-1 sm:flex-initial" />
          </div>
        </div>

        <div className="flex-1 overflow-x-auto p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full items-start min-w-[768px]">
            {[1, 2, 3].map((colId) => (
              <div
                key={colId}
                className="bg-[#FAFBFB] rounded-2xl border border-[#ECEEF0] p-4 flex flex-col max-h-full"
              >
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#F1F3F5]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#E9ECEF] animate-pulse shimmer-effect" />
                    <div className="h-4 w-16 bg-[#E9ECEF] rounded animate-pulse shimmer-effect" />
                    <div className="w-5 h-5 rounded-full bg-[#E9ECEF] animate-pulse shimmer-effect" />
                  </div>
                  <div className="w-5 h-5 bg-[#E9ECEF] rounded animate-pulse shimmer-effect" />
                </div>

                <div className="space-y-4 overflow-y-auto pr-1">
                  {[1, 2].map((cardId) => (
                    <div
                      key={cardId}
                      className="bg-white rounded-xl border border-[#ECEEF0] p-4 space-y-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="h-5 w-12 bg-[#E9ECEF] rounded animate-pulse shimmer-effect" />
                        <div className="h-4 w-16 bg-[#E9ECEF] rounded animate-pulse shimmer-effect" />
                      </div>
                      <div className="h-4.5 w-3/4 bg-[#E9ECEF] rounded animate-pulse shimmer-effect" />
                      <div className="space-y-1.5">
                        <div className="h-3 w-full bg-[#E9ECEF] rounded animate-pulse shimmer-effect" />
                        <div className="h-3 w-5/6 bg-[#E9ECEF] rounded animate-pulse shimmer-effect" />
                      </div>
                      <div className="border-t border-[#F1F3F5] pt-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-3.5 w-8 bg-[#E9ECEF] rounded animate-pulse shimmer-effect" />
                          <div className="h-3.5 w-8 bg-[#E9ECEF] rounded animate-pulse shimmer-effect" />
                        </div>
                        <div className="flex -space-x-1.5">
                          <div className="w-6 h-6 rounded-full bg-[#E9ECEF] animate-pulse shimmer-effect border border-white" />
                          <div className="w-6 h-6 rounded-full bg-[#E9ECEF] animate-pulse shimmer-effect border border-white" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
