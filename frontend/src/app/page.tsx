import Link from "next/link";
import { redirect } from "next/navigation";

import { createBook, getBooks, getDashboard } from "@/lib/api";
import type { BookStatus } from "@/lib/api";

const statusLabels = {
  unread: "Unread",
  reading: "Reading",
  finished: "Finished",
} as const;

type PageProps = {
  searchParams?: Promise<{
    created?: string;
    error?: string;
    q?: string;
    status?: string;
  }>;
};

export default async function Home({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const created = resolvedSearchParams?.created === "1";
  const error = resolvedSearchParams?.error;
  const q = resolvedSearchParams?.q?.trim() ?? "";
  const status = toBookStatus(resolvedSearchParams?.status);

  const { books, dashboard, hasBackendError } = await loadPageData({
    q,
    status,
  });

  const readingBooks =
    dashboard.status_counts.find((item) => item.status === "reading")?.count ?? 0;

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
              <Link
                href="#add-book"
                className="inline-flex h-11 items-center justify-center rounded-md bg-[var(--color-ink)] px-4 text-sm font-medium text-white transition hover:bg-black/85"
              >
                Add Book
              </Link>
            </div>
          </div>
          {created ? (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              Book created successfully.
            </div>
          ) : null}
          {error ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          ) : null}
          <div className="grid gap-3 md:grid-cols-4">
            <StatCard label="Total Books" value={dashboard.total_books} />
            <StatCard label="Finished" value={dashboard.finished_books} />
            <StatCard
              label="Average Rating"
              value={dashboard.average_rating?.toFixed(1) ?? "-"}
            />
            <StatCard label="Reading Now" value={readingBooks} />
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="space-y-4 rounded-lg border border-black/8 bg-white p-4">
            <div id="add-book" className="space-y-4 border-b border-black/8 pb-4">
              <div>
                <h2 className="text-sm font-semibold text-[var(--color-ink)]">
                  Add Book
                </h2>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  This form sends a typed payload to the FastAPI backend with a server
                  action.
                </p>
              </div>

              <form action={createBookAction} className="space-y-3">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-[var(--color-ink)]">
                    Title
                  </span>
                  <input
                    type="text"
                    name="title"
                    required
                    className="h-11 rounded-md border border-black/10 bg-[var(--color-page)] px-3 text-sm outline-none transition focus:border-black/30"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-[var(--color-ink)]">
                    Author
                  </span>
                  <input
                    type="text"
                    name="author"
                    required
                    className="h-11 rounded-md border border-black/10 bg-[var(--color-page)] px-3 text-sm outline-none transition focus:border-black/30"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-[var(--color-ink)]">
                    Status
                  </span>
                  <select
                    name="bookStatus"
                    defaultValue="unread"
                    className="h-11 rounded-md border border-black/10 bg-white px-3 text-sm outline-none transition focus:border-black/30"
                  >
                    {(["unread", "reading", "finished"] as const).map((item) => (
                      <option key={item} value={item}>
                        {statusLabels[item]}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-[var(--color-ink)]">
                    Rating
                  </span>
                  <select
                    name="rating"
                    defaultValue=""
                    className="h-11 rounded-md border border-black/10 bg-white px-3 text-sm outline-none transition focus:border-black/30"
                  >
                    <option value="">No rating</option>
                    {[1, 2, 3, 4, 5].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-[var(--color-ink)]">
                    Memo
                  </span>
                  <textarea
                    name="memo"
                    rows={4}
                    className="rounded-md border border-black/10 bg-[var(--color-page)] px-3 py-2 text-sm outline-none transition focus:border-black/30"
                  />
                </label>

                <button
                  type="submit"
                  className="inline-flex h-11 w-full items-center justify-center rounded-md bg-[var(--color-ink)] px-4 text-sm font-medium text-white transition hover:bg-black/85"
                >
                  Save Book
                </button>
              </form>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-[var(--color-ink)]">
                Filters
              </h2>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                The page submits search values through the URL, and Next.js reloads
                the server component with filtered data.
              </p>
            </div>

            <form className="space-y-4" action="/">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-[var(--color-ink)]">
                  Search
                </span>
                <input
                  type="search"
                  name="q"
                  defaultValue={q}
                  placeholder="Title or author"
                  className="h-11 rounded-md border border-black/10 bg-[var(--color-page)] px-3 text-sm outline-none transition focus:border-black/30"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-[var(--color-ink)]">
                  Status
                </span>
                <select
                  name="status"
                  defaultValue={status ?? ""}
                  className="h-11 rounded-md border border-black/10 bg-white px-3 text-sm outline-none transition focus:border-black/30"
                >
                  <option value="">All statuses</option>
                  {(["unread", "reading", "finished"] as const).map((item) => (
                    <option key={item} value={item}>
                      {statusLabels[item]}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center rounded-md bg-[var(--color-ink)] px-4 text-sm font-medium text-white transition hover:bg-black/85"
                >
                  Apply
                </button>
                <Link
                  href="/"
                  className="inline-flex h-11 items-center justify-center rounded-md border border-black/10 bg-white px-4 text-sm font-medium text-[var(--color-ink)] transition hover:border-black/30"
                >
                  Reset
                </Link>
              </div>
            </form>
          </aside>

          <section className="rounded-lg border border-black/8 bg-white">
            <div className="flex items-center justify-between border-b border-black/8 px-4 py-3">
              <div>
                <h2 className="text-sm font-semibold text-[var(--color-ink)]">
                  Books
                </h2>
                <p className="text-sm text-[var(--color-muted)]">
                  {hasBackendError
                    ? "Backend is not reachable. Start FastAPI and reload this page."
                    : q || status
                      ? "Filtered results from the FastAPI backend."
                      : "Live data from the FastAPI backend."}
                </p>
              </div>
              <p className="text-sm text-[var(--color-muted)]">
                {books.length} items
              </p>
            </div>

            <div className="overflow-x-auto">
              {hasBackendError ? (
                <div className="px-4 py-10 text-sm text-[var(--color-muted)]">
                  Unable to load data from <code className="font-mono">{`BACKEND_URL`}</code>.
                </div>
              ) : books.length === 0 ? (
                <div className="px-4 py-10 text-sm text-[var(--color-muted)]">
                  No books yet. Add your first book from the backend API or the next
                  frontend form step.
                </div>
              ) : null}

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
                  {books.map((book) => (
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

async function loadPageData(filters: { q?: string; status?: BookStatus | null }) {
  try {
    const [books, dashboard] = await Promise.all([
      getBooks({
        q: filters.q || undefined,
        status: filters.status ?? undefined,
      }),
      getDashboard(),
    ]);

    return {
      books,
      dashboard,
      hasBackendError: false,
    };
  } catch {
    return {
      books: [],
      dashboard: {
        total_books: 0,
        finished_books: 0,
        average_rating: null,
        status_counts: [],
      },
      hasBackendError: true,
    };
  }
}

function toBookStatus(status?: string): BookStatus | null {
  if (status === "unread" || status === "reading" || status === "finished") {
    return status;
  }

  return null;
}

async function createBookAction(formData: FormData) {
  "use server";

  const title = readRequiredField(formData, "title");
  const author = readRequiredField(formData, "author");
  const status = toBookStatus(formData.get("bookStatus")?.toString());
  const ratingValue = formData.get("rating")?.toString().trim() ?? "";
  const memoValue = formData.get("memo")?.toString().trim() ?? "";

  if (!title || !author || !status) {
    redirect("/?error=Please+fill+in+the+required+fields.");
  }

  const rating = ratingValue ? Number(ratingValue) : null;

  if (rating !== null && (!Number.isInteger(rating) || rating < 1 || rating > 5)) {
    redirect("/?error=Rating+must+be+between+1+and+5.");
  }

  try {
    await createBook({
      title,
      author,
      status,
      rating,
      memo: memoValue || null,
    });
  } catch {
    redirect("/?error=Failed+to+create+the+book.");
  }

  redirect("/?created=1");
}

function readRequiredField(formData: FormData, key: string): string {
  return formData.get(key)?.toString().trim() ?? "";
}
