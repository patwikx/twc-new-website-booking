export default function PropertiesLoading() {
  return (
    <div className="min-h-screen bg-neutral-50 pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-10 bg-neutral-200 rounded w-64 mb-4 animate-pulse" />
          <div className="h-4 bg-neutral-200 rounded w-96 animate-pulse" />
        </div>

        {/* Search and Filters Skeleton */}
        <div className="bg-white p-6 rounded-2xl mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="h-12 bg-neutral-200 rounded-xl animate-pulse" />
            <div className="h-12 bg-neutral-200 rounded-xl animate-pulse" />
            <div className="h-12 bg-neutral-200 rounded-xl animate-pulse" />
            <div className="h-12 bg-neutral-200 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Properties Grid Skeleton */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden">
              <div className="h-64 bg-neutral-200 animate-pulse" />
              <div className="p-6 space-y-3">
                <div className="h-6 bg-neutral-200 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-neutral-200 rounded w-1/2 animate-pulse" />
                <div className="h-4 bg-neutral-200 rounded w-full animate-pulse" />
                <div className="h-4 bg-neutral-200 rounded w-5/6 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
