"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "../queryKeys";
import { apiFetch } from "../lib/api";

type UpdateDispatchStatusInput = {
  dispatchId: string;
  status: string;
};

type UpdateDispatchStatusResponse = unknown;

const updateDispatchStatus = async (
  data: UpdateDispatchStatusInput,
): Promise<UpdateDispatchStatusResponse> => {
  const res = await apiFetch(`/dispatches/${data.dispatchId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-API-Key": "bombeiros_secret_token_2026",
    },
    body: JSON.stringify({ status: data.status }),
  });
  if (!res.ok) throw new Error("Erro ao atualizar");
  return res.json();
};

export function useUpdateDispatchStatus() {
  const queryClient = useQueryClient();

  return useMutation<UpdateDispatchStatusResponse, Error, UpdateDispatchStatusInput>({
    mutationFn: updateDispatchStatus,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.occurrences() }),
  });
}
