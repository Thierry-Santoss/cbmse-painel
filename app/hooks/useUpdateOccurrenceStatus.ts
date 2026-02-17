"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "../queryKeys";
import { apiFetch } from "../lib/api";

type UpdateOccurrenceStatusInput = {
  id: string;
  action: "start" | "resolve" | "cancel";
};

type UpdateOccurrenceStatusResponse = unknown;

const updateOccurrenceStatus = async ({
  id,
  action,
}: UpdateOccurrenceStatusInput): Promise<UpdateOccurrenceStatusResponse> => {
  const res = await apiFetch(`/occurrences/${id}/${action}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": "bombeiros_secret_token_2026",
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || `Erro ao executar ação: ${action}`);
  }

  return res.json();
};

export function useUpdateOccurrenceStatus(options?: {
  onSuccess?: (data: UpdateOccurrenceStatusResponse, variables: UpdateOccurrenceStatusInput) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation<UpdateOccurrenceStatusResponse, Error, UpdateOccurrenceStatusInput>({
    mutationFn: updateOccurrenceStatus,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.occurrences() });
      options?.onSuccess?.(data, variables);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
}
