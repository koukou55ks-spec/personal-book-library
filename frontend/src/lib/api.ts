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

export async function getBooks(): Promise<Book[]> {
  const response = await fetch(`${backendUrl}/books`, {
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
