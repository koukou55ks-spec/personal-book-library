import Link from "next/link";

import type { Dashboard } from "@/lib/api";

import type { PageFeedback } from "./types";

export function LibraryHeader({
  dashboard,
  feedback,
}: {
  dashboard: Dashboard;
  feedback: PageFeedback;
}) {
  const readingBooks =
    dashboard.status_counts.find((item) => item.status === "reading")?.count ?? 0;

  return (
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
              This frontend starts with the main workflow first: scan your books, find
              the one you want, and review the current reading state.
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

      {feedback.created ? (
        <Notice tone="success">Book created successfully.</Notice>
      ) : null}
      {feedback.updated ? (
        <Notice tone="success">Book updated successfully.</Notice>
      ) : null}
      {feedback.deleted ? (
        <Notice tone="success">Book deleted successfully.</Notice>
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
  );
}

function Notice({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "success";
}) {
  const className =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "";

  return <div className={`rounded-md border px-4 py-3 text-sm ${className}`}>{children}</div>;
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-black/8 bg-white p-4">
      <p className="text-sm text-[var(--color-muted)]">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[var(--color-ink)]">{value}</p>
    </div>
  );
}
