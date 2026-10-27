# PixelOracle — Frontend

[![CI](https://github.com/Pixel-Oracle-TCC/Pixel-Oracle-FrontEnd/actions/workflows/ci.yml/badge.svg)](https://github.com/Pixel-Oracle-TCC/Pixel-Oracle-FrontEnd/actions/workflows/ci.yml)

Interface Angular do **Pixel Oracle**: dashboard de evidências de reviews reais para o pré-lançamento. O protótipo atual usa dados mockados no formato de `POST /api/report` (contrato v3).

O front consome **apenas** a API em `PixelOracle-API` (`http://localhost:3000`). Não chama o ml-service (`:8000`) diretamente.

| Rota | O que faz |
|------|-----------|
| `/` | Landing alinhada ao escopo do TCC |
| `/analisar` | Formulário de pitch + relatório completo (`POST /api/report`) |

---

## Stack

- **Angular 21** (standalone, zoneless change detection)
- TypeScript ~5.9, RxJS, Sass
- Vitest + jsdom (testes)
- Clean architecture espelhando a API: `domain` → `application` → `infrastructure` → `presentation`

`packageManager` do repo: `npm@11.13.0` (outras versões do npm costumam funcionar).

---

## Requisitos

- **Node.js LTS** + npm
- **Git**
- (Opcional) Angular CLI global: `npm i -g @angular/cli`
- A API local é opcional enquanto `useMockApi` estiver `true` em `src/environments/`

### macOS (rápido)

```bash
brew install node git
node -v && npm -v
```

### Windows

1. Instale Node LTS em [nodejs.org](https://nodejs.org/)
2. Instale Git em [git-scm.com](https://git-scm.com/download/win)
3. Reabra o terminal e confira: `node -v`, `npm -v`, `git --version`

---

## Como rodar

```bash
git clone <URL_DO_REPOSITORIO>
cd Pixel-Oracle-FrontEnd
npm install
npm start
```

Abra [http://localhost:4200/](http://localhost:4200/).  
Fluxo do produto: [http://localhost:4200/analisar](http://localhost:4200/analisar).

### Protótipo mockado

`environment.useMockApi` está `true`. O formulário em `/analisar` devolve um relatório ilustrativo (elogios, reclamações, fatores decisivos, reviews de referência e jogos similares) sem chamar a API. O checkbox “Simular base sem reviews suficientes” mostra o empty state.

Para ligar a API real, mude `useMockApi` para `false` e suba o `PixelOracle-API` na porta `3000`.

---

## Scripts

| Comando | Uso |
|---------|-----|
| `npm start` | Dev server (`ng serve`) |
| `npm run build` | Build de produção |
| `npx ng build -c development` | Build de desenvolvimento (usa `environment.development.ts`) |
| `npm run watch` | Build em watch (dev) |
| `npm test` | Testes unitários |

O CI no GitHub Actions (`.github/workflows/ci.yml`) roda em pull requests e nos pushes de `develop` e `main`: `npm test -- --watch=false`, `npm run build` e `npm audit --audit-level=critical`, mais varredura de segredos. A execução aparece na aba Actions com o número do pull request. O selo no topo desta página mostra o resultado na `main`. No pull request, o check `test` comenta a contagem dos testes e se `mapFormToGamePitch` exercitou o contrato de `POST /api/report`. O job `relatório` junta o resultado dos quatro checks. `main` e `develop` não aceitam merge enquanto `test`, `build`, `audit` e `secrets` não passarem. O texto do pull request já vem preenchido em português por [`.github/PULL_REQUEST_TEMPLATE.md`](.github/PULL_REQUEST_TEMPLATE.md). O histórico está em [`CHANGELOG.md`](CHANGELOG.md). Ambientes DEV, homologação e produção ficam em [`docs/ci-cd.md`](https://github.com/Pixel-Oracle-TCC/PixelOracle-back-end/blob/main/docs/ci-cd.md) no repositório da API.

Porta ocupada:

```bash
npm start -- --port 4201
```

Erro de watcher (EMFILE / too many open files):

```bash
npm start -- --poll 2000
```

---

## Arquitetura

```
src/
├── environments/                 # apiUrl + timeout do relatório
├── styles/
│   └── _tokens.scss              # design tokens (cores, tipografia, risco)
├── styles.scss
└── app/
    ├── domain/
    │   ├── entities/             # GamePitch, FullReport, ApiError
    │   └── ports/                # IReportRepository, IHealthRepository
    ├── application/
    │   ├── use-cases/            # GenerateFullReport, CheckApiHealth
    │   └── mappers/              # formulário → GamePitch
    ├── infrastructure/
    │   ├── http/                 # adapters reais, normalize-report, map-http-error
    │   ├── mock/                 # relatório ilustrativo do protótipo
    │   └── tokens.ts             # InjectionTokens dos ports
    └── presentation/
        ├── home/                 # landing
        ├── analisar/             # formulário + dashboard
        ├── layouts/              # site-header
        └── shared/               # highlight-card, decisive-factors, reference-reviews…
```

**Regra de dependência:** `presentation` → `application` → `domain` ← `infrastructure` (adapters).  
Componentes **não** usam `HttpClient` direto.

### Integração com a API

| Método | Path | Uso no front |
|--------|------|----------------|
| `GET` | `/api/health` | Banner “API offline” em `/analisar` |
| `POST` | `/api/report` | Relatório completo (fluxo principal) |

- Timeout do relatório: **180s** (primeira chamada pode carregar embeddings)
- Erros tratados: `422` (validação), `502`/`503` (ML offline), rede/timeout
- Payload **só** metadados pré-lançamento — nunca `total_reviews`, `user_score`, vendas, etc.

Contrato tipado: `src/app/domain/entities/`.  
Detalhes: `docs/FRONTEND_ATUALIZACAO.md` e `CONTRATOS_API.md` na API.

---

## O que a tela `/analisar` mostra

1. Formulário de pitch (título, descrição, gêneros e preço opcional)
2. Loading: “Buscando jogos parecidos e reviews…”
3. Resumo narrado, badge `gemini` / `fallback` e cobertura da amostra
4. Elogios e reclamações recorrentes, com métricas, jogos-exemplo e citações
5. Fatores decisivos (aumenta ou reduz a recomendação)
6. Alertas e empty state quando os dados são insuficientes
7. Reviews de referência, com resposta do desenvolvedor quando houver
8. Jogos similares com nota da Steam

---

## Documentação (TCC / Obsidian)

Para o time entender o front de ponta a ponta:

| Onde | Conteúdo |
|------|----------|
| Vault `TCC/frontend/` | Arquitetura, fluxo Analisar, design system |
| Vault `TCC/arquitetura/Guia de Atualizacao do Frontend.md` | Guia de aceite + contrato |
| `docs/FRONTEND_ATUALIZACAO.md` | Espelho no repo |
| `.cursor/rules/documentacao-frontend.mdc` | Obriga documentar marcos no vault |
| `.cursor/rules/contrato-frontend.mdc` | Mantém tipos alinhados à API |

---

## Convenções

- Novas telas em `presentation/`, com rota lazy em `app.routes.ts`
- Novos endpoints: port → adapter HTTP → use-case → UI
- Assets estáticos em `public/assets/` (ex.: `assets/pixel-oracle-logo.svg`)
- Estilos globais / tokens em `src/styles*`; estilos de página no próprio componente
- Copy e métricas devem ser **honestas** (sem inventar Oracle Score / 94% de precisão)
- Mudanças relevantes de arquitetura/contrato/UX → atualizar o vault Obsidian

---

## Troubleshooting

| Sintoma | O que fazer |
|---------|-------------|
| Banner “API offline” | Suba `docker compose` na `PixelOracle-API`; confira `localhost:3000/api/health` |
| Erro 502/503 ao gerar relatório | ML service da API indisponível — veja logs do compose |
| Timeout na 1ª análise | Normal se embeddings estiverem carregando; espere até ~3 min |
| Dependências quebradas | Apague `node_modules` e rode `npm install` de novo |
| Build / styles | Tokens em `src/styles/_tokens.scss`; tipografia via Google Fonts no `index.html` |

---

## Fora de escopo (por enquanto)

- Chamar ml-service direto
- Histórico persistido de relatórios
- Autenticação / waitlist backend
- Personas Steam / `steamid` (proibido por conformidade)
