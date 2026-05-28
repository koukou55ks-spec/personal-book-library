export type BookStatus = "unread" | "reading" | "finished";

export type Book = {
  id: number;
  title: string;
  author: string;
  status: BookStatus;
  rating: number | null;
  memo: string | null;
};

export const sampleBooks: Book[] = [
  {
    id: 1,
    title: "Atomic Habits",
    author: "James Clear",
    status: "finished",
    rating: 5,
    memo: "Useful for building steady routines.",
  },
  {
    id: 2,
    title: "Deep Work",
    author: "Cal Newport",
    status: "reading",
    rating: 4,
    memo: "Reading a chapter each morning.",
  },
  {
    id: 3,
    title: "Refactoring",
    author: "Martin Fowler",
    status: "unread",
    rating: null,
    memo: null,
  },
];

export const sampleSummary = {
  totalBooks: 3,
  finishedBooks: 1,
  averageRating: 4.5,
  readingBooks: 1,
};
