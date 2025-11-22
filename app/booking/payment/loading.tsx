export default function PaymentLoading() {
  return (
    <div className="min-h-screen bg-neutral-50 pt-28 pb-12">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        {/* Breadcrumb Skeleton */}
        <div className="mb-6">
          <div className="h-4 bg-neutral-200 rounded w-96 animate-pulse" />
        </div>

        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-10 bg-neutral-200 rounded w-64 mb-2 animate-pulse" />
          <div className="h-4 bg-neutral-200 rounded w-96 animate-pulse" />
        </div>

        {/* Booking Summary Card */}
        <div className="bg-white p-6 rounded-2xl mb-8">
          <div className="h-6 bg-neutral-200 rounded w-48 mb-4 animate-pulse" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 bg-neutral-200 rounded w-32 animate-pulse" />
                <div className="h-4 bg-neutral-200 rounded w-24 animate-pulse" />
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-neutral-200 flex justify-between">
            <div className="h-6 bg-neutral-200 rounded w-24 animate-pulse" />
            <div className="h-6 bg-neutral-200 rounded w-32 animate-pulse" />
          </div>
        </div>

        {/* Payment Options */}
        <div className="bg-white p-6 rounded-2xl mb-8">
          <div className="h-6 bg-neutral-200 rounded w-48 mb-6 animate-pulse" />
          <div className="space-y-4">
            <div className="h-24 bg-neutral-200 rounded-xl animate-pulse" />
            <div className="h-24 bg-neutral-200 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <div className="flex-1 h-12 bg-neutral-200 rounded-full animate-pulse" />
          <div className="flex-1 h-12 bg-neutral-900 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
