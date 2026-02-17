export type OccurrenceStatus =
  | "reported"
  | "in_progress"
  | "cancelled"
  | "finished"
  | "resolved";

export type DispatchStatus =
  | "assigned"
  | "closed"
  | "en_route"
  | "on_scene"
  | "on_site";

export interface Dispatch {
  id: string;
  occurrence_id: string;
  resource_code: string;
  status: DispatchStatus;
  created_at: string;
  updated_at: string;
}

export interface Occurrence {
  id: string;
  external_id: string;
  type: string;
  status: OccurrenceStatus;
  description: string;
  reported_at: string;
  created_at: string;
  updated_at: string;
  dispatches: Dispatch[];
}

export interface CreateOccurrencePayload {
  externalId: string;
  type: string;
  description: string;
  reportedAt: string;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface CreateOccurrenceResponse {
  commandId: string;
  status: "accepted" | (string & {});
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  last_page: number;
  per_page: number;
  total: number;
  next_page_url: string | null;
  prev_page_url: string | null;
  links: Array<{ url: string | null; label: string; active: boolean }>;
}

export interface ApiErrorResponse {
  error: string;
}
