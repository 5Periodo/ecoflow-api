# EcoFlow API - Gestão Inteligente de Resíduos

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>

## 📝 Descrição

A **EcoFlow API** é o motor do sistema EcoFlow, uma solução tecnológica projetada para revolucionar a gestão de resíduos em condomínios. A API gerencia desde o cadastro de moradores e apartamentos até a validação de descartes via QR Code e um sistema completo de recompensas por gamificação.

---

## 🚀 Tecnologias

- **Framework:** [NestJS](https://nestjs.com/) (Node.js)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Banco de Dados:** PostgreSQL
- **Autenticação:** JWT (JSON Web Token) com Passport.js
- **Documentação:** [Swagger/OpenAPI](https://swagger.io/)
- **Linguagem:** TypeScript

---

## 🛠️ Funcionalidades Principais

### 🏢 Gestão de Condomínios
- Cadastro e configuração de metas mensais de coleta (kg).
- Gerenciamento de apartamentos e unidades habitacionais.

### 👥 Moradores
- Sistema de perfil com pontuação acumulada.
- Níveis de engajamento (gamificação).
- Autenticação segura para App Mobile.

### ♻️ Descartes (Ciclo Completo)
- Registro de descartes vinculado a Ecopoints específicos.
- Validação via hash de QR Code.
- Fluxo de aprovação/reprovação pelo síndico com atribuição de pontos.
- Suporte a múltiplas categorias de materiais (Papel, Plástico, Vidro, Metal).

### 🎁 Recompensas
- Gestão de inventário de prêmios e benefícios.
- Sistema de resgate de cupons baseado em pontos.
- Histórico de utilização de benefícios.

### 📊 Dashboard Administrativo
- Agregação de métricas em tempo real.
- Ranking de moradores e engajamento por unidade.
- Monitoramento de progresso de metas mensais.

---

## ⚙️ Configuração do Projeto

### Pré-requisitos
- Node.js (v20+)
- Docker (opcional, para o banco de dados)
- Instância PostgreSQL

### Instalação
1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure o arquivo `.env` (use o `.env.example` como base):
```env
DATABASE_URL="postgresql://user:password@localhost:5432/ecoflow"
JWT_SECRET="sua_chave_secreta_aqui"
PORT=3000
```

4. Execute as migrações do Prisma:
```bash
npx prisma migrate dev
```

5. (Opcional) Popule o banco com dados iniciais:
```bash
npm run seed
```

### Execução
```bash
# Desenvolvimento (com watch mode)
npm run start:dev

# Produção
npm run start:prod
```

---

## 📖 Documentação da API

A documentação interativa da API (Swagger) está disponível em:
👉 **`http://localhost:3000/docs`**

---

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).
