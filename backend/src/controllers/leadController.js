import prisma from "../utils/prismaClient.js";

export const createLead = async (req, res) => {
  try {
    const { nome, email, telefone } = req.body;

    // verifica se já existe lead com mesmo email nos últimos 60 minutos
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const existingLead = await prisma.lead.findFirst({
      where: {
        email: email,
        createdAt: {
          gte: oneHourAgo,
        },
      },
    });

    if (existingLead) {
      return res.status(400).json({
        error: "já existe um lead com este email cadastrado na última hora",
      });
    }

    // cria o novo lead
    const newLead = await prisma.lead.create({
      data: { nome, email, telefone },
    });

    res.status(201).json({
      message: "lead cadastrado com sucesso!",
      lead: newLead,
    });
  } catch (error) {
    console.error("erro ao cadastrar lead:", error);

    if (error.code === "P2002") {
      return res.status(400).json({
        error: "este email já está cadastrado no sistema",
      });
    }

    res.status(500).json({ error: "erro interno do servidor" });
  }
};

// listar leads com filtros
export const getLeads = async (req, res) => {
  try {
    const { search, status, startDate, endDate } = req.query;

    // construção dos filtros
    const where = {};

    // filtro de busca
    if (search) {
      where.OR = [
        { nome: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    // filtro por status
    if (status) {
      where.status = status;
    }

    // filtro por data
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    // executa consultas em paralelo
    const [leads, totalLeads, leadsByStatus] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: "desc" },
      }),
      prisma.lead.count({ where }),
      prisma.lead.groupBy({
        by: ["status"],
        where: Object.keys(where).length > 0 ? where : {},
        _count: { id: true },
      }),
    ]);

    // formata contagem por status
    const statusCount = { NOVO: 0, EM_CONTATO: 0, CONVERTIDO: 0 };
    leadsByStatus.forEach((item) => {
      statusCount[item.status] = item._count.id;
    });

    res.json({
      leads,
      total: totalLeads,
      filters: { search, status, startDate, endDate },
      statusCount,
    });
  } catch (error) {
    console.error("erro ao buscar leads:", error);
    res.status(500).json({ error: "erro ao buscar leads" });
  }
};

// estatísticas dos leads
export const getLeadsStats = async (req, res) => {
  try {
    const leadsByStatus = await prisma.lead.groupBy({
      by: ["status"],
      _count: { id: true },
    });

    const totalLeads = await prisma.lead.count();

    const statusCount = {
      NOVO: 0,
      EM_CONTATO: 0,
      CONVERTIDO: 0,
      TOTAL: totalLeads,
    };
    leadsByStatus.forEach((item) => {
      statusCount[item.status] = item._count.id;
    });

    res.json(statusCount);
  } catch (error) {
    console.error("erro ao buscar estatísticas:", error);
    res.status(500).json({ error: "erro ao buscar estatísticas" });
  }
};

//URL do WhatsApp
export const getWhatsAppUrl = async (req, res) => {
  try {
    const whatsappUrl = `https://wa.me/5581999898306`;

    res.json({
      whatsappUrl,
      numero: "81 99989-8306",
    });
  } catch (error) {
    console.error("Erro ao gerar URL do WhatsApp:", error);
    res.status(500).json({ error: "Erro ao gerar URL do WhatsApp" });
  }
};

// Atualizar status do lead
export const updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Verificar se o lead existe
    const existingLead = await prisma.lead.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingLead) {
      return res.status(404).json({
        error: "Lead não encontrado",
      });
    }

    // Atualizar o status do lead
    const updatedLead = await prisma.lead.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    res.json({
      message: "Status do lead atualizado com sucesso!",
      lead: updatedLead,
    });
  } catch (error) {
    console.error("Erro ao atualizar status do lead:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};
