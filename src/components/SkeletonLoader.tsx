interface SkeletonProps {
  className?: string
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={['rounded-lg bg-stone-200 skeleton-shimmer', className].join(' ')}
      aria-hidden="true"
    />
  )
}

export function SkeletonPetCard() {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/5" />
          <Skeleton className="h-3 w-3/5" />
        </div>
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
    </div>
  )
}

export function SkeletonListItem() {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white p-3 border border-stone-200">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}

export function SkeletonOverviewCard() {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-5 w-20 rounded-full" />
    </div>
  )
}
