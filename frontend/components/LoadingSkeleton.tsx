import { motion } from "framer-motion";

export function DashboardSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="h-12 w-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-2"></div>
        <div className="h-6 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass dark:glass-dark p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Projects Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass dark:glass-dark p-6 rounded-xl shadow-lg">
            <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3"></div>
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="glass dark:glass-dark p-6 rounded-xl shadow-lg">
      <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3"></div>
      <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
      <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        ))}
      </div>
    </div>
  );
}
