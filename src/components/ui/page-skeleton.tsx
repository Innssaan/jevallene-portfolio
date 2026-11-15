function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-neutral-200/75 dark:bg-neutral-800/75 ${className}`}
    />
  );
}

export default function PageSkeleton() {
  return (
    <div
      className="min-h-screen w-full bg-white text-neutral-900 dark:bg-[#08080A] dark:text-[#F5F5F7]"
      role="status"
      aria-label="Memuat halaman"
    >
      {/* Header skeleton */}
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/85 backdrop-blur-md dark:border-white/5 dark:bg-[#08080A]/80">
        <div className="mx-auto flex h-[70px] w-full max-w-[1152px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <SkeletonBlock className="h-6 w-28 rounded-lg" />
          <div className="hidden items-center gap-6 md:flex">
            <SkeletonBlock className="h-4 w-16" />
            <SkeletonBlock className="h-4 w-16" />
            <SkeletonBlock className="h-4 w-20" />
            <SkeletonBlock className="h-4 w-16" />
          </div>
          <SkeletonBlock className="size-9 rounded-xl" />
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1152px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero skeleton */}
        <section className="grid grid-cols-1 items-start gap-8 pb-10 lg:grid-cols-12 lg:gap-12">
          <div className="order-2 space-y-5 pt-2 lg:order-1 lg:col-span-7 lg:pt-12">
            <SkeletonBlock className="h-7 w-60 rounded-full" />
            <SkeletonBlock className="h-12 w-4/5 sm:h-14" />
            <SkeletonBlock className="h-5 w-full max-w-lg" />
            <SkeletonBlock className="h-5 w-3/4 max-w-md" />
            <div className="flex flex-wrap gap-3 pt-2">
              <SkeletonBlock className="h-11 w-32 rounded-xl" />
              <SkeletonBlock className="h-11 w-36 rounded-xl" />
            </div>
          </div>

          <div className="order-1 mx-auto w-full max-w-[320px] lg:order-2 lg:col-span-5 lg:max-w-none">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-6 dark:border-neutral-800 dark:bg-neutral-900/70">
              <div className="flex items-center gap-4">
                <SkeletonBlock className="size-16 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2">
                  <SkeletonBlock className="h-5 w-32" />
                  <SkeletonBlock className="h-4 w-44" />
                </div>
              </div>
              <SkeletonBlock className="mt-5 h-4 w-full" />
              <SkeletonBlock className="mt-2 h-4 w-5/6" />
              <div className="mt-5 flex gap-2">
                <SkeletonBlock className="h-6 w-16 rounded-full" />
                <SkeletonBlock className="h-6 w-20 rounded-full" />
                <SkeletonBlock className="h-6 w-14 rounded-full" />
              </div>
            </div>
          </div>
        </section>

        {/* Bento / Section skeleton */}
        <section className="space-y-6 py-8">
          <div className="space-y-3">
            <SkeletonBlock className="h-3.5 w-24" />
            <SkeletonBlock className="h-9 w-72 sm:w-96" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-6 dark:border-neutral-800 dark:bg-neutral-900/70">
              <SkeletonBlock className="h-4 w-24" />
              <SkeletonBlock className="mt-4 h-24 w-full" />
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-6 sm:col-span-2 dark:border-neutral-800 dark:bg-neutral-900/70">
              <SkeletonBlock className="h-4 w-28" />
              <SkeletonBlock className="mt-4 h-24 w-full" />
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-6 dark:border-neutral-800 dark:bg-neutral-900/70">
              <SkeletonBlock className="h-4 w-24" />
              <SkeletonBlock className="mt-4 h-24 w-full" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
