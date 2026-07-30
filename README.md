# Portfolio UGC

**SaaS para criadoras de conteúdo UGC** — crie, aloje e partilhe o seu portfólio profissional em menos de 10 minutos.

> "Do primeiro vídeo ao portfólio pronto para enviar às marcas."

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Linguagem | TypeScript 5 |
| Estilos | Tailwind CSS v4 + shadcn/ui (preset Nova / Base UI) |
| Base de dados | MongoDB 7 + Mongoose 9 |
| Autenticação | NextAuth v5 beta (Credentials + JWT) |
| IA | Serviço desacoplado — mock incluído; suporte Anthropic |
| Storage | Serviço desacoplado — mock incluído; suporte S3/R2 |
| Gráficos | Recharts 3 |
| Formulários | React Hook Form + Zod |
| Animações | Framer Motion |

---

## Pré-requisitos

- Node.js ≥ 20
- MongoDB 7 (local via Docker ou Atlas)
- (Opcional) Chave Anthropic para IA real

---

## Instalação

```bash
git clone https://github.com/miostech/portifoliougc.git
cd portifoliougc
npm install
```

### Variáveis de ambiente

Copie o exemplo e preencha:

```bash
cp .env.example .env.local
```

| Variável | Descrição |
|---|---|
| `MONGODB_URI` | URI de conexão MongoDB |
| `AUTH_SECRET` | Segredo NextAuth (gere com `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | URL base da aplicação (ex.: `http://localhost:3000`) |
| `NEXT_PUBLIC_APP_URL` | Igual ao anterior, exposto ao cliente |
| `ANTHROPIC_API_KEY` | (Opcional) Chave Anthropic para IA real |
| `ADMIN_EMAIL` | Email do utilizador administrador |

### Iniciar MongoDB (Docker)

```bash
docker compose up -d
```

### Seed — dados demo

```bash
npm run seed
```

Cria:
- Admin (`$ADMIN_EMAIL` / `Demo1234!`)
- Sofia Martins — plano Pro, portfólio publicado com 3 vídeos
- Beatriz Oliveira — plano Essencial, portfólio publicado com 1 vídeo
- Analytics events simulados para cada portfólio

### Iniciar em desenvolvimento

```bash
npm run dev
```

Aceda a [http://localhost:3000](http://localhost:3000).

---

## Estrutura do projeto

```
src/
├── app/
│   ├── (auth)/          # Login e cadastro
│   ├── (marketing)/     # Landing, preços, templates, etc.
│   ├── admin/           # Painel administrativo (role: admin)
│   ├── app/             # App autenticada (role: user)
│   │   ├── analytics/
│   │   ├── assinatura/
│   │   ├── conteudos/
│   │   ├── ia/
│   │   ├── modelos/
│   │   ├── plano-de-gravacao/
│   │   ├── portfolio/
│   │   └── portfolio-score/
│   ├── api/
│   │   ├── assistant/   # POST /api/assistant — IA chat
│   │   └── auth/        # NextAuth handler
│   └── p/[slug]/        # Portfólio público
├── components/
│   ├── admin/           # Tabelas e vistas admin
│   ├── analytics/       # Dashboard de analytics
│   ├── app/             # Shell, PageHeader, EmptyState
│   ├── content/         # Gestor de conteúdos
│   ├── ia/              # Assistente IA (chat)
│   ├── onboarding/      # Wizard de onboarding
│   ├── portfolio/       # Editor e renderer de portfólio
│   ├── score/           # Score dashboard
│   ├── subscription/    # Cards de planos
│   ├── ui/              # Componentes shadcn/ui
│   └── video/           # Biblioteca e plano de gravação
├── lib/
│   ├── actions/         # Server Actions (auth, portfolio, content, video, score, analytics, admin)
│   ├── services/
│   │   ├── ai/          # AIProvider interface + MockAIProvider
│   │   └── storage/     # StorageProvider interface + MockStorageProvider
│   ├── auth.ts          # NextAuth config
│   ├── db.ts            # Mongoose singleton
│   ├── plans.ts         # Planos e feature flags
│   ├── templates.ts     # Templates de portfólio
│   └── video-models.ts  # Catálogo estático de modelos UGC
└── models/              # Schemas Mongoose (User, Portfolio, Media, ...)
```

---

## Planos

| | Essencial (€12/mês) | Pro (€24/mês) |
|---|---|---|
| Portfólio público | ✅ | ✅ |
| Templates | Essenciais | Todos |
| IA (copy) | ✅ | ✅ |
| Analytics | Básico | Avançado |
| Portfolio Score | ✅ | ✅ |
| Modelos de vídeos | Básico | Completo |
| Assistente IA (chat) | ❌ | ✅ |
| Domínio personalizado | ❌ | ✅ |
| Media kit | ❌ | ✅ |
| Sem marca Portfolio UGC | ❌ | ✅ |

> Sem plano gratuito. Registo, onboarding e preview são livres — publicação requer plano pago.

---

## Serviços desacoplados

### IA

O contrato `AIProvider` (em `src/lib/services/ai/types.ts`) abstrai toda a lógica de IA. O `MockAIProvider` incluído retorna conteúdo realista em português sem necessidade de credenciais.

Para ligar IA real (Anthropic):
1. Adicione `ANTHROPIC_API_KEY` ao `.env.local`
2. Implemente `AnthropicAIProvider` com o mesmo interface
3. Troque em `src/lib/services/ai/index.ts`

### Storage

O contrato `StorageProvider` abstrai o upload de ficheiros. O mock retorna URLs de placeholder. Para ligar S3/R2, implemente o mesmo interface e troque em `src/lib/services/storage/index.ts`.

---

## Seed de produção

O script `scripts/seed.ts` é idempotente (limpa e recria). Para ambientes de produção, crie um script separado sem o `deleteMany` inicial ou use variáveis de ambiente para controlar o comportamento.

---

## Comandos úteis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run lint         # ESLint
npx tsc --noEmit     # Verificação TypeScript
npm run seed         # Popular a base de dados com dados demo
docker compose up -d # Iniciar MongoDB local
```

---

## Licença

Privado — © 2026 MiosTech. Todos os direitos reservados.
