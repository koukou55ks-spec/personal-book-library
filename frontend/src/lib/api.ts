export type BookStatus = "unread" | "reading" | "finished";

export type Book = {
  id: number;
  title: string;
  author: string;
  status: BookStatus;
  rating: number | null;
  memo: string | null;
  created_at: string;
};

export type StatusCount = {
  status: BookStatus;
  count: number;
};

export type Dashboard = {
  total_books: number;
  finished_books: number;
  average_rating: number | null;
  status_counts: StatusCount[];
};

const backendUrl = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";

export async function getBooks(filters?: {
  q?: string;
  status?: BookStatus;
}): Promise<Book[]> {
  const params = new URLSearchParams();

  if (filters?.q) {
    params.set("q", filters.q);
  }

  if (filters?.status) {
    params.set("status", filters.status);
  }

  const queryString = params.toString();
  const url = queryString ? `${backendUrl}/books?${queryString}` : `${backendUrl}/books`;

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch books");
  }

  return (await response.json()) as Book[];
}

export async function getDashboard(): Promise<Dashboard> {
  const response = await fetch(`${backendUrl}/dashboard`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard");
  }

  return (await response.json()) as Dashboard;
}
