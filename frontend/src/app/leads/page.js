"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { API_URL } from "../../config/api";

// componente que usa useSearchParams
function LeadsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || ""
  );
  const [updatingStatus, setUpdatingStatus] = useState({});

  // função para atualizar status do lead
  const updateLeadStatus = async (leadId, newStatus) => {
    try {
      setUpdatingStatus((prev) => ({ ...prev, [leadId]: true }));

      const response = await fetch(`${API_URL}/api/leads/${leadId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // atualizar a lista de leads localmente
        setLeads((prevLeads) =>
          prevLeads.map((lead) =>
            lead.id === leadId
              ? {
                  ...lead,
                  status: newStatus,
                  updatedAt: new Date().toISOString(),
                }
              : lead
          )
        );

        // atualizar estatísticas
        fetchLeads();
      } else {
        const errorData = await response.json();
        console.error("erro ao atualizar status:", errorData);
        alert("erro ao atualizar status do lead");
      }
    } catch (error) {
      console.error("erro de conexão ao atualizar status:", error);
      alert("erro de conexão ao atualizar status");
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [leadId]: false }));
    }
  };

  // função para buscar leads
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      const urlSearch = searchParams.get("search");
      const urlStatus = searchParams.get("status");

      if (urlSearch) params.append("search", urlSearch);
      if (urlStatus) params.append("status", urlStatus);

      const response = await fetch(`${API_URL}/api/leads?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setLeads(data.leads);
        setStats(data.statusCount);
      } else {
        console.error("erro ao buscar leads:", data.error);
      }
    } catch (error) {
      console.error("erro de conexão:", error);
    } finally {
      setLoading(false);
    }
  };

  // carregar dados ao montar componente e quando url mudar
  useEffect(() => {
    fetchLeads();
  }, [searchParams]);

  // função para formatar data
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("pt-BR");
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "NOVO":
        return "novo";
      case "EM_CONTATO":
        return "em contato";
      case "CONVERTIDO":
        return "convertido";
      default:
        return status;
    }
  };

  // função para aplicar filtros
  const applyFilters = () => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.append("search", searchTerm.trim());
    if (statusFilter) params.append("status", statusFilter);

    const newUrl = params.toString() ? `/leads?${params.toString()}` : "/leads";
    router.push(newUrl);
  };

  // função para limpar filtros
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    router.push("/leads");
  };

  // função para atualizar status na url automaticamente
  const handleStatusChange = (newStatus) => {
    setStatusFilter(newStatus);

    const params = new URLSearchParams();
    const currentSearch = searchParams.get("search");

    if (currentSearch) params.append("search", currentSearch);
    if (newStatus) params.append("status", newStatus);

    const newUrl = params.toString() ? `/leads?${params.toString()}` : "/leads";
    router.push(newUrl);
  };

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: "#d9d9d9" }}>
      <div className="max-w-full mx-auto bg-white rounded-lg shadow-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black">leads cadastrados</h1>
          <button
            onClick={() => router.push("/")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg"
          >
            voltar
          </button>
        </div>

        {/* estatísticas */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <h3 className="font-semibold text-gray-800">novos</h3>
              <p className="text-2xl font-bold text-gray-900">
                {stats.NOVO || 0}
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <h3 className="font-semibold text-gray-800">em contato</h3>
              <p className="text-2xl font-bold text-gray-900">
                {stats.EM_CONTATO || 0}
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <h3 className="font-semibold text-gray-800">convertidos</h3>
              <p className="text-2xl font-bold text-gray-900">
                {stats.CONVERTIDO || 0}
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <h3 className="font-semibold text-gray-800">total</h3>
              <p className="text-2xl font-bold text-gray-900">
                {(stats.NOVO || 0) +
                  (stats.EM_CONTATO || 0) +
                  (stats.CONVERTIDO || 0)}
              </p>
            </div>
          </div>
        )}

        {/* filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              buscar por nome ou email
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="digite nome ou email..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              filtrar por status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none"
            >
              <option value="">todos os status</option>
              <option value="NOVO">novo</option>
              <option value="EM_CONTATO">em contato</option>
              <option value="CONVERTIDO">convertido</option>
            </select>
          </div>
        </div>

        {/* botões de ação */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={applyFilters}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            aplicar filtros
          </button>
          <button
            onClick={clearFilters}
            className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg"
          >
            limpar filtros
          </button>
        </div>

        {/* lista de leads */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">carregando leads...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">nenhum lead encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    id
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    telefone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    data de cadastro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    última atualização
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lead.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {lead.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lead.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lead.telefone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        {getStatusLabel(lead.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(lead.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(lead.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          updateLeadStatus(lead.id, e.target.value)
                        }
                        disabled={updatingStatus[lead.id]}
                        className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="NOVO">novo</option>
                        <option value="EM_CONTATO">em contato</option>
                        <option value="CONVERTIDO">convertido</option>
                      </select>
                      {updatingStatus[lead.id] && (
                        <span className="ml-2 text-xs text-gray-500">
                          atualizando...
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// componente principal com suspense
export default function Leads() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">carregando...</p>
        </div>
      }
    >
      <LeadsContent />
    </Suspense>
  );
}
