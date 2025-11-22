export default function PropertyDetailLoading() {
  return (
    <div className="min-h-screen bg-neutral-50 pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Breadcrumb Skeleton */}
        <div className="mb-6">
          <div className="h-4 bg-neutral-200 rounded w-96 animate-pulse" />
        </div>

        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-12 bg-neutral-200 rounded w-96 mb-4 animate-pulse" />
          <div className="h-6 bg-neutral-200 rounded w-64 mb-2 animate-pulse" />
          <div className="h-4 bg-neutral-200 rounded w-full animate-pulse" />
        </div>

        {/* Image Gallery Skeleton */}
        <div className="mb-12">
          <div className="h-96 bg-neutral-200 rounded-2xl animate-pulse" />
        </div>

        {/* Content Grid Skeleton */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white p-6 rounded-2xl space-y-3">
              <div className="h-6 bg-neutral-200 rounded w-48 mb-4 animate-pulse" />
              <div className="h-4 bg-neutral-200 rounded w-full animate-pulse" />
              <div className="h-4 bg-neutral-200 rounded w-full animate-pulse" />
              <div className="h-4 bg-neutral-200 rounded w-3/4 animate-pulse" />
            </div>

            {/* Amenities */}
            <div className="bg-white p-6 rounded-2xl">
              <div className="h-6 bg-neutral-200 rounded w-48 mb-4 animate-pulse" />
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-12 bg-neutral-200 rounded animate-pulse" />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl space-y-4">
              <div className="h-6 bg-neutral-200 rounded w-32 animate-pulse" />
              <div className="h-12 bg-neutral-200 rounded animate-pulse" />
              <div className="h-12 bg-neutral-200 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Rooms Section Skeleton */}
        <div className="mt-12">
          <div className="h-8 bg-neutral-200 rounded w-64 mb-6 animate-pulse" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden">
                <div className="h-48 bg-neutral-200 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-neutral-200 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-neutral-200 rounded w-1/2 animate-pulse" />
                  <div className="h-4 bg-neutral-200 rounded w-full animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
