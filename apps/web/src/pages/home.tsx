export function HomePage() {
  return (
    <main className="container py-16">
      <h1 className="text-4xl font-bold tracking-tight">
        Publication Trend System
      </h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        AI-assisted scientific publication trend analysis — search papers, view trends,
        generate RAG-grounded analytical reports, and discover research gaps.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Card title="Search" desc="Keyword + semantic search across millions of papers." />
        <Card title="Trends" desc="Visualize how a topic grows or fades year by year." />
        <Card title="AI Reports" desc="Get grounded analytical reports and research gaps." />
      </div>
    </main>
  );
}

function Card({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <h2 className="font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
