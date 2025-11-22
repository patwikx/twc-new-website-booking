export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section Skeleton */}
      <div className="relative h-screen bg-neutral-200 animate-pulse" />

      {/* About Section Skeleton */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <div className="h-8 bg-neutral-200 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-neutral-200 rounded w-full animate-pulse" />
              <div className="h-4 bg-neutral-200 rounded w-5/6 animate-pulse" />
              <div className="h-4 bg-neutral-200 rounded w-4/5 animate-pulse" />
            </div>
            <div className="h-96 bg-neutral-200 rounded-2xl animate-pulse" />
          </div>
        </div>
      </section>

      {/* Properties Section Skeleton */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="h-10 bg-neutral-200 rounded w-64 mx-auto mb-12 animate-pulse" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden">
                <div className="h-64 bg-neutral-200 animate-pulse" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-neutral-200 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-neutral-200 rounded w-1/2 animate-pulse" />
                  <div className="h-4 bg-neutral-200 rounded w-full animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
