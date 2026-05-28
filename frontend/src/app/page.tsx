import { sampleBooks, sampleSummary } from "@/lib/sample-data";

const statusLabels = {
  unread: "Unread",
  reading: "Reading",
  finished: "Finished",
} as const;

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--color-page)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 lg:px-10">
        <header className="flex flex-col gap-6 border-b border-black/8 pb-6">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium uppercase tracking-[0.08em] text-[var(--color-muted)]">
              Personal Book Library
            </p>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <h1 className="text-3xl font-semibold text-[var(--color-ink)] lg:text-4xl">
                  Track books, reading progress, and quick stats in one place.
                </h1>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)] lg:text-base">
                  This frontend starts with the main workflow first: scan your books,
                  find the one you want, and review the current reading state.
                </p>
              </div>
              <button
                type="button"
                className="inline-flex h-11 items-center justify-center rounded-md bg-[var(--color-ink)] px-4 text-sm font-medium text-white transition hover:bg-black/85"
              >
                Add Book
              </button>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            <StatCard label="Total Books" value={sampleSummary.totalBooks} />
            <StatCard label="Finished" value={sampleSummary.finishedBooks} />
            <StatCard label="Average Rating" value={sampleSummary.averageRating} />
            <StatCard label="Reading Now" value={sampleSummary.readingBooks} />
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="space-y-4 rounded-lg border border-black/8 bg-white p-4">
            <div>
              <h2 className="text-sm font-semibold text-[var(--color-ink)]">
                Filters
              </h2>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                The first frontend step is a clear list screen. Form inputs and API
                wiring come next.
              </p>
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-[var(--color-ink)]">
                Search
              </span>
              <input
                type="search"
                placeholder="Title or author"
                className="h-11 rounded-md border border-black/10 bg-[var(--color-page)] px-3 text-sm outline-none transition focus:border-black/30"
              />
            </label>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-[var(--color-ink)]">
                Status
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(["unread", "reading", "finished"] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    className="h-10 rounded-md border border-black/10 bg-white px-2 text-xs font-medium text-[var(--color-muted)] transition hover:border-black/30 hover:text-[var(--color-ink)]"
                  >
                    {statusLabels[status]}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section className="rounded-lg border border-black/8 bg-white">
            <div className="flex items-center justify-between border-b border-black/8 px-4 py-3">
              <div>
                <h2 className="text-sm font-semibold text-[var(--color-ink)]">
                  Books
                </h2>
                <p className="text-sm text-[var(--color-muted)]">
                  Static sample data for the initial UI scaffold.
                </p>
              </div>
              <p className="text-sm text-[var(--color-muted)]">
                {sampleBooks.length} items
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-black/8 bg-black/[0.02] text-left text-xs uppercase tracking-[0.08em] text-[var(--color-muted)]">
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Author</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Rating</th>
                    <th className="px-4 py-3 font-medium">Memo</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleBooks.map((book) => (
                    <tr key={book.id} className="border-b border-black/6 last:border-b-0">
                      <td className="px-4 py-4 align-top">
                        <div className="font-medium text-[var(--color-ink)]">
                          {book.title}
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top text-sm text-[var(--color-muted)]">
                        {book.author}
                      </td>
                      <td className="px-4 py-4 align-top">
                        <span className="inline-flex h-7 items-center rounded-md bg-black/[0.04] px-2.5 text-xs font-medium text-[var(--color-ink)]">
                          {statusLabels[book.status]}
                        </span>
                      </td>
                      <td className="px-4 py-4 align-top text-sm text-[var(--color-ink)]">
                        {book.rating ?? "-"}
                      </td>
                      <td className="px-4 py-4 align-top text-sm leading-6 text-[var(--color-muted)]">
                        {book.memo || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-black/8 bg-white p-4">
      <p className="text-sm text-[var(--color-muted)]">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[var(--color-ink)]">{value}</p>
    </div>
  );
}
