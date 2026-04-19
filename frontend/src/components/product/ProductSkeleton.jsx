export default function ProductSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[3/4] bg-noir-100 mb-4" />
          <div className="h-3 bg-noir-100 w-1/3 mb-2" />
          <div className="h-4 bg-noir-100 w-4/5 mb-2" />
          <div className="h-4 bg-noir-100 w-1/4" />
        </div>
      ))}
    </div>
  )
}
