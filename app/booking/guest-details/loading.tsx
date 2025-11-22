export default function GuestDetailsLoading() {
  return (
    <div className="min-h-screen bg-neutral-50 pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Breadcrumb and Booking Summary Label */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <div className="h-4 bg-neutral-200 rounded w-full max-w-2xl animate-pulse" />
          </div>
          <div className="lg:col-span-1">
            <div className="h-10 bg-neutral-200 rounded w-64 mb-2 animate-pulse" />
            <div className="h-4 bg-neutral-200 rounded w-48 animate-pulse" />
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-6">
              <div className="h-10 bg-neutral-200 rounded w-64 mb-2 animate-pulse" />
              <div className="h-4 bg-neutral-200 rounded w-96 animate-pulse" />
            </div>

            <div className="bg-white p-6 rounded-2xl space-y-5">
              {/* Personal Information */}
              <div className="space-y-4">
                <div className="h-6 bg-neutral-200 rounded w-48 animate-pulse" />
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="h-10 bg-neutral-200 rounded-xl animate-pulse" />
                  <div className="h-10 bg-neutral-200 rounded-xl animate-pulse" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="h-10 bg-neutral-200 rounded-xl animate-pulse" />
                  <div className="h-10 bg-neutral-200 rounded-xl animate-pulse" />
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <div className="h-6 bg-neutral-200 rounded w-48 animate-pulse" />
                <div className="h-10 bg-neutral-200 rounded-xl animate-pulse" />
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="h-10 bg-neutral-200 rounded-xl animate-pulse" />
                  <div className="h-10 bg-neutral-200 rounded-xl animate-pulse" />
                </div>
              </div>

              {/* Special Requests */}
              <div className="space-y-4">
                <div className="h-6 bg-neutral-200 rounded w-48 animate-pulse" />
                <div className="h-24 bg-neutral-200 rounded-xl animate-pulse" />
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="h-12 bg-neutral-200 rounded-full animate-pulse" />
                <div className="h-12 bg-neutral-900 rounded-full animate-pulse" />
              </div>
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-900 text-white p-5 rounded-2xl space-y-3.5">
              {/* Booking Details */}
              <div className="grid grid-cols-2 gap-2 pb-3.5 border-b border-neutral-700">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div key={i} className="contents">
                    <div className="h-4 bg-neutral-700 rounded w-20 animate-pulse" />
                    <div className="h-4 bg-neutral-700 rounded w-24 animate-pulse" />
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 pb-3.5 border-b border-neutral-700">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 bg-neutral-700 rounded w-32 animate-pulse" />
                    <div className="h-4 bg-neutral-700 rounded w-20 animate-pulse" />
                  </div>
                ))}
              </div>

              {/* Add-ons */}
              <div className="pb-3.5 border-b border-neutral-700">
                <div className="h-10 bg-neutral-700 rounded-lg animate-pulse" />
              </div>

              {/* Promo Code */}
              <div className="pb-3.5 border-b border-neutral-700">
                <div className="h-4 bg-neutral-700 rounded w-32 mb-2 animate-pulse" />
                <div className="h-10 bg-neutral-700 rounded-lg animate-pulse" />
              </div>

              {/* Total */}
              <div className="flex justify-between">
                <div className="h-8 bg-neutral-700 rounded w-20 animate-pulse" />
                <div className="h-8 bg-neutral-700 rounded w-32 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
