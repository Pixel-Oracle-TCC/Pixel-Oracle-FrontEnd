# PixelOracle

Projeto Angular **21** (standalone + Router) com uma landing page “PixelOracle”.

## Requisitos

- **Git**
- **Node.js LTS** (recomendado) + **npm**
- (Opcional) **Angular CLI** instalado globalmente
- **VS Code**

> Dica: este repo usa `"packageManager": "npm@11.13.0"` no `package.json`. Se sua versão do npm for diferente, normalmente funciona do mesmo jeito, mas você pode atualizar para ficar igual.

## Instalação do ambiente (Windows)

### 1) Instalar o Node.js

1. Baixe e instale a versão **LTS** do Node em `https://nodejs.org/`.
2. Feche e reabra o terminal.
3. Verifique:

```bash
node -v
npm -v
```

### 2) Instalar o Git

1. Baixe em `https://git-scm.com/download/win` e instale.
2. Verifique:

```bash
git --version
```

### 3) (Opcional) Instalar Angular CLI

O projeto roda com `npx` também, mas o CLI global ajuda.

```bash
npm i -g @angular/cli
ng version
```

## Instalação do ambiente (macOS)

### 1) Instalar Homebrew (recomendado)

Se você não tiver:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2) Instalar Node e Git

```bash
brew install node git
node -v
npm -v
git --version
```

### 3) (Opcional) Instalar Angular CLI

```bash
npm i -g @angular/cli
ng version
```

## Clonar o projeto

```bash
git clone <URL_DO_REPOSITORIO>
cd pixel-oracle
```

## Rodar o projeto no VS Code

### 1) Abrir no VS Code

No terminal dentro da pasta do projeto:

```bash
code .
```

### 2) Extensões recomendadas

- **Angular Language Service**
- **Prettier - Code formatter**

### 3) Instalar dependências

```bash
npm install
```

### 4) Subir o servidor (localhost)

```bash
npm start
```

Por padrão ele tenta `http://localhost:4200/`.

Se a porta estiver ocupada:

```bash
npm start -- --port 4201
```

Se você ver erro de watcher (ex.: **EMFILE** / “too many open files”):

```bash
npm start -- --poll 2000
```

## Scripts principais

```bash
# Dev server
npm start

# Build (produção)
npm run build

# Build (dev)
npx ng build -c development

# Testes
npm test
```

## Estrutura do projeto (o que importa)

- **`src/main.ts`**: bootstrap da aplicação (standalone).
- **`src/app/app.component.ts`**: componente raiz (só renderiza o `router-outlet`).
- **`src/app/app.config.ts`**: providers globais (router + zoneless).
- **`src/app/app.routes.ts`**: rotas da aplicação.
- **`src/app/home/`**: “página” principal (landing).
- **`public/`**: arquivos estáticos servidos como **`/assets/...`** (configurado no `angular.json`).
- **`src/styles.scss`**: estilos globais.

## Como criar páginas novas (padrão Angular)

Neste projeto usamos **standalone components** (sem NgModule).

### Opção A) Criar com Angular CLI (recomendado)

Exemplo criando uma página `about`:

```bash
npx ng generate component app/about --standalone --inline-template=false --inline-style=false
```

Isso vai gerar algo como:

- `src/app/about/about.component.ts`
- `src/app/about/about.component.html`
- `src/app/about/about.component.css` (ou `.scss` dependendo da sua config)

### Opção B) Criar manualmente (rápido)

Crie a pasta `src/app/nova-pagina/` e um componente standalone.

Exemplo mínimo (TypeScript):

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-nova-pagina',
  standalone: true,
  template: `<h1>Nova página</h1>`,
})
export class NovaPaginaComponent {}
```

## Como mexer no `app.routes.ts` (rotas)

Arquivo atual: `src/app/app.routes.ts`.

Ele exporta `routes: Routes` (usado em `provideRouter(routes)` no `app.config.ts`).

### Adicionar uma rota simples

1. Importe o componente.
2. Adicione um objeto `{ path, component, title }`.

Exemplo:

```ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'PixelOracle' },
  { path: 'about', component: AboutComponent, title: 'Sobre' },
  { path: '**', redirectTo: '' },
];
```

### Lazy loading (boa prática quando crescer)

Para páginas mais pesadas, prefira `loadComponent`:

```ts
export const routes: Routes = [
  {
    path: 'about',
    loadComponent: () =>
      import('./about/about.component').then((m) => m.AboutComponent),
    title: 'Sobre',
  },
];
```

## Assets (logo, imagens, etc.)

Este projeto serve assets a partir de `public/` (config em `angular.json`):

- Coloque arquivos em `public/assets/...`
- Use no HTML como: `assets/arquivo.svg` (vira `/assets/arquivo.svg`)

Exemplo: `public/assets/pixel-oracle-logo.svg` → `assets/pixel-oracle-logo.svg`

## Estilos

- **Global**: `src/styles.scss` (carregado pelo `angular.json`).
- **Por página**: no componente (ex.: `src/app/home/home.component.css`).

## Convenções recomendadas (pra manter “Angular-friendly”)

- Use **standalone components** para novas páginas.
- Mantenha páginas em pastas próprias: `src/app/<pagina>/...`.
- Rotas ficam centralizadas em `src/app/app.routes.ts`.
- Prefira **lazy loading** para rotas que crescerem.
- Assets sempre em `public/assets/`.

## Solução de problemas (rápido)

- **Porta 4200 ocupada**: `npm start -- --port 4201`
- **Watcher/EMFILE**: `npm start -- --poll 2000`
- **Dependências quebradas**: delete `node_modules` e rode `npm install` de novo.

