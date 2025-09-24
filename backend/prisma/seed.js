const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // verifica quantos leads já existem
  const existingLeads = await prisma.lead.count();
  console.log(`📊 Leads existentes no banco: ${existingLeads}`);

  // seeds de leads para teste 
  const leads = [
    {
      nome: "Ana Silva",
      email: "ana.silva123@gmail.com",
      telefone: "11987654321",
    },
    {
      nome: "Carlos Oliveira",
      email: "carlos.oliveira@hotmail.com",
      telefone: "21976543210",
    },
    {
      nome: "Mariana Santos",
      email: "mari.santos@yahoo.com.br",
      telefone: "31965432109",
    },
    {
      nome: "Bruno Costa",
      email: "bruno_costa@gmail.com",
      telefone: "41954321098",
    },
    {
      nome: "Fernanda Lima",
      email: "fernanda.lima@outlook.com",
      telefone: "51943210987",
    },
    {
      nome: "Rafael Pereira",
      email: "rafael.pereira@gmail.com",
      telefone: "61932109876",
    },
    {
      nome: "Juliana Alves",
      email: "ju.alves@hotmail.com",
      telefone: "71921098765",
    },
    {
      nome: "Diego Martins",
      email: "diego123@gmail.com",
      telefone: "81910987654",
    },
    {
      nome: "Camila Rodrigues",
      email: "camilarodrigues@yahoo.com",
      telefone: "11999888777",
    },
    {
      nome: "Lucas Ferreira",
      email: "lucas.ferreira@gmail.com",
      telefone: "21998765432",
    },
    {
      nome: "Patricia Mendes",
      email: "patty.mendes@hotmail.com",
      telefone: "31997654321",
    },
    {
      nome: "Thiago Souza",
      email: "thiago_souza@outlook.com",
      telefone: "41996543210",
    },
    {
      nome: "Larissa Barbosa",
      email: "larissa.barbosa@gmail.com",
      telefone: "51995432109",
    },
    {
      nome: "Rodrigo Nunes",
      email: "rodrigo.nunes@yahoo.com.br",
      telefone: "61994321098",
    },
    {
      nome: "Amanda Cardoso",
      email: "amanda123@gmail.com",
      telefone: "71993210987",
    },
    {
      nome: "Felipe Rocha",
      email: "felipe.rocha@hotmail.com",
      telefone: "81992109876",
    },
    {
      nome: "Gabriela Dias",
      email: "gabi.dias@outlook.com",
      telefone: "11988776655",
    },
    {
      nome: "Mateus Gomes",
      email: "mateus.gomes@gmail.com",
      telefone: "21987665544",
    },
    {
      nome: "Vanessa Moreira",
      email: "vanessa_moreira@yahoo.com",
      telefone: "31986554433",
    },
    {
      nome: "Leonardo Pinto",
      email: "leo.pinto@gmail.com",
      telefone: "41985443322",
    },
    {
      nome: "Bianca Araujo",
      email: "bianca.araujo@hotmail.com",
      telefone: "51984332211",
    },
    {
      nome: "Gustavo Ribeiro",
      email: "gustavo123@outlook.com",
      telefone: "61983221100",
    },
    {
      nome: "Priscila Castro",
      email: "pri.castro@gmail.com",
      telefone: "71982110099",
    },
    {
      nome: "Renato Silva",
      email: "renato.silva@yahoo.com.br",
      telefone: "81981009988",
    },
    {
      nome: "Tatiana Lopes",
      email: "tatiana.lopes@gmail.com",
      telefone: "11980998877",
    },
  ];

  console.log("📊 Adicionando novos leads...");

  let createdCount = 0;
  let skippedCount = 0;

  // criar leads um por um, verificando duplicatas por email
  for (const leadData of leads) {
    try {
      const existingLead = await prisma.lead.findFirst({
        where: { email: leadData.email },
      });

      if (existingLead) {
        console.log(`⚠️ Lead já existe: ${leadData.nome} (${leadData.email})`);
        skippedCount++;
      } else {
        const lead = await prisma.lead.create({
          data: leadData,
        });
        console.log(`✅ Lead criado: ${lead.nome}`);
        createdCount++;
      }
    } catch (error) {
      console.log(`❌ Erro ao criar lead ${leadData.nome}: ${error.message}`);
      skippedCount++;
    }
  }

  console.log("🎉 Seed concluído!");
  console.log(`📈 Leads criados: ${createdCount}`);
  console.log(`⏭️ Leads já existentes (ignorados): ${skippedCount}`);

  const totalLeads = await prisma.lead.count();
  console.log(`📊 Total de leads no banco: ${totalLeads}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Erro durante o seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
