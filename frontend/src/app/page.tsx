import { redirect } from "next/navigation";

import {
  createBook,
  deleteBook,
  getBooks,
  getDashboard,
  updateBook,
} from "@/lib/api";
import type { BookStatus } from "@/lib/api";
import { AddBookForm } from "@/components/library/add-book-form";
import { BookFilters } from "@/components/library/book-filters";
import { BookTable } from "@/components/library/book-table";
import { LibraryHeader } from "@/components/library/library-header";
import type { PageFeedback, SearchFilters } from "@/components/library/types";

type PageProps = {
  searchParams?: Promise<{
    created?: string;
    deleted?: string;
    edit?: string;
    updated?: string;
    error?: string;
    form?: string;
    q?: string;
    status?: string;
  }>;
};

export default async function Home({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const created = resolvedSearchParams?.created === "1";
  const deleted = resolvedSearchParams?.deleted === "1";
  const edit = resolvedSearchParams?.edit;
  const error = resolvedSearchParams?.error;
  const form = resolvedSearchParams?.form;
  const q = resolvedSearchParams?.q?.trim() ?? "";
  const status = toBookStatus(resolvedSearchParams?.status);
  const updated = resolvedSearchParams?.updated === "1";
  const feedback: PageFeedback = { created, deleted, edit, error, form, updated };
  const filters: SearchFilters = { q, status };

  const { books, dashboard, hasBackendError } = await loadPageData(filters);

  return (
    <main className="min-h-screen bg-[var(--color-page)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 lg:px-10">
        <LibraryHeader dashboard={dashboard} feedback={feedback} />

        <section className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="space-y-4 rounded-lg border border-black/8 bg-white p-4">
            <AddBookForm action={createBookAction} feedback={feedback} filters={filters} />
            <BookFilters filters={filters} />
          </aside>
          <BookTable
            books={books}
            filters={filters}
            feedback={feedback}
            hasBackendError={hasBackendError}
            updateAction={updateBookAction}
            deleteAction={deleteBookAction}
          />
        </section>
      </div>
    </main>
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

  const filters = readFilters(formData);
  const payload = parseBookFormData(formData, filters, "create");

  try {
    await createBook(payload);
  } catch {
    redirectToState(filters, {
      error: "Failed to create the book.",
      form: "create",
    });
  }

  redirectToState(filters, { created: "1" });
}

async function updateBookAction(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));
  const filters = readFilters(formData);

  if (!Number.isInteger(id) || id < 1) {
    redirectToState(filters, {
      error: "Invalid book id.",
      form: `update-${id}`,
      edit: String(id),
    });
  }

  const payload = parseBookFormData(formData, filters, `update-${id}`, String(id));

  try {
    await updateBook(id, payload);
  } catch {
    redirectToState(filters, {
      error: "Failed to update the book.",
      form: `update-${id}`,
      edit: String(id),
    });
  }

  redirectToState(filters, { updated: "1" });
}

async function deleteBookAction(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));
  const filters = readFilters(formData);

  if (!Number.isInteger(id) || id < 1) {
    redirectToState(filters, {
      error: "Invalid book id.",
      form: "delete",
    });
  }

  try {
    await deleteBook(id);
  } catch {
    redirectToState(filters, {
      error: "Failed to delete the book.",
      form: `update-${id}`,
      edit: String(id),
    });
  }

  redirectToState(filters, { deleted: "1" });
}

function readRequiredField(formData: FormData, key: string): string {
  return formData.get(key)?.toString().trim() ?? "";
}

function parseBookFormData(
  formData: FormData,
  filters: { q: string; status: string },
  form: string,
  edit?: string,
) {
  const title = readRequiredField(formData, "title");
  const author = readRequiredField(formData, "author");
  const status = toBookStatus(formData.get("bookStatus")?.toString());
  const ratingValue = formData.get("rating")?.toString().trim() ?? "";
  const memoValue = formData.get("memo")?.toString().trim() ?? "";

  if (!title || !author || !status) {
    redirectToState(filters, {
      error: "Please fill in the required fields.",
      form,
      edit,
    });
  }

  const rating = ratingValue ? Number(ratingValue) : null;

  if (rating !== null && (!Number.isInteger(rating) || rating < 1 || rating > 5)) {
    redirectToState(filters, {
      error: "Rating must be between 1 and 5.",
      form,
      edit,
    });
  }

  return {
    title,
    author,
    status,
    rating,
    memo: memoValue || null,
  };
}

function readFilters(formData: FormData) {
  return {
    q: formData.get("q")?.toString().trim() ?? "",
    status: formData.get("status")?.toString().trim() ?? "",
  };
}

function redirectToState(
  filters: { q: string; status: string },
  state: Record<string, string | undefined>,
) {
  const params = new URLSearchParams();

  if (filters.q) {
    params.set("q", filters.q);
  }

  if (filters.status) {
    params.set("status", filters.status);
  }

  for (const [key, value] of Object.entries(state)) {
    if (value) {
      params.set(key, value);
    }
  }

  const query = params.toString();
  redirect(query ? `/?${query}` : "/");
}
