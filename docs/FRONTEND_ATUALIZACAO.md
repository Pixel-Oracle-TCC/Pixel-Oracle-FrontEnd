# Guia de Atualização do Frontend

Espelho da nota [[Guia de Atualizacao do Frontend]] do vault. O front consome o **contrato v3**: dashboard de evidências de reviews reais. Não há score de viabilidade, risco comercial nem chance de sucesso.

**Repos:** API em `PixelOracle-API` (porta `3000`). O front não chama o ml-service (`8000`).

Contrato: `PixelOracle-API/CONTRATOS_API.md`. Tipos: `api/src/domain/entities/FullReport.ts`, copiados em `src/app/domain/entities/full-report.ts`.

## O que a tela comunica

- Elogios e reclamações recorrentes, com métricas, jogos-exemplo e citações.
- Fatores decisivos do Random Forest: tabela para o que está no texto e uma lista única para horas e early access da Steam.
- Reviews de referência, com resposta do desenvolvedor quando houver.
- Jogos similares com a nota pública da Steam.
- Nenhum número de chance de sucesso. O faturamento Boxleiter é calculado no front para os jogos parecidos já lançados (reviews × 30 × preço), e não volta como campo da API.

Frase-guia: *"Descreva seu jogo. Veja o que jogadores de jogos parecidos mais elogiam e mais criticam — com números e trechos reais das reviews."*

## Endpoints

| Método | Path | Uso |
|--------|------|-----|
| `GET` | `/api/health` | Banner de API offline |
| `POST` | `/api/report` | Dashboard completo |

Obrigatórios no pitch: `titulo`, `descricao` (≥ 10), `genres` (≥ 1). Opcionais: `price_brl`, `top_k`.

## Estado do protótipo

`environment.useMockApi` está `true`. `MockReportRepository` devolve um `FullReport` ilustrativo no mesmo formato da API. O checkbox em `/analisar` simula o alerta `dados_insuficientes`.

Para usar a API real, mude `useMockApi` para `false`. O normalizador em `normalize-report.ts` já espera o contrato v3.

## Checklist de aceite

- [x] Tipos copiados de `FullReport.ts` (v3)
- [x] Formulário com título, descrição e gêneros (campo digitável com autocomplete)
- [x] Resumo + cobertura
- [x] Cards de elogios e reclamações com frase narrada, métricas, jogos-exemplo e citações
- [x] Fatores decisivos em tabela no texto e lista única para horas e early access
- [x] Alertas e empty state de `dados_insuficientes`
- [x] Cinco reviews positivas e cinco negativas, com os pontos encontrados e a resposta do desenvolvedor
- [x] Jogos similares com nota da Steam e faturamento aproximado (Boxleiter, só no front)
- [x] Texto de encaixe no mercado e pontos de atenção no desenvolvimento, sem chance de sucesso
- [x] Nenhum resquício de risco ou score na UI
- [ ] Erros 422 / 502 / 503 contra a API real (o adapter HTTP permanece; o protótipo não o exercita)
