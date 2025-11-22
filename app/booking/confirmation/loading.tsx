export default function ConfirmationLoading() {
  return (
    <div className="min-h-screen bg-neutral-50 pt-28 pb-12">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        {/* Success Icon Skeleton */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-neutral-200 rounded-full animate-pulse" />
        </div>

        {/* Header Skeleton */}
        <div className="text-center mb-12">
          <div className="h-10 bg-neutral-200 rounded w-96 mx-auto mb-4 animate-pulse" />
          <div className="h-4 bg-neutral-200 rounded w-64 mx-auto animate-pulse" />
        </div>

        {/* Booking Details Card */}
        <div className="bg-white p-8 rounded-2xl mb-8">
          <div className="h-6 bg-neutral-200 rounded w-48 mb-6 animate-pulse" />
          
          <div className="space-y-6">
            {/* Booking Number */}
            <div className="space-y-2">
              <div className="h-4 bg-neutral-200 rounded w-32 animate-pulse" />
              <div className="h-6 bg-neutral-200 rounded w-48 animate-pulse" />
            </div>

            {/* Guest Details */}
            <div className="space-y-3">
              <div className="h-5 bg-neutral-200 rounded w-40 animate-pulse" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 bg-neutral-200 rounded w-32 animate-pulse" />
                  <div className="h-4 bg-neutral-200 rounded w-48 animate-pulse" />
                </div>
              ))}
            </div>

            {/* Booking Details */}
            <div className="space-y-3">
              <div className="h-5 bg-neutral-200 rounded w-40 animate-pulse" />
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 bg-neutral-200 rounded w-32 animate-pulse" />
                  <div className="h-4 bg-neutral-200 rounded w-40 animate-pulse" />
                </div>
              ))}
            </div>

            {/* Payment Summary */}
            <div className="space-y-3 pt-4 border-t border-neutral-200">
              <div className="h-5 bg-neutral-200 rounded w-40 animate-pulse" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 bg-neutral-200 rounded w-32 animate-pulse" />
                  <div className="h-4 bg-neutral-200 rounded w-24 animate-pulse" />
                </div>
              ))}
              <div className="flex justify-between pt-3 border-t border-neutral-200">
                <div className="h-6 bg-neutral-200 rounded w-24 animate-pulse" />
                <div className="h-6 bg-neutral-200 rounded w-32 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 p-6 rounded-2xl mb-8">
          <div className="h-6 bg-blue-200 rounded w-32 mb-4 animate-pulse" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 bg-blue-200 rounded w-full animate-pulse" />
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <div className="h-12 w-64 bg-neutral-900 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
