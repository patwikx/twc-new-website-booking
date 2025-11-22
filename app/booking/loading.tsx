export default function BookingLoading() {
  return (
    <div className="min-h-screen bg-neutral-50 pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Breadcrumb Skeleton */}
        <div className="mb-6">
          <div className="h-4 bg-neutral-200 rounded w-96 animate-pulse" />
        </div>

        {/* Header Skeleton */}
        <div className="mb-6">
          <div className="h-10 bg-neutral-200 rounded w-64 mb-2 animate-pulse" />
          <div className="h-4 bg-neutral-200 rounded w-96 animate-pulse" />
        </div>

        {/* Content Grid Skeleton */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-2xl space-y-6">
              {/* Date Selection */}
              <div className="space-y-4">
                <div className="h-6 bg-neutral-200 rounded w-48 animate-pulse" />
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="h-12 bg-neutral-200 rounded-xl animate-pulse" />
                  <div className="h-12 bg-neutral-200 rounded-xl animate-pulse" />
                </div>
              </div>

              {/* Guest Selection */}
              <div className="space-y-4">
                <div className="h-6 bg-neutral-200 rounded w-48 animate-pulse" />
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="h-12 bg-neutral-200 rounded-xl animate-pulse" />
                  <div className="h-12 bg-neutral-200 rounded-xl animate-pulse" />
                </div>
              </div>

              {/* Button */}
              <div className="h-12 bg-neutral-900 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-900 text-white p-5 rounded-2xl space-y-4">
              <div className="h-6 bg-neutral-700 rounded w-48 animate-pulse" />
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 bg-neutral-700 rounded w-24 animate-pulse" />
                    <div className="h-4 bg-neutral-700 rounded w-32 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
