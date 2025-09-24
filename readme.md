
```bash
npm run dev          # Inicia o servidor em modo desenvolvimento
npm run db:generate  # Gera o cliente Prisma
npm run db:push      # Aplica o schema no banco
npm run db:seed      # Adiciona dados de teste
npm run studio       # Interface visual do banco (porta 5555)
```
# 🚀 Backend API - Sistema de Leads

API REST para gerenciamento de leads desenvolvida com Node.js, Express, Prisma e PostgreSQL.

## 📋 Pré-requisitos

- Node.js (v16+)
- Docker e Docker Compose
- Git

## ⚡ Instalação e Execução

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd teste-backend-jogga/backend

# 2. Instale as dependências
npm install

# 3. Configure o ambiente
DATABASE_URL="postgresql://admin:senha123@localhost:5432/leadsdb"

# 4. Inicie o banco de dados
docker-compose up -d

# 5. Configure o Prisma
npm run db:generate
npm run db:push

# 6. (Opcional) Adicione dados de teste
npm run db:seed
# e inicie prima studio
 "studio": "prisma studio --port 5555"


# 7. Inicie o servidor
npm run dev
```

O servidor estará disponível em: `http://localhost:3001`

## 📚 Endpoints da API

### **POST** `/api/leads`
Cadastra um novo lead

**Body (JSON):**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "telefone": "11999999999"
}
```

**Resposta (201):**
```json
{
  "message": "lead cadastrado com sucesso!",
  "lead": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "telefone": "11999999999",
    "status": "NOVO",
    "createdAt": "2024-09-24T10:30:00.000Z",
    "updatedAt": "2024-09-24T10:30:00.000Z"
  }
}
```

### **GET** `/api/leads`
Lista leads com filtros opcionais

**Query Parameters:**
- `search` - Busca por nome ou email
- `status` - Filtra por status (NOVO, EM_CONTATO, CONVERTIDO)
- `startDate` - Data início (YYYY-MM-DD)
- `endDate` - Data fim (YYYY-MM-DD)

**Exemplos:**
```bash
# Todos os leads
GET /api/leads

# Buscar por nome ou email
GET /api/leads?search=joão

# Filtrar por status
GET /api/leads?status=CONVERTIDO

# Filtrar por período
GET /api/leads?startDate=2024-01-01&endDate=2024-01-31

# Combinar filtros
GET /api/leads?search=silva&status=NOVO&startDate=2024-01-01
```

**Resposta (200):**
```json
{
  "leads": [...],
  "total": 25,
  "filters": {
    "search": "silva",
    "status": "NOVO"
  },
  "statusCount": {
    "NOVO": 15,
    "EM_CONTATO": 8,
    "CONVERTIDO": 2
  }
}
```

### **GET** `/api/leads/stats`
Retorna estatísticas dos leads

**Resposta (200):**
```json
{
  "NOVO": 15,
  "EM_CONTATO": 8,
  "CONVERTIDO": 2,
  "TOTAL": 25
}
```

### **GET** `/api/whatsapp`
Retorna URL do WhatsApp para contato

**Resposta (200):**
```json
{
  "whatsappUrl": "https://wa.me/5581999898306",
  "numero": "81 99989-8306"
}
```



