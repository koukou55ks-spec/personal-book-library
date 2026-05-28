import type { BookFormAction, PageFeedback, SearchFilters } from "./types";
import { FormError } from "./form-error";
import { statusLabels } from "./status";

export function AddBookForm({
  action,
  feedback,
  filters,
}: {
  action: BookFormAction;
  feedback: PageFeedback;
  filters: SearchFilters;
}) {
  return (
    <div id="add-book" className="space-y-4 border-b border-black/8 pb-4">
      <div>
        <h2 className="text-sm font-semibold text-[var(--color-ink)]">Add Book</h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          This form sends a typed payload to the FastAPI backend with a server action.
        </p>
      </div>

      {feedback.form === "create" && feedback.error ? (
        <FormError message={feedback.error} />
      ) : null}

      <form action={action} className="space-y-3">
        <input type="hidden" name="q" value={filters.q} />
        <input type="hidden" name="status" value={filters.status ?? ""} />

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-[var(--color-ink)]">Title</span>
          <input
            type="text"
            name="title"
            required
            className="h-11 rounded-md border border-black/10 bg-[var(--color-page)] px-3 text-sm outline-none transition focus:border-black/30"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-[var(--color-ink)]">Author</span>
          <input
            type="text"
            name="author"
            required
            className="h-11 rounded-md border border-black/10 bg-[var(--color-page)] px-3 text-sm outline-none transition focus:border-black/30"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-[var(--color-ink)]">Status</span>
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
          <span className="text-sm font-medium text-[var(--color-ink)]">Rating</span>
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
          <span className="text-sm font-medium text-[var(--color-ink)]">Memo</span>
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
  );
}
