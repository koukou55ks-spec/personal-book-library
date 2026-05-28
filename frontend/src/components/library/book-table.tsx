import type { Book } from "@/lib/api";

import { FormError } from "./form-error";
import { statusLabels } from "./status";
import type { BookFormAction, PageFeedback, SearchFilters } from "./types";

export function BookTable({
  books,
  filters,
  feedback,
  hasBackendError,
  updateAction,
  deleteAction,
}: {
  books: Book[];
  filters: SearchFilters;
  feedback: PageFeedback;
  hasBackendError: boolean;
  updateAction: BookFormAction;
  deleteAction: BookFormAction;
}) {
  return (
    <section className="rounded-lg border border-black/8 bg-white">
      <div className="flex items-center justify-between border-b border-black/8 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-[var(--color-ink)]">Books</h2>
          <p className="text-sm text-[var(--color-muted)]">
            {hasBackendError
              ? "Backend is not reachable. Start FastAPI and reload this page."
              : filters.q || filters.status
                ? "Filtered results from the FastAPI backend."
                : "Live data from the FastAPI backend."}
          </p>
        </div>
        <p className="text-sm text-[var(--color-muted)]">{books.length} items</p>
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
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <BookRow
                key={book.id}
                book={book}
                filters={filters}
                feedback={feedback}
                updateAction={updateAction}
                deleteAction={deleteAction}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function BookRow({
  book,
  filters,
  feedback,
  updateAction,
  deleteAction,
}: {
  book: Book;
  filters: SearchFilters;
  feedback: PageFeedback;
  updateAction: BookFormAction;
  deleteAction: BookFormAction;
}) {
  return (
    <tr className="border-b border-black/6 last:border-b-0">
      <td className="px-4 py-4 align-top">
        <div className="font-medium text-[var(--color-ink)]">{book.title}</div>
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
      <td className="px-4 py-4 align-top">
        <details className="group min-w-52" open={feedback.edit === String(book.id)}>
          <summary className="cursor-pointer list-none text-sm font-medium text-[var(--color-ink)] marker:hidden">
            <span className="inline-flex h-9 items-center justify-center rounded-md border border-black/10 px-3 transition group-open:bg-black/[0.04] hover:border-black/30">
              Edit
            </span>
          </summary>
          <form
            action={updateAction}
            className="mt-3 space-y-3 rounded-md border border-black/8 bg-[var(--color-page)] p-3"
          >
            <input type="hidden" name="id" value={book.id} />
            <input type="hidden" name="q" value={filters.q} />
            <input type="hidden" name="status" value={filters.status ?? ""} />

            {feedback.form === `update-${book.id}` && feedback.error ? (
              <FormError message={feedback.error} />
            ) : null}

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-muted)]">
                Title
              </span>
              <input
                type="text"
                name="title"
                required
                defaultValue={book.title}
                className="h-10 rounded-md border border-black/10 bg-white px-3 text-sm outline-none transition focus:border-black/30"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-muted)]">
                Author
              </span>
              <input
                type="text"
                name="author"
                required
                defaultValue={book.author}
                className="h-10 rounded-md border border-black/10 bg-white px-3 text-sm outline-none transition focus:border-black/30"
              />
            </label>

            <div className="grid grid-cols-2 gap-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-muted)]">
                  Status
                </span>
                <select
                  name="bookStatus"
                  defaultValue={book.status}
                  className="h-10 rounded-md border border-black/10 bg-white px-3 text-sm outline-none transition focus:border-black/30"
                >
                  {(["unread", "reading", "finished"] as const).map((item) => (
                    <option key={item} value={item}>
                      {statusLabels[item]}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-muted)]">
                  Rating
                </span>
                <select
                  name="rating"
                  defaultValue={book.rating ?? ""}
                  className="h-10 rounded-md border border-black/10 bg-white px-3 text-sm outline-none transition focus:border-black/30"
                >
                  <option value="">No rating</option>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-muted)]">
                Memo
              </span>
              <textarea
                name="memo"
                rows={3}
                defaultValue={book.memo ?? ""}
                className="rounded-md border border-black/10 bg-white px-3 py-2 text-sm outline-none transition focus:border-black/30"
              />
            </label>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center rounded-md bg-[var(--color-ink)] px-3 text-sm font-medium text-white transition hover:bg-black/85"
              >
                Save
              </button>
              <button
                type="submit"
                formAction={deleteAction}
                name="id"
                value={book.id}
                className="inline-flex h-10 items-center justify-center rounded-md border border-red-200 bg-white px-3 text-sm font-medium text-red-700 transition hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </form>
        </details>
      </td>
    </tr>
  );
}
