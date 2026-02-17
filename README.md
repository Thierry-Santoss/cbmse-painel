# 🚒 Gestão de Ocorrências e Viaturas (VTR)

## 1) 🧭 Project Overview

Sistema para **gerenciar ocorrências de emergência** (Incêndio, Resgate, Acidente, Ambiental, etc.) e **despachar viaturas (VTRs)** para atendimento.

### ✅ Regras de negócio (principais)

- **Despacho de viaturas:** não deve ser possível despachar VTR para ocorrências **finalizadas** ou **canceladas**.
- **Transição de status:** fluxo esperado
  - `reported` -> `in_progress` -> `finished`

> Observação: o frontend consome uma **API Laravel** e foi otimizado para o fluxo **Windows + WSL2 + Docker**.

---

## 2) 🧰 Tech Stack

### 🎨 Frontend

- **Next.js:** `16.1.6`
- **React:** `19.2.3`
- **React Query (@tanstack/react-query):** `^5.90.21`
- **Tailwind CSS:** `^4`
- **Bootstrap:** `^5.3.8`

### 🧱 Backend

- **Laravel:** 10+
- **PHP:** 8.2+

### 🗄️ Database

- **PostgreSQL**

### 🛠️ Tools

- **Docker / Docker Compose**
- **Laragon** (domínio `.test`)
- **WSL2**

---

## ✅ Requirements

- **Node.js** (recomendado: LTS)
- **npm** (ou **yarn**)
- **PHP 8.2+**
- **Composer**
- **Docker + Docker Compose**
- **WSL2** (recomendado para ambiente Windows)

---

## 3) 🚀 Getting Started (Installation)

### 🎨 Frontend (este projeto)

Instale dependências:

```bash
npm install
# ou
yarn
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra:

- `http://localhost:3000`

### 🌐 Variáveis de ambiente (Frontend)

Crie um arquivo `.env.local` na raiz do projeto com:

```env
NEXT_PUBLIC_API_BASE_URL=http://url-base/api
```

> O frontend usa `NEXT_PUBLIC_API_BASE_URL` para centralizar o host da API.