"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "../queryKeys";
import { apiFetch } from "../lib/api";

type DispatchResourceInput = {
  occurrenceId: string;
  resourceCode: string;
};

type DispatchResourceResponse = unknown;

const dispatchResource = async (
  data: DispatchResourceInput,
): Promise<DispatchResourceResponse> => {
  const res = await apiFetch(`/occurrences/${data.occurrenceId}/dispatches`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-API-Key": "bombeiros_secret_token_2026",
    },
    body: JSON.stringify({ resourceCode: data.resourceCode }),
  });
  if (!res.ok) throw new Error("Erro ao despachar");
  return res.json();
};

export function useDispatchResource(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useMutation<DispatchResourceResponse, Error, DispatchResourceInput>({
    mutationFn: dispatchResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.occurrences() });
      options?.onSuccess?.();
    },
  });
}
