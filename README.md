# Dynamic Forms - Sistema de Formulários Dinâmicos

Aplicação web desenvolvida com **Next.js**, **TailwindCSS**, **Shadcn/ui** e **TypeScript**, permite criar formulários dinâmicos para coleta de respostas com sistema de condicionalidades.

![Next.js](https://img.shields.io/badge/Next.js-15.4.5-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38BDF8?logo=tailwindcss)
![Shadcn/ui](https://img.shields.io/badge/Shadcn/ui-Components-000000)

## 📋 Pré-requisitos

- **Node.js** versão 18 ou superior
- **npm**, **yarn**, **pnpm** ou **bun** para gerenciamento de pacotes

## 🔧 Instalação e Execução

### 1. Clone o repositório

```bash
git clone https://github.com/VitorArimatea/dynamic-form.git
cd dynamic-form
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Execute o projeto em modo de desenvolvimento

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

### 4. Acesse a aplicação

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🎯 Como Usar

### 1. Página Inicial

- Visualize todos os formulários criados
- Acesse opção para criar novo formulário
- Edite ou visualize formulários existentes

### 2. Criar Formulário

1. Acesse "Criar Formulário" na página inicial
2. Preencha título e descrição do formulário
3. Adicione perguntas usando o botão "Adicionar Pergunta"
4. Configure cada pergunta:
   - **Título**: Titulo da pergunta
   - **Tipo**: Escolha entre os tipos disponíveis
   - **Orientação**: Dica para o usuário
   - **Obrigatória**: Marque se a pergunta é obrigatória
   - **Sub-pergunta**: Marque para criar condicionalidades
   - **Opções**: Para perguntas de múltipla/única escolha
5. Salve o formulário

### 3. Sistema de Condicionalidades

- **Sub-perguntas** só aparecem quando marcadas como tal
- A lógica implementada mostra sub-perguntas quando:
  - Pergunta anterior (Sim/Não): resposta = "Sim"
  - Pergunta anterior (única escolha): resposta ≠ última opção

### 4. Preencher Formulário

1. Acesse um formulário através da página inicial
2. Responda as perguntas seguindo as orientações
3. Observe que sub-perguntas aparecem dinamicamente
4. Submeta as respostas (validação automática)

## 🔄 Sistema de Dados

### Estrutura Mockada

Os dados são armazenados em memória durante o desenvolvimento.

## 📄 Licença

Este projeto foi desenvolvido como parte de um desafio técnico.
