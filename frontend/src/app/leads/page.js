"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { API_URL } from "../../config/api";

export default function Leads() {
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
        // Atualizar a lista de leads localmente
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

        // Atualizar estatísticas
        fetchLeads();
      } else {
        const errorData = await response.json();
        console.error("Erro ao atualizar status:", errorData);
        alert("Erro ao atualizar status do lead");
      }
    } catch (error) {
      console.error("Erro de conexão ao atualizar status:", error);
      alert("Erro de conexão ao atualizar status");
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
        console.error("Erro ao buscar leads:", data.error);
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
    } finally {
      setLoading(false);
    }
  };

  // carregar dados ao montar componente e quando URL mudar
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
        return "Novo";
      case "EM_CONTATO":
        return "Em Contato";
      case "CONVERTIDO":
        return "Convertido";
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

  // função para atualizar status na URL automaticamente
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
          <h1 className="text-3xl font-bold text-black">Leads Cadastrados</h1>
          <button
            onClick={() => router.push("/")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Voltar
          </button>
        </div>

        {/* Estatísticas */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <h3 className="font-semibold text-gray-800">Novos</h3>
              <p className="text-2xl font-bold text-gray-900">
                {stats.NOVO || 0}
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <h3 className="font-semibold text-gray-800">Em Contato</h3>
              <p className="text-2xl font-bold text-gray-900">
                {stats.EM_CONTATO || 0}
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <h3 className="font-semibold text-gray-800">Convertidos</h3>
              <p className="text-2xl font-bold text-gray-900">
                {stats.CONVERTIDO || 0}
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <h3 className="font-semibold text-gray-800">Total</h3>
              <p className="text-2xl font-bold text-gray-900">
                {(stats.NOVO || 0) +
                  (stats.EM_CONTATO || 0) +
                  (stats.CONVERTIDO || 0)}
              </p>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Buscar por nome ou email
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite nome ou email..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Filtrar por status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none"
            >
              <option value="">Todos os status</option>
              <option value="NOVO">Novo</option>
              <option value="EM_CONTATO">Em Contato</option>
              <option value="CONVERTIDO">Convertido</option>
            </select>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={applyFilters}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Aplicar Filtros
          </button>
          <button
            onClick={clearFilters}
            className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Limpar Filtros
          </button>
        </div>

        {/* Lista de Leads */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Carregando leads...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Nenhum lead encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telefone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data de Cadastro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última Atualização
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
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
                        <option value="NOVO">Novo</option>
                        <option value="EM_CONTATO">Em Contato</option>
                        <option value="CONVERTIDO">Convertido</option>
                      </select>
                      {updatingStatus[lead.id] && (
                        <span className="ml-2 text-xs text-gray-500">
                          Atualizando...
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
