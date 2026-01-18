## Media Repository Client

Client (Next.js) que consome a API do `media-repository-admin` e usa **Clerk** para autenticação.

### Pré-requisitos

- **Node.js**: recomendado **20+**
- **Admin rodando**: `http://localhost:3000` (API em `http://localhost:3000/api`)
- **Clerk**: chaves para autenticação (Publishable + Secret)

### Variáveis de ambiente

Por segurança do workspace, o template está em `env.example` (sem o ponto). Crie um arquivo `.env.local` e copie o conteúdo:

- Copie `env.example` → `.env.local`
- Preencha no mínimo:
  - `NEXT_PUBLIC_API_URL` (ex: `http://localhost:3000/api`)
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
  - `NEXT_PUBLIC_SEARCH_SECRET` (opcional; usado pra liberar “archived”)

### Subir local

Na pasta `media-repository-client`:

```bash
npm install
npm run dev
```

Por padrão o client sobe em `http://localhost:3001`.
