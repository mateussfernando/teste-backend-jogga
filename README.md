# 🚀 Sistema de Captação de Leads

Sistema completo para captação e gerenciamento de leads com integração WhatsApp, desenvolvido para o teste técnico Backend Júnior/Pleno.

**🌐 Acesse o sistema:** https://lead-capture-zu3u.onrender.com/

## 📋 Funcionalidades

- ✅ **Captação de Leads**: Formulário com campos obrigatórios (Nome, E-mail, Telefone)
- ✅ **Redirecionamento WhatsApp**: Automático após cadastro
- ✅ **Prevenção de Duplicatas**: Bloqueia mesmo e-mail por 1 hora
- ✅ **Visualização de Leads**: Lista organizada para o cliente
- ✅ **Gerenciamento de Status**: Novo, Em Contato, Convertido
- ✅ **Sistema de Busca**: Por nome ou e-mail
- ✅ **Filtros Avançados**: Por status e data
- ✅ **Dashboard**: Estatísticas em tempo real

## 🛠️ Tecnologias

**Backend:**

- Node.js + Express
- PostgreSQL + Prisma ORM
- Express Validator
- CORS

**Frontend:**

- Next.js
- React
- Tailwind

## 📦 Estrutura do Projeto

```
teste-backend-jogga/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Controladores da API
│   │   ├── middleware/      # Validações
│   │   ├── routes/          # Rotas da API
│   │   └── server.js        # Servidor principal
│   ├── prisma/
│   │   ├── schema.prisma    # Schema do banco
│   │   └── seed.js          # Dados iniciais
│   └── package.json
├── frontend/
│   ├── src/app/
│   │   ├── page.js          # Página de captação
│   │   └── leads/page.js    # Página de visualização
│   └── package.json
└── README.md
```

## ⚙️ Instalação e Configuração

### 1. Clonar o Repositório

```bash
git clone https://github.com/mateussfernando/teste-backend-jogga.git
cd teste-backend-jogga
```

### 2. Configurar Banco de Dados

Certifique-se de ter o PostgreSQL rodando. O projeto usa Docker Compose:

```bash
cd backend
sudo systemctl stop postgresql
docker compose up -d
```

### 3. Configurar Backend

```bash
cd backend

# Instalar dependências
npm install

# Configurar banco de dados
npm run db:push

# (Opcional) Popular com dados de teste
npm run db:seed
```

### 4. Configurar Frontend

```bash
cd ../frontend

# Instalar dependências
npm install
```

## 🚀 Como Executar

### Backend (Terminal 1)

```bash
cd backend
npm run dev
```

Servidor rodará em: `http://localhost:8000`

### Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

Aplicação rodará em: `http://localhost:3000`

## 📋 Scripts Disponíveis

### Backend

```bash
npm run dev         # Inicia servidor em modo desenvolvimento
npm run db:generate # Gera cliente Prisma
npm run db:push     # Aplica schema ao banco
npm run db:seed     # Popula banco com dados teste
npm run studio      # Abre Prisma Studio (porta 5555)
```

### Frontend

```bash
npm run dev         # Inicia aplicação Next.js
```

### 📝 Leads

#### `POST /leads`

Cria um novo lead

**Body:**

```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "telefone": "(11) 99999-9999"
}
```

**Response (201):**

```json
{
  "message": "Lead cadastrado com sucesso!",
  "lead": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "telefone": "(11) 99999-9999",
    "status": "NOVO",
    "createdAt": "2025-09-24T10:00:00.000Z",
    "updatedAt": "2025-09-24T10:00:00.000Z"
  }
}
```

**Validações:**

- Previne duplicatas (mesmo e-mail em 1 hora)
- Campos obrigatórios: nome, email, telefone
- Formato de e-mail válido

---

#### `GET /leads`

Lista leads com filtros opcionais

**Query Parameters:**

- `search` - Busca por nome ou e-mail
- `status` - Filtra por status (NOVO, EM_CONTATO, CONVERTIDO)
- `startDate` - Data início (YYYY-MM-DD)
- `endDate` - Data fim (YYYY-MM-DD)

**Exemplos:**

```bash
# Todos os leads
GET /api/leads

# Buscar por nome ou e-mail
GET /api/leads?search=joão

# Filtrar por status
GET /api/leads?status=CONVERTIDO

# Filtrar por período
GET /api/leads?startDate=2025-01-01&endDate=2025-01-31

# Combinar filtros
GET /api/leads?search=silva&status=NOVO&startDate=2025-01-01
```

**Response (200):**

```json
{
  "leads": [...],
  "total": 50,
  "filters": {
    "search": "joão",
    "status": "NOVO",
    "startDate": "2025-09-20",
    "endDate": null
  },
  "statusCount": {
    "NOVO": 20,
    "EM_CONTATO": 15,
    "CONVERTIDO": 15
  }
}
```

---

#### `PUT /leads/:id/status`

Atualiza status de um lead

**Params:**

- `id` - ID do lead

**Body:**

```json
{
  "status": "EM_CONTATO"
}
```

**Response (200):**

```json
{
  "message": "Status do lead atualizado com sucesso!",
  "lead": {
    "id": 1,
    "status": "EM_CONTATO",
    "updatedAt": "2025-09-24T11:00:00.000Z"
  }
}
```

**Status válidos:** `NOVO`, `EM_CONTATO`, `CONVERTIDO`

---

#### `GET /leads/stats`

Retorna estatísticas dos leads

**Response (200):**

```json
{
  "NOVO": 25,
  "EM_CONTATO": 15,
  "CONVERTIDO": 10,
  "TOTAL": 50
}
```

---

#### `GET /leads/whatsapp`

Retorna URL do WhatsApp para redirecionamento

**Response (200):**

```json
{
  "whatsappUrl": "https://wa.me/5581999898306",
  "numero": "81 99989-8306"
}
```

## 🎯 Fluxo de Uso

1. **Captação**: Usuário preenche formulário na página inicial
2. **Validação**: Sistema valida dados e previne duplicatas
3. **Redirecionamento**: Após 2 segundos, redireciona para WhatsApp
4. **Gestão**: Cliente acessa `/leads` para ver e gerenciar leads
5. **Status**: Cliente atualiza status conforme andamento

## 🔒 Validações e Regras de Negócio

- **Campos obrigatórios**: Nome, e-mail e telefone
- **E-mail único**: Mesmo e-mail não pode ser cadastrado em 1 hora
- **Status válidos**: NOVO → EM_CONTATO → CONVERTIDO
- **Timestamps automáticos**: createdAt e updatedAt
- **Validação backend**: Express Validator para todos endpoints

by Mateus Fernando
