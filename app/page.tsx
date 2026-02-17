"use client";

import React, { useState } from "react";
import {
  Plus,
  MapPin,
  AlertTriangle,
  Home,
  Loader2,
  Clock,
  ChevronRight,
  ChevronsRight,
  ChevronsLeft,
  ChevronLeft,
  X,
  AlertCircle,
  ClipboardList,
  Truck,
} from "lucide-react";
import ModalRecursos from "./ModalRecursos";

import { useCreateOccurrence } from "./hooks/useCreateOccurrence";
import { useOccurrences } from "./hooks/useOccurrences";
import { useUpdateOccurrenceStatus } from "./hooks/useUpdateOccurrenceStatus";
import type { Dispatch, Occurrence } from "./types/occurrences";

const STATUS_CONFIG: Record<string, { label: string; class: string }> = {
  reported: {
    label: "Pendente",
    class: "border-danger text-danger bg-danger-subtle",
  },
  in_progress: {
    label: "Em Curso",
    class: "border-primary text-primary bg-primary-subtle",
  },
  resolved: {
    label: "Finalizada",
    class: "border-success text-success bg-success-subtle",
  },
  cancelled: {
    label: "Cancelada",
    class: "border-secondary text-secondary bg-secondary-subtle",
  },
};

export default function PainelHibrido() {
  const [page, setPage] = useState(1);
  const [filtroNatureza, setFiltroNatureza] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOccurrence, setSelectedOccurrence] = useState<Occurrence | null>(null);

  const { data: apiResponse, isLoading, error } = useOccurrences(page);

  const mutation = useCreateOccurrence({
    onSuccess: () => {
      setIsOpen(false);
      alert("Ocorrência registrada com sucesso!");
    },
  });

  const mutationStatus = useUpdateOccurrenceStatus({
    onSuccess: (data, variables) => {
      const mensagens = {
        start: "Ocorrência em atendimento!",
        resolve: "Ocorrência finalizada com sucesso!",
        cancel: "Ocorrência cancelada.",
      };

      alert(mensagens[variables.action]);
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const ocorrencias = apiResponse?.data || [];
  const lastPage = apiResponse?.last_page || 1;

  const naturezasDisponiveis = Array.from(
    new Set(ocorrencias.map((o: Occurrence) => String(o.type))),
  )
    .filter(Boolean)
    .sort() as string[];

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    const endPage = Math.min(lastPage, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`px-3 py-1 border rounded font-bold transition-all ${
            page === i
              ? "bg-sky-800 text-white border-sky-800 shadow-sm"
              : "bg-white text-sky-900 hover:bg-sky-50 border-sky-100"
          }`}
        >
          {i}
        </button>,
      );
    }
    return pages;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const type = formData.get("type");
    const description = formData.get("description");

    if (typeof type !== "string" || typeof description !== "string") {
      return;
    }

    const randomId = `OC-${Math.floor(10000 + Math.random() * 90000)}`;

    const agora = new Date();
    const dataLocal = agora.toLocaleString("sv-SE").replace("T", " ");

    mutation.mutate({
      externalId: randomId,
      type,
      description,
      reportedAt: dataLocal,
    });
  };

  const filtered = Array.isArray(ocorrencias)
    ? ocorrencias.filter((o: Occurrence) => {
        const bateNatureza = filtroNatureza === "" || o.type === filtroNatureza;
        const bateStatus = filtroStatus === "" || o.status === filtroStatus;

        return bateNatureza && bateStatus;
      })
    : [];

  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      <aside className="hidden md:flex flex-col w-64 bg-sky-950 border-end border-sky-900">
        <div className="p-4 border-bottom border-sky-900">
          <h4 className="fw-bold mb-0 text-white">CBMSE</h4>
          <small className="text-sky-400">Ocorrências</small>
        </div>
        <div className="p-3">
          <ul className="nav nav-pills flex-column">
            <li className="nav-item">
              <a
                href="#"
                className="nav-link active bg-sky-800 d-flex align-items-center gap-2"
              >
                <Home size={18} /> Home
              </a>
            </li>
          </ul>
        </div>
      </aside>

      <div className="flex-1 d-flex flex-column">
        <header className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-4 py-2 shadow-sm">
          <div className="container-fluid p-0">
            <div className="d-flex align-items-center gap-3">
              <span className="navbar-brand mb-0 h1 fs-6 fw-bold text-sky-950">
                Painel Tático de Ocorrências
              </span>
            </div>
          </div>
        </header>

        <main className="p-6">
          <div className="container-fluid">
            <div className="row g-3 mb-4 align-items-end">
              <div className="col-md-3">
                <label className="form-label small fw-bold text-sky-900 uppercase">
                  Natureza
                </label>
                <select
                  className="form-select border-sky-100 shadow-none text-sm"
                  value={filtroNatureza}
                  onChange={(e) => setFiltroNatureza(e.target.value)}
                >
                  <option value="">Todas as Naturezas</option>
                  {naturezasDisponiveis.map((natureza: string) => (
                    <option key={natureza} value={natureza}>
                      {natureza}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label small fw-bold text-sky-900 uppercase">
                  Status
                </label>
                <select
                  className="form-select border-sky-100 shadow-none text-sm"
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value)}
                >
                  <option value="">Todos os Status</option>
                  <option value="reported">Pendente</option>
                  <option value="in_progress">Em Curso</option>
                  <option value="resolved">Finalizada</option>
                  <option value="cancelled">Cancelada</option>
                </select>
              </div>
              <div className="col-md-4 text-md-end">
                <button
                  onClick={() => setIsOpen(true)}
                  className="btn btn-danger d-inline-flex align-items-center gap-2 px-4 py-2 fw-bold shadow-sm"
                >
                  <Plus size={20} /> NOVA OCORRÊNCIA
                </button>
              </div>
            </div>

            <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-sky-50 border-bottom border-sky-100">
                    <tr>
                      <th className="ps-4 py-3 text-sky-900 fw-bold small uppercase">
                        ID
                      </th>
                      <th className="py-3 text-sky-900 fw-bold small uppercase">
                        Natureza
                      </th>
                      <th className="py-3 text-sky-900 fw-bold small uppercase">
                        Endereço
                      </th>
                      <th className="py-3 text-sky-900 fw-bold small uppercase">
                        Horário
                      </th>
                      <th className="py-3 text-sky-900 fw-bold small uppercase">
                        Status
                      </th>
                      <th className="py-3 text-sky-900 fw-bold small uppercase">
                        Açoes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="text-center py-5">
                          <Loader2 className="animate-spin inline me-2 text-danger" />
                          <span className="text-muted">
                            Sincronizando com a central...
                          </span>
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-5 text-danger fw-bold"
                        >
                          Erro ao conectar com o servidor do Docker.
                        </td>
                      </tr>
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-5 text-muted italic"
                        >
                          Nenhuma ocorrência encontrada.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((o: Occurrence) => (
                        <tr
                          key={o.id}
                          className="transition-all hover:bg-slate-50"
                        >
                          <td className="ps-4 fw-bold font-monospace text-sky-700">
                            #{o.id.split("-")[0].toUpperCase()}
                          </td>
                          <td
                            className="fw-bold text-dark uppercase"
                            style={{ fontSize: "13px" }}
                          >
                            <div className="d-flex align-items-center gap-2">
                              <AlertTriangle
                                size={14}
                                className="text-danger"
                              />
                              {o.type}
                            </div>
                          </td>
                          <td className="text-secondary small">
                            <MapPin
                              size={14}
                              className="me-1 text-sky-600 inline"
                            />
                            {o.description}
                          </td>
                          <td className="text-secondary small">
                            <Clock
                              size={14}
                              className="me-1 text-slate-400 inline"
                            />
                            {new Date(o.reported_at).toLocaleTimeString(
                              "pt-BR",
                              {
                                timeZone: "UTC",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                              },
                            )}
                          </td>
                          <td className="text-center">
                            <span
                              className={`badge border ${
                                STATUS_CONFIG[o.status]?.class ||
                                "border-dark text-dark bg-light"
                              } px-3 py-2 rounded-pill uppercase`}
                              style={{ fontSize: "10px", minWidth: "90px" }}
                            >
                              {STATUS_CONFIG[o.status]?.label || o.status}
                            </span>
                          </td>
                          <td className="text-center">
                            <div className="d-flex justify-content-center gap-2">
                              {o.status === "reported" && (
                                <span
                                  title={
                                    o.dispatches?.length === 0
                                      ? "Despache uma viatura antes de atender"
                                      : ""
                                  }
                                >
                                  <button
                                    onClick={() =>
                                      mutationStatus.mutate({
                                        id: o.id,
                                        action: "start",
                                      })
                                    }
                                    disabled={
                                      mutationStatus.isPending ||
                                      (o.dispatches?.length || 0) === 0
                                    }
                                    className="btn btn-sm btn-primary fw-bold uppercase text-[10px]"
                                  >
                                    Atender
                                  </button>
                                </span>
                              )}
                              {o.status === "in_progress" && (
                                <span
                                  title={
                                    !o.dispatches?.every(
                                      (d: Dispatch) => d.status === "closed",
                                    )
                                      ? "Todas as viaturas precisam estar liberadas"
                                      : ""
                                  }
                                >
                                  <button
                                    onClick={() =>
                                      mutationStatus.mutate({
                                        id: o.id,
                                        action: "resolve",
                                      })
                                    }
                                    disabled={
                                      mutationStatus.isPending ||
                                      !o.dispatches?.every(
                                        (d: Dispatch) => d.status === "closed",
                                      )
                                    }
                                    className="btn btn-sm btn-success fw-bold uppercase text-[10px]"
                                  >
                                    Finalizar
                                  </button>
                                </span>
                              )}

                              {(o.status === "reported" ||
                                o.status === "in_progress") && (
                                <button
                                  onClick={() => {
                                    if (
                                      confirm(
                                        "Deseja realmente cancelar esta ocorrência?",
                                      )
                                    ) {
                                      mutationStatus.mutate({
                                        id: o.id,
                                        action: "cancel",
                                      });
                                    }
                                  }}
                                  disabled={mutationStatus.isPending}
                                  className="btn btn-sm btn-outline-secondary fw-bold uppercase text-[10px]"
                                >
                                  Cancelar
                                </button>
                              )}
                              {o.status !== "resolved" &&
                                o.status !== "cancelled" && (
                                  <button
                                    onClick={() => setSelectedOccurrence(o)}
                                    className="btn btn-sm btn-outline-primary fw-bold uppercase text-[10px] d-flex align-items-center gap-1"
                                  >
                                    <Truck size={12} /> VTRs (
                                    {o.dispatches?.length || 0})
                                  </button>
                                )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-center align-items-center gap-2 mt-4 pb-4">
                {/* Ir para o Início << */}
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className="btn btn-sm btn-outline-secondary border-sky-100"
                >
                  <ChevronsLeft size={16} />
                </button>

                {/* Voltar Uma < */}
                <button
                  onClick={() => setPage((old) => Math.max(old - 1, 1))}
                  disabled={page === 1}
                  className="btn btn-sm btn-outline-secondary border-sky-100"
                >
                  <ChevronLeft size={16} />
                </button>

                {/* Números Dinâmicos */}
                <div className="d-flex gap-1">{renderPageNumbers()}</div>

                {/* Avançar Uma > */}
                <button
                  onClick={() => setPage((old) => Math.min(old + 1, lastPage))}
                  disabled={page === lastPage}
                  className="btn btn-sm btn-outline-secondary border-sky-100"
                >
                  <ChevronRight size={16} />
                </button>

                {/* Ir para o Fim >> */}
                <button
                  onClick={() => setPage(lastPage)}
                  disabled={page === lastPage}
                  className="btn btn-sm btn-outline-secondary border-sky-100"
                >
                  <ChevronsRight size={16} />
                </button>
              </div>

              <div className="text-center">
                <small className="text-muted">
                  Página {page} de {lastPage}
                </small>
              </div>
            </div>
          </div>
        </main>

        <footer className="mt-auto py-3 bg-white border-top text-center text-sky-900/50 small font-medium">
          © 2026 CBMSE — CORPO DE BOMBEIROS MILITAR DE SERGIPE
        </footer>
      </div>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          {/* Modal Tamanho XL (max-w-4xl) */}
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
            {/* Lado Esquerdo - Painel Informativo (Estilo CBMSE) */}
            <div className="md:w-1/3 bg-sky-950 p-8 text-white flex flex-col justify-between border-r border-sky-900">
              <div>
                <div className="bg-red-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6 shadow-lg">
                  <AlertCircle size={28} />
                </div>
                <h2 className="text-2xl font-black tracking-tighter uppercase mb-2 leading-tight">
                  Registro de Chamado Operacional
                </h2>
                <p className="text-sky-300 text-sm font-medium leading-relaxed">
                  Preencha os dados com atenção. Esta informação será enviada
                  imediatamente para as guarnições via COBOM Aracaju.
                </p>
              </div>
              <div className="hidden md:block opacity-20">
                <ClipboardList size={120} />
              </div>
            </div>

            {/* Lado Direito - Formulário */}
            <div className="flex-1 p-8 bg-white relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-red-600 transition-colors"
              >
                <X size={24} />
              </button>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Campo Natureza */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <AlertCircle size={14} className="text-red-600" />{" "}
                      Natureza do Evento
                    </label>
                    <select
                      name="type"
                      required
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-600 outline-none transition-all font-bold text-slate-700"
                    >
                      <option value="">Selecione a natureza...</option>
                      <option value="Incêndio">Incêndio em Edificação</option>
                      <option value="Resgate">Resgate / Salvamento</option>
                      <option value="Acidente">Acidente com Vítima</option>
                      <option value="Ambiental">Ocorrência Ambiental</option>
                    </select>
                  </div>

                  {/* Campo ID Automático (Visual) */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                      Protocolo Sugerido
                    </label>
                    <div className="h-12 flex items-center px-4 bg-slate-100 border border-dashed border-slate-300 rounded-xl text-slate-400 font-mono text-sm">
                      Gerado automaticamente pelo sistema
                    </div>
                  </div>
                </div>

                {/* Campo Descrição / Localização */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <MapPin size={14} className="text-red-600" /> Detalhes e
                    Localização Exata
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={5}
                    placeholder="Descreva o cenário, pontos de referência e situação das vítimas..."
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-600 outline-none transition-all text-slate-700 resize-none"
                  />
                </div>

                {/* Botões de Ação */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 h-12 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all uppercase text-xs"
                  >
                    Descartar Registro
                  </button>
                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="flex-1 h-12 bg-red-700 text-white font-black rounded-xl hover:bg-red-800 disabled:opacity-50 flex justify-center items-center gap-3 transition-all shadow-lg shadow-red-900/20 uppercase text-xs tracking-widest"
                  >
                    {mutation.isPending ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        ENVIAR PARA O COBOM <Plus size={18} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {selectedOccurrence && (
        <ModalRecursos
          occurrence={
            ocorrencias.find((o: Occurrence) => o.id === selectedOccurrence.id) ||
            selectedOccurrence
          }
          onClose={() => setSelectedOccurrence(null)}
        />
      )}
    </div>
  );
}
