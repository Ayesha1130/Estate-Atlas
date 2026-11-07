export default function Loading() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="h-8 w-48 rounded-xl bg-card animate-pulse mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="rounded-3xl bg-[#0D1412] border border-white/[0.08] overflow-hidden p-4 space-y-4 shadow-luxury-card animate-pulse"
          >
            <div className="aspect-[16/10] w-full rounded-2xl bg-[#16201C]" />
            <div className="space-y-2">
              <div className="h-4 w-3/4 rounded-lg bg-[#16201C]" />
              <div className="h-3 w-1/2 rounded-lg bg-[#16201C]" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
