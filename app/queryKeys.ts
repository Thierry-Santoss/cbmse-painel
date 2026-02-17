export const queryKeys = {
  occurrences: (page?: number) =>
    page === undefined ? ["ocorrencias"] : (["ocorrencias", page] as const),
} as const;
