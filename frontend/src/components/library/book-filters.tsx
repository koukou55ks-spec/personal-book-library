import Link from "next/link";

import type { SearchFilters } from "./types";
import { statusLabels } from "./status";

export function BookFilters({ filters }: { filters: SearchFilters }) {
  return (
    <>
      <div>
        <h2 className="text-sm font-semibold text-[var(--color-ink)]">Filters</h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          The page submits search values through the URL, and Next.js reloads the
          server component with filtered data.
        </p>
      </div>

      <form className="space-y-4" action="/">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-[var(--color-ink)]">Search</span>
          <input
            type="search"
            name="q"
            defaultValue={filters.q}
            placeholder="Title or author"
            className="h-11 rounded-md border border-black/10 bg-[var(--color-page)] px-3 text-sm outline-none transition focus:border-black/30"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-[var(--color-ink)]">Status</span>
          <select
            name="status"
            defaultValue={filters.status ?? ""}
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
    </>
  );
}
