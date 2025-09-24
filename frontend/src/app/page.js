"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "../config/api";

export default function home() {
  const router = useRouter();

  // estado para armazenar os dados do formulário
  const [formdata, setformdata] = useState({
    nome: "",
    email: "",
    telefone: "",
  });

  // estado para mensagens de sucesso/erro
  const [message, setmessage] = useState({ type: "", text: "" });

  // função para atualizar os campos do formulário
  const handlechange = (e) => {
    setformdata({
      ...formdata,
      [e.target.name]: e.target.value,
    });
  };

  // função para enviar o formulário
  const handlesubmit = async (e) => {
    e.preventDefault();
    setmessage({ type: "", text: "" });

    try {
      // cadastrar o lead na api
      const response = await fetch(`${API_URL}/api/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });

      const data = await response.json();

      if (response.ok) {
        // se o cadastro for bem sucedido
        setmessage({
          type: "success",
          text: "lead cadastrado! redirecionando para whatsapp...",
        });

        // buscar url do whatsapp da api
        try {
          const whatsappresponse = await fetch(`${API_URL}/api/leads/whatsapp`);
          const whatsappdata = await whatsappresponse.json();

          // redirecionar para whatsapp após 2 segundos
          setTimeout(() => {
            if (whatsappdata.whatsappUrl) {
              window.open(whatsappdata.whatsappUrl, "_blank");
            } else {
              console.error("URL do WhatsApp não encontrada na resposta");
            }
          }, 2000);
        } catch (whatsappError) {
          console.error("Erro ao buscar URL do WhatsApp:", whatsappError);
        }

        // limpar o formulário
        setformdata({ nome: "", email: "", telefone: "" });
      } else {
        // se houver erro no cadastro
        setmessage({
          type: "error",
          text: data.error || "erro ao cadastrar lead",
        });
      }
    } catch (error) {
      // erro de conexão com o servidor
      setmessage({
        type: "error",
        text: "erro de conexão com o servidor",
      });
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#d9d9d9" }}
    >
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">
            captação de leads
          </h1>
        </div>

        {/* exibir mensagem de sucesso ou erro */}
        {message.text && (
          <div
            className={`mb-4 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-100 text-black border border-green-200"
                : "bg-red-100 text-black border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* formulário de captação */}
        <form onSubmit={handlesubmit} className="space-y-6">
          <div>
            <label
              htmlFor="nome"
              className="block text-sm font-medium text-black mb-2"
            >
              nome *
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formdata.nome}
              onChange={handlechange}
              required
              className="w-full px-3 py-3 border border-gray-300 rounded-lg text-black focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-black mb-2"
            >
              e-mail *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formdata.email}
              onChange={handlechange}
              required
              className="w-full px-3 py-3 border border-gray-300 rounded-lg text-black focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="telefone"
              className="block text-sm font-medium text-black mb-2"
            >
              telefone *
            </label>
            <input
              type="tel"
              id="telefone"
              name="telefone"
              value={formdata.telefone}
              onChange={handlechange}
              required
              className="w-full px-3 py-3 border border-gray-300 rounded-lg text-black focus:outline-none"
            />
          </div>

          {/* botão de envio */}
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-3 px-4 rounded-lg"
          >
            enviar e ir para whatsapp
          </button>

          {/* botão para ver leads */}
          <button
            type="button"
            onClick={() => router.push("/leads")}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg mt-4"
          >
            ver leads cadastrados
          </button>
        </form>
      </div>
    </div>
  );
}
