"use client";

import { useState } from "react";
import {
  Truck,
  Plus,
  X,
  Loader2,
} from "lucide-react";

import { useDispatchResource } from "./hooks/useDispatchResource";
import { useUpdateDispatchStatus } from "./hooks/useUpdateDispatchStatus";
import type { Dispatch, DispatchStatus, Occurrence } from "./types/occurrences";

const DISPATCH_STATUS_CONFIG: Record<string, { label: string; class: string }> =
  {
    assigned: {
      label: "Designada",
      class: "border-info text-info bg-info-subtle",
    },
    en_route: {
      label: "Deslocando",
      class: "border-primary text-primary bg-primary-subtle",
    },
    on_site: {
      label: "No Local",
      class: "border-warning text-warning bg-warning-subtle",
    },
    closed: {
      label: "Liberada",
      class: "border-success text-success bg-success-subtle",
    },
  };

export default function ModalRecursos({
  occurrence,
  onClose,
}: {
  occurrence: Occurrence;
  onClose: () => void;
}) {
  const [resourceCode, setResourceCode] = useState("");

  const mutationDispatch = useDispatchResource({
    onSuccess: () => {
      setResourceCode("");
    },
  });

  const mutationUpdate = useUpdateDispatchStatus();

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        <div className="bg-sky-950 p-4 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Truck className="text-red-500" />
            <div>
              <h3 className="font-bold text-sm uppercase tracking-tight">
                Gerenciar Recursos
              </h3>
              <p className="text-[10px] text-sky-300">
                Ocorrência: #{occurrence.id.split("-")[0].toUpperCase()}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-1 rounded">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300">
            <label className="text-[11px] font-black text-slate-500 uppercase block mb-2">
              Despachar Nova Unidade
            </label>
            <div className="flex gap-2">
              <input
                value={resourceCode}
                onChange={(e) => setResourceCode(e.target.value.toUpperCase())}
                placeholder="Ex: ABT-01, UR-05..."
                className="flex-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-500 uppercase font-mono text-sm"
              />
              <button
                onClick={() =>
                  mutationDispatch.mutate({
                    occurrenceId: occurrence.id,
                    resourceCode: resourceCode.toUpperCase(),
                  })
                }
                disabled={!resourceCode || mutationDispatch.isPending}
                className="bg-red-700 text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-red-800 disabled:opacity-50 flex items-center gap-2"
              >
                {mutationDispatch.isPending ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Plus size={16} />
                )}
                DESPACHAR
              </button>
            </div>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            <h4 className="text-[11px] font-black text-slate-500 uppercase border-b pb-1">
              Viaturas empenhadas
            </h4>
            {occurrence.dispatches?.map((d: Dispatch) => (
              <div
                key={d.id}
                className="flex items-center justify-between p-3 bg-white border rounded-xl shadow-sm mb-2"
              >
                <div className="flex items-center gap-3">
                  {/* Badge da Viatura (Ex: VTR-01) */}
                  <div className="w-10 h-10 bg-sky-900 text-white rounded-lg flex items-center justify-center font-bold text-xs shadow-sm">
                    {d.resource_code}
                  </div>

                  {/* Status da Viatura com a sua nova config */}
                  <span
                    className={`badge border ${
                      DISPATCH_STATUS_CONFIG[d.status as DispatchStatus]?.class ||
                      "bg-light text-dark"
                    } px-2 py-1 rounded-pill uppercase`}
                    style={{ fontSize: "9px", minWidth: "80px" }}
                  >
                    {DISPATCH_STATUS_CONFIG[d.status as DispatchStatus]?.label || d.status}
                  </span>
                </div>

                {/* Botões de Ação baseados no seu $flow */}
                <div className="flex gap-1">
                  {d.status === "assigned" && (
                    <>
                      <button
                        onClick={() =>
                          mutationUpdate.mutate({
                            dispatchId: d.id,
                            status: "en_route",
                          })
                        }
                        className="btn btn-sm btn-outline-primary py-0 px-2 text-[10px] fw-bold"
                      >
                        SAIR
                      </button>
                      <button
                        onClick={() =>
                          mutationUpdate.mutate({
                            dispatchId: d.id,
                            status: "closed",
                          })
                        }
                        className="btn btn-sm btn-outline-secondary py-0 px-2 text-[10px] fw-bold"
                      >
                        LIMPAR
                      </button>
                    </>
                  )}

                  {d.status === "en_route" && (
                    <button
                      onClick={() =>
                        mutationUpdate.mutate({
                          dispatchId: d.id,
                          status: "on_site",
                        })
                      }
                      className="btn btn-sm btn-outline-warning py-0 px-2 text-[10px] fw-bold"
                    >
                      CHEGUEI
                    </button>
                  )}

                  {d.status === "on_site" && (
                    <button
                      onClick={() =>
                        mutationUpdate.mutate({
                          dispatchId: d.id,
                          status: "closed",
                        })
                      }
                      className="btn btn-sm btn-outline-success py-0 px-2 text-[10px] fw-bold"
                    >
                      LIBERAR
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
