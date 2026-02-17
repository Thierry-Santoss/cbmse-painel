"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "../queryKeys";
import { apiFetch } from "../lib/api";

import type {
  CreateOccurrencePayload,
  CreateOccurrenceResponse,
} from "../types/occurrences";

type CreateOccurrenceInput = CreateOccurrencePayload;

const createOccurrence = async (
  newOccurrence: CreateOccurrenceInput,
): Promise<CreateOccurrenceResponse> => {
  const res = await apiFetch("/integrations/occurrences", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": "bombeiros_secret_token_2026",
      "Idempotency-Key": newOccurrence.externalId,
    },
    body: JSON.stringify(newOccurrence),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Erro na integração");
  }
  return res.json();
};

export function useCreateOccurrence(options?: {
  onSuccess?: () => void;
}) {
  const queryClient = useQueryClient();

  return useMutation<CreateOccurrenceResponse, Error, CreateOccurrenceInput>({
    mutationFn: createOccurrence,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.occurrences() });
      options?.onSuccess?.();
    },
  });
}
