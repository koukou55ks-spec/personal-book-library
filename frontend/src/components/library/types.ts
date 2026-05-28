import type { BookStatus } from "@/lib/api";

export type PageFeedback = {
  created: boolean;
  deleted: boolean;
  edit?: string;
  error?: string;
  form?: string;
  updated: boolean;
};

export type SearchFilters = {
  q: string;
  status: BookStatus | null;
};

export type BookFormAction = (formData: FormData) => Promise<void>;
