# ⛩️ Central de Animes Premium (Trabalho Prático 1 - PI)

**Instituição:** Fatec Itu - Faculdade de Tecnologia de Itu  
**Curso:** Gestão da Tecnologia da Informação (GTI)  
**Disciplina:** Programação para a Internet (Prof. Ms. Ricardo Leme)  
**Alunos:** Ana Karolline dos Santos & Gustavo Almeida Barbosa
---

## 🎯 Sobre o Projeto

Este projeto é uma aplicação web funcional desenvolvida como Primeiro Trabalho Prático da disciplina de Programação para a Internet. A "Central de Animes Premium" tem como objetivo consumir dados de uma API externa (Jikan API), manipular o estado local do navegador para salvar animes favoritos e apresentar uma interface estilizada e responsiva.

**Acesse o projeto rodando (GitHub Pages):** [Insira o link do seu GitHub Pages aqui]

---

## ✅ Requisitos Atendidos (Critérios de Avaliação)

O projeto foi estruturado para cumprir todas as exigências do trabalho prático:

### 1. Interface e Estilização (HTML/CSS)
* **Formulários e Validação:** Implementamos um campo de busca inteligente que captura a entrada do usuário e impede o envio de dados vazios via validação com JavaScript.
* **Visual e CSS:** Uso exclusivo de CSS3 para toda a estilização, com aplicação de um tema "Dark/Neon", layouts baseados em Flexbox/Grid e assets visuais integrados com a temática de Animes.

### 2. Lógica e Dados (JavaScript)
* **Consumo de API:** Utilizamos o método `fetch()` de forma assíncrona para consultar a **Jikan API** (Baseada no MyAnimeList).
* **Atributos Exibidos:** A aplicação seleciona e renderiza na tela mais do que os 4 atributos mínimos exigidos: Título, Imagem de Capa, Nota (Score) e Sinopse original.
* **Persistência Local (LocalStorage):** O usuário pode favoritar animes pesquisados. Esses dados são convertidos em JSON e salvos de forma persistente no `localStorage` do navegador.
* **Gerenciamento (Exclusão):** Os animes salvos são exibidos dinamicamente na página, contendo botões de ação que permitem a exclusão individual do item do `localStorage` (via filtro de ID/Título). O modal de exclusão foi 100% customizado utilizando manipulação do DOM.
* **Modularidade:** O código JS foi dividido em escopos com funções claras para buscar, renderizar, salvar e excluir dados.

### 3. Documentação e Boas Práticas
* **JSDoc:** Todas as funções principais no arquivo JavaScript possuem cabeçalhos JSDoc contendo `@param`, `@returns` e uma breve descrição de sua finalidade.
* **README:** Este documento descreve o funcionamento do app e o processo de execução.

---

## 🚀 Como Executar o Projeto Localmente

1. Faça o clone deste repositório:
   ```bash
   git clone [https://github.com/](https://github.com/)[seu-usuario]/[nome-do-repositorio].git
