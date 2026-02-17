"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../queryKeys";
import { apiFetch } from "../lib/api";

import type { Occurrence, PaginatedResponse } from "../types/occurrences";

type OccurrencesApiResponse = PaginatedResponse<Occurrence>;

const fetchOcorrencias = async (page = 1): Promise<OccurrencesApiResponse> => {
  const res = await apiFetch(`/occurrences?page=${page}`, {
    headers: { "X-API-Key": "bombeiros_secret_token_2026" },
  });
  if (!res.ok) throw new Error("Falha na conexão");
  return res.json();
};

export function useOccurrences(page: number) {
  return useQuery<OccurrencesApiResponse, Error>({
    queryKey: queryKeys.occurrences(page),
    queryFn: () => fetchOcorrencias(page),
    placeholderData: (previousData) => previousData,
    refetchInterval: 3000,
    refetchIntervalInBackground: true,
  });
}
